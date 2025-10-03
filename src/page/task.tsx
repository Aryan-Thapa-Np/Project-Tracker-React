import React, { useEffect, useState } from "react";
import Sidebar from "../sub-components/sidebar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Clipboard, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../sub-components/csrfToken.tsx";

interface Task {
    task_id: number;
    id: number;
    task_name: string;
    project_name: string;
    milestone_name: string;
    status: "todo" | "in_progress" | "completed";
    due_date: string | null;
    priority: "low" | "medium" | "high" | "urgent";
}

const priorityClass = (p: Task["priority"]) => {
    switch (p) {
        case "low":
            return "bg-gray-100 text-gray-700";
        case "medium":
            return "bg-blue-100 text-blue-700";
        case "high":
            return "bg-orange-100 text-orange-700";
        case "urgent":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const statusClass = (s: Task["status"]) => {
    switch (s) {
        case "todo":
            return "bg-gray-100 text-gray-700";
        case "in_progress":
            return "bg-yellow-100 text-yellow-700";
        case "completed":
            return "bg-green-100 text-green-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const Task: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [newStatus, setNewStatus] = useState<Task["status"]>("todo");

    const fetchTasks = async (p = 1) => {
        try {
            setLoading(true);
            const res = await fetch(`${apiUrl}/api/users/getMytask?page=${p}&limit=15`, {
                credentials: "include",
            });
            const data = await res.json();

            if (data.success) {
                const tasksArr = Array.isArray(data.tasks) ? data.tasks : [];

                setTasks(tasksArr);

                const pagination = data.pagination || {};
                const gotPage = pagination.page ? Number(pagination.page) : 1;
                const gotTotal = pagination.totalPages ? Number(pagination.totalPages) : 1;

                setPage(gotPage);
                setTotalPages(Math.max(1, gotTotal));
            } else {
                toast.error(data.error || "Failed to fetch tasks");
                setTasks([]);
                setPage(1);
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch tasks");
            setTasks([]);
            setPage(1);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(page);
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [page]);

    const updateStatus = async () => {
        if (!selectedTask) return;
        try {
            const csrfToken = await getCsrfToken();
            const res = await fetch(`${apiUrl}/api/users/updateTaskStatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken,
                },
                body: JSON.stringify({
                    task_id: selectedTask.task_id,
                    status: newStatus,
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Status updated");
                setSelectedTask(null);
                fetchTasks(page);
            } else {
                toast.error(data.error || "Failed to update");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error updating status");
        }
    };

    const SkeletonRow = () => (
        <tr className="border-b border-gray-200">
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/6 mx-auto"></div>
            </td>
        </tr>
    );

    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar />
            <div className="content-area flex-1 h-screen overflow-y-auto">
                <section className="py-24 px-8 min-h-[85vh]">
                    <div className="p-2 pt-5">
                        <div className="p-1 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-1">My Tasks</h2>
                                <p className="text-sm text-gray-500">
                                    Tasks assigned to you across projects — update status as you work.
                                </p>
                            </div>
                            <div></div>
                        </div>

                        <div className="bg-white rounded-md shadow-md overflow-x-auto mt-6">
                            {showSkeleton ? (
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-6 py-3">Task</th>
                                            <th className="px-6 py-3">Project</th>
                                            <th className="px-6 py-3">Milestone</th>
                                            <th className="px-6 py-3">Priority</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Due Date</th>
                                            <th className="px-6 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(5)].map((_, index) => (
                                            <SkeletonRow key={`skeleton-row-${index}`} />
                                        ))}
                                    </tbody>
                                </table>
                            ) : loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="w-9 h-9 border-4 border-t-transparent rounded-full animate-spin border-blue-500" />
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 space-y-3 text-gray-500">
                                    <Clipboard size={56} className="text-gray-300" aria-hidden />
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        No task assigned to you right now
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        You currently have no tasks. Check back later or contact your project manager.
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-6 py-3">Task</th>
                                            <th className="px-6 py-3">Project</th>
                                            <th className="px-6 py-3">Milestone</th>
                                            <th className="px-6 py-3">Priority</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Due Date</th>
                                            <th className="px-6 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task, index) => {

                                            const rowKey = task.id ? `task-${task.id}` : `task-fallback-${index}`;
                                            const due = task.due_date ? new Date(task.due_date) : null;
                                            const dueStr = due && !isNaN(due.getTime())
                                                ? due.toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                                : "-";

                                            return (
                                                <tr
                                                    key={rowKey}
                                                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-6 py-4 font-medium text-gray-700">
                                                        {task.task_name}
                                                    </td>
                                                    <td className="px-6 py-4">{task.project_name}</td>
                                                    <td className="px-6 py-4">{task.milestone_name}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClass(
                                                                task.priority
                                                            )}`}
                                                        >
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                                                                task.status
                                                            )}`}
                                                        >
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">{dueStr}</td>
                                                    <td
                                                        className="px-6 py-4 cursor-pointer text-blue-600 text-center"
                                                        onClick={() => {
                                                            setSelectedTask(task);
                                                            setNewStatus(task.status);
                                                        }}
                                                        role="button"
                                                        aria-label={`Edit task ${task.task_name}`}
                                                    >
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <div>
                                {totalPages > 1 && !showSkeleton ? (
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={16} />
                                        <span className="sr-only">Previous</span>
                                    </button>
                                ) : (
                                    <div />
                                )}
                            </div>

                            {totalPages > 0 && !showSkeleton ? (
                                <div className="text-sm text-gray-600">
                                    Page <span className="font-medium">{page}</span> /{" "}
                                    <span className="font-medium">{totalPages}</span> pages
                                </div>
                            ) : null}

                            <div>
                                {totalPages > 1 && !showSkeleton ? (
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
                                        aria-label="Next page"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {selectedTask && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h3 className="text-lg font-bold mb-2">Update Task Status</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            <span className="font-medium">{selectedTask.task_name}</span>{" "}
                            — {selectedTask.project_name}
                        </p>

                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as Task["status"])}
                            className="border p-2 rounded w-full mb-4"
                            aria-label="Select task status"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Priority:{" "}
                                <span className="font-medium capitalize">{selectedTask.priority}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="cursor-pointer px-4 py-2 bg-gray-200 rounded"
                                    aria-label="Cancel status update"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateStatus}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded"
                                    aria-label="Save status update"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;