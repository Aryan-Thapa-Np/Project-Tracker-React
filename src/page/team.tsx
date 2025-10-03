import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from "../sub-components/sidebar.tsx";
import { CirclePlus, ClipboardList, AlertCircle, CircleAlert, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../sub-components/csrfToken.tsx";
import { escapeHTML } from "../sub-components/sanitize.tsx";

interface Task {
    task_id: number;
    task_name: string;
    project_name: string;
    milestone_name: string;
    status: string;
    priority: string;
    due_date: string;
    username: string;
    profile_pic?: string;
}

interface Project { project_id: number; project_name: string; }
interface User { user_id: number; username: string; profile_pic?: string; }
interface Milestone { milestone_id: number; milestone_name: string; }

const FilterControls: React.FC<{
    projects: Project[];
    users: User[];
    filters: { project: string; status: string; member: string; dueDate: string };
    setFilters: React.Dispatch<React.SetStateAction<{ project: string; status: string; member: string; dueDate: string }>>;
}> = ({ projects, users, filters, setFilters }) => {
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, [setFilters]);

    return (
        <div className="bg-white rounded-sm shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Project</label>
                <select
                    value={filters.project}
                    onChange={e => handleFilterChange('project', e.target.value)}
                    className="mt-1 block w-full rounded-sm border-gray-300 p-2"
                    aria-label="Filter by project"
                >
                    <option value="">All Projects</option>
                    {projects.map((p, idx) => (
                        <option key={p.project_id ?? `filter-project-${idx}`} value={p.project_id}>
                            {p.project_name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                    value={filters.status}
                    onChange={e => handleFilterChange('status', e.target.value)}
                    className="mt-1 block w-full rounded-sm border-gray-300 p-2"
                    aria-label="Filter by status"
                >
                    <option value="">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Team Member</label>
                <select
                    value={filters.member}
                    onChange={e => handleFilterChange('member', e.target.value)}
                    className="mt-1 block w-full rounded-sm border-gray-300 p-2"
                    aria-label="Filter by team member"
                >
                    <option value="">All Members</option>
                    {users.map((u, idx) => (
                        <option key={u.user_id ?? `filter-user-${idx}`} value={u.user_id}>
                            {u.username}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                    type="date"
                    value={filters.dueDate}
                    onChange={e => handleFilterChange('dueDate', e.target.value)}
                    className="mt-1 block w-full p-2 rounded-sm border-gray-300"
                    aria-label="Filter by due date"
                />
            </div>
        </div>
    );
};

const TaskList: React.FC<{
    tasks: Task[];
    getPriorityIcon: (priority: string) => React.JSX.Element | null;
    getStatusBgColor: (status: string) => string;
    formatDate: (dateString: string) => string;
}> = ({ tasks, getPriorityIcon, getStatusBgColor, formatDate }) => {
    return tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <ClipboardList size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks created yet</h3>
            <p className="text-gray-500 mb-6">Get started by assigning a task to your team</p>
            <button
                onClick={() => document.getElementById('assign-task-btn')?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
                <CirclePlus size={18} />
                <span>Assign First Task</span>
            </button>
        </div>
    ) : (
        <div className="space-y-8">
            {tasks.map(task => (
                <div key={task.task_id} className="bg-white shadow-sm rounded p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={task.profile_pic || "/default-avatar.png"}
                            className="w-10 h-10 rounded-full"
                            alt={`${task.username}'s avatar`}
                        />
                        <h2 className="text-xl font-bold">{task.username}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                                    <th className="px-4 py-3 text-left">Task</th>
                                    <th className="px-4 py-3 text-left">Project</th>
                                    <th className="px-4 py-3 text-left">Milestone</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Priority</th>
                                    <th className="px-4 py-3 text-left">Due</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="px-4 py-3 font-medium">{task.task_name}</td>
                                    <td className="px-4 py-3 font-medium">{task.project_name}</td>
                                    <td className="px-4 py-3 font-medium">{task.milestone_name}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full ${getStatusBgColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        {getPriorityIcon(task.priority)}
                                        {task.priority}
                                    </td>
                                    <td className="px-4 py-3">{formatDate(task.due_date)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AssignTaskModal: React.FC<{
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projects: Project[];
    milestones: Milestone[];
    users: User[];
    newTask: { project_id: string; milestone_id: string; user_id: string; task_name: string; due_date: string };
    setNewTask: React.Dispatch<React.SetStateAction<{ project_id: string; milestone_id: string; user_id: string; task_name: string; due_date: string }>>;
    handleAssignTask: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
}> = ({ isModalOpen, setModalOpen, projects, milestones, users, newTask, setNewTask, handleAssignTask, isLoading }) => {
    const handleCancel = useCallback(() => {
        setModalOpen(false);
        setNewTask({ project_id: "", milestone_id: "", user_id: "", task_name: "", due_date: "" });
    }, [setModalOpen, setNewTask]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" aria-modal="true" role="dialog">
                <h2 className="text-xl font-bold mb-4">Assign Task</h2>
                <form onSubmit={handleAssignTask} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                        <select
                            required
                            value={newTask.project_id}
                            onChange={e => setNewTask({ ...newTask, project_id: e.target.value, milestone_id: "" })}
                            className="w-full p-2 border rounded"
                            aria-label="Select project"
                        >
                            <option value="">Select Project</option>
                            {projects.map((p, idx) => (
                                <option key={p.project_id ?? `project-${idx}`} value={p.project_id}>
                                    {p.project_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Milestone</label>
                        <select
                            required
                            value={newTask.milestone_id}
                            onChange={e => setNewTask({ ...newTask, milestone_id: e.target.value })}
                            className="w-full p-2 border rounded"
                            disabled={!newTask.project_id}
                            aria-label="Select milestone"
                        >
                            <option value="">Select Milestone</option>
                            {milestones.map((m, idx) => (
                                <option key={m.milestone_id ?? `milestone-${idx}`} value={m.milestone_id}>
                                    {m.milestone_name}
                                </option>
                            ))}
                        </select>
                        {!newTask.project_id && (
                            <p className="text-xs text-gray-500 mt-1">Select a project first</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                        <select
                            required
                            value={newTask.user_id}
                            onChange={e => setNewTask({ ...newTask, user_id: e.target.value })}
                            className="w-full p-2 border rounded"
                            aria-label="Select team member"
                        >
                            <option value="">Select Team Member</option>
                            {users.map((u, idx) => (
                                <option key={u.user_id ?? `user-${idx}`} value={u.user_id}>
                                    {u.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                        <input
                            required
                            placeholder="Enter task name"
                            value={newTask.task_name}
                            className="w-full p-2 border rounded"
                            onChange={e => setNewTask({ ...newTask, task_name: e.target.value })}
                            aria-label="Task name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            required
                            value={newTask.due_date}
                            className="w-full p-2 border rounded"
                            onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                            aria-label="Due date"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            aria-label="Cancel task assignment"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                            aria-label="Assign task"
                        >
                            {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {isLoading ? "Assigning..." : "Assign Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TeamTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [filters, setFilters] = useState({ project: "", status: "", member: "", dueDate: "" });
    const [isModalOpen, setModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ project_id: "", milestone_id: "", user_id: "", task_name: "", due_date: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setShowSkeleton(true);

        const timer = setTimeout(() => {
            if (isMounted) setShowSkeleton(false);
        }, 1000);

        Promise.all([
            fetch(`${apiUrl}/api/users/projectsName`, { credentials: "include" })
                .then(res => res.json())
                .then(data => {
                    if (isMounted) {
                        if (Array.isArray(data)) setProjects(data);
                        else if (Array.isArray(data.projects)) setProjects(data.projects);
                        else setProjects([]);
                    }
                })
                .catch(() => {
                    if (isMounted) toast.error("Failed to fetch projects");
                }),
            fetch(`${apiUrl}/api/users/userNames`, { credentials: "include" })
                .then(res => res.json())
                .then(data => {
                    if (isMounted) {
                        if (Array.isArray(data)) setUsers(data);
                        else if (Array.isArray(data.users)) setUsers(data.users);
                        else setUsers([]);
                    }
                })
                .catch(() => {
                    if (isMounted) toast.error("Failed to fetch users");
                })
        ]).finally(() => {
            if (isMounted) setIsLoading(false);
        });

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        const queryParams = new URLSearchParams({
            ...(filters.project && { project_id: filters.project }),
            ...(filters.status && { status: filters.status }),
            ...(filters.member && { assigned_to: filters.member }),
            ...(filters.dueDate && { due_date: filters.dueDate })
        }).toString();

        fetch(`${apiUrl}/api/users/getAllTeamTasks?${queryParams}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    if (Array.isArray(data)) setTasks(data);
                    else if (Array.isArray(data.tasks)) setTasks(data.tasks);
                    else setTasks([]);
                }
            })
            .catch(() => {
                if (isMounted) toast.error("Failed to fetch tasks");
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [filters]);

    useEffect(() => {
        let isMounted = true;
        if (newTask.project_id) {
            setIsLoading(true);
            fetch(`${apiUrl}/api/users/milestones/${newTask.project_id}`, { credentials: "include" })
                .then(res => res.json())
                .then(data => {
                    if (isMounted) {
                        if (Array.isArray(data)) setMilestones(data);
                        else if (Array.isArray(data.milestones)) setMilestones(data.milestones);
                        else setMilestones([]);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        toast.error("Failed to fetch milestones");
                        setMilestones([]);
                    }
                })
                .finally(() => {
                    if (isMounted) setIsLoading(false);
                });
        } else {
            if (isMounted) {
                setMilestones([]);
                setNewTask({ ...newTask, milestone_id: "" });
            }
        }

        return () => {
            isMounted = false;
        };
    }, [newTask.project_id]);

    const handleAssignTask = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/users/assignTask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": await getCsrfToken()
                },
                credentials: "include",
                body: JSON.stringify({
                    project_id: escapeHTML(newTask.project_id),
                    milestone_id: escapeHTML(newTask.milestone_id),
                    assigned_to: escapeHTML(newTask.user_id),
                    task_name: escapeHTML(newTask.task_name),
                    due_date: escapeHTML(newTask.due_date),
                })
            });
            if (!res.ok) throw new Error("Failed to assign task");
            toast.success("Task assigned successfully");
            setModalOpen(false);
            setNewTask({ project_id: "", milestone_id: "", user_id: "", task_name: "", due_date: "" });
            const queryParams = new URLSearchParams({
                ...(filters.project && { project_id: filters.project }),
                ...(filters.status && { status: filters.status }),
                ...(filters.member && { assigned_to: filters.member }),
                ...(filters.dueDate && { due_date: filters.dueDate })
            }).toString();
            fetch(`${apiUrl}/api/users/getAllTeamTasks?${queryParams}`, { credentials: "include" })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setTasks(data);
                    else if (Array.isArray(data.tasks)) setTasks(data.tasks);
                    else setTasks([]);
                })
                .finally(() => setIsLoading(false));
        } catch (err) {
            toast.error(err && typeof err === "object" && "error" in err
                ? String((err as { error: unknown }).error)
                : "Error assigning task");
            setIsLoading(false);
        }
    }, [filters, newTask]);

    const getPriorityIcon = useCallback((priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return <AlertCircle className="text-red-500" size={18} />;
            case 'medium':
                return <CircleAlert className="text-yellow-500" size={18} />;
            case 'low':
                return <CheckCircle className="text-green-500" size={18} />;
            default:
                return null;
        }
    }, []);

    const getStatusBgColor = useCallback((status: string) => {
        switch (status.toLowerCase()) {
            case 'todo':
                return 'bg-red-100 text-red-800';
            case 'in_progress':
                return 'bg-yellow-100 p-1 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }, []);

    const formatDate = useCallback((dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    }, []);

    return (
        <div className="flex w-full min-h-screen bg-gray-100" aria-busy={isLoading || showSkeleton}>
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 bg-gray-100 h-screen">
                <div className="max-w-7xl mx-auto p-2 pt-15">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Team Tasks</h1>
                            <p className="text-gray-500 mt-1">Manage and track your team's tasks.</p>
                        </div>
                        <button
                            id="assign-task-btn"
                            onClick={() => setModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                            aria-label="Assign a new task"
                        >
                            <CirclePlus size={18} />
                            <span>Assign Task</span>
                        </button>
                    </header>

                    <FilterControls projects={projects} users={users} filters={filters} setFilters={setFilters} />

                    {isLoading || showSkeleton ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, idx) => (
                                <div key={`skeleton-${idx}`} className="bg-white shadow-sm rounded p-4 animate-pulse">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                        <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                    </div>
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                                                <th className="px-4 py-3 text-left">Task</th>
                                                <th className="px-4 py-3 text-left">Project</th>
                                                <th className="px-4 py-3 text-left">Milestone</th>
                                                <th className="px-4 py-3 text-left">Status</th>
                                                <th className="px-4 py-3 text-left">Priority</th>
                                                <th className="px-4 py-3 text-left">Due</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-3"><div className="h-4 w-3/4 bg-gray-200 rounded"></div></td>
                                                <td className="px-4 py-3"><div className="h-4 w-1/2 bg-gray-200 rounded"></div></td>
                                                <td className="px-4 py-3"><div className="h-4 w-1/3 bg-gray-200 rounded"></div></td>
                                                <td className="px-4 py-3"><div className="h-4 w-1/4 bg-gray-200 rounded"></div></td>
                                                <td className="px-4 py-3"><div className="h-4 w-1/3 bg-gray-200 rounded"></div></td>
                                                <td className="px-4 py-3"><div className="h-4 w-1/4 bg-gray-200 rounded"></div></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            getPriorityIcon={getPriorityIcon}
                            getStatusBgColor={getStatusBgColor}
                            formatDate={formatDate}
                        />
                    )}

                    <AssignTaskModal
                        isModalOpen={isModalOpen}
                        setModalOpen={setModalOpen}
                        projects={projects}
                        milestones={milestones}
                        users={users}
                        newTask={newTask}
                        setNewTask={setNewTask}
                        handleAssignTask={handleAssignTask}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
};

export default TeamTasks;