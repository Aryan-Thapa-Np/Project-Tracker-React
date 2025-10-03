import React, { useEffect, useState } from 'react';
import Sidebar from "../sub-components/sidebar.tsx";
import { CirclePlus, ClipboardList } from "lucide-react";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../sub-components/csrfToken.tsx";
import { escapeHTML } from "../sub-components/sanitize.tsx";

interface Task {
    task_id: number;
    task_name: string;
    project_name: string;
    status: string;
    priority: string;
    due_date: string;
    username: string;
    profile_pic?: string;
}

interface Project { project_id: number; project_name: string; }
interface User { user_id: number; username: string; profile_pic?: string; }
interface Milestone { milestone_id: number; milestone_name: string; }

const TeamTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [filters, setFilters] = useState({ project: "", status: "", member: "", dueDate: "" });
    const [isModalOpen, setModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ project_id: "", milestone_id: "", user_id: "", task_name: "", due_date: "" });

    useEffect(() => {
        fetch(`${apiUrl}/api/users/projectsName`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data);
                else if (Array.isArray(data.projects)) setProjects(data.projects);
                else setProjects([]);
            })
            .catch(() => toast.error("Failed to fetch projects"));

        fetch(`${apiUrl}/api/users/userNames`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setUsers(data);
                else if (Array.isArray(data.users)) setUsers(data.users);
                else setUsers([]);
            })
            .catch(() => toast.error("Failed to fetch users"));
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(filters as Record<string, string>).toString();
        fetch(`${apiUrl}/api/users/getAllTeamTasks?${query}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTasks(data);
                else if (Array.isArray(data.tasks)) setTasks(data.tasks);
                else setTasks([]);
            })
            .catch(() => toast.error("Failed to fetch tasks"));
    }, [filters]);

    // Fetch milestones when project is selected
    useEffect(() => {
        if (newTask.project_id) {
            fetch(`${apiUrl}/api/users/milestones/${newTask.project_id}`, { credentials: "include" })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMilestones(data);
                    else if (Array.isArray(data.milestones)) setMilestones(data.milestones);
                    else setMilestones([]);
                })
                .catch(() => {
                    toast.error("Failed to fetch milestones");
                    setMilestones([]);
                });
        } else {
            setMilestones([]);
            setNewTask({ ...newTask, milestone_id: "" });
        }
    }, [newTask.project_id]);

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
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
            // Refresh tasks
            const query = new URLSearchParams(filters as Record<string, string>).toString();
            fetch(`${apiUrl}/api/users/getAllTeamTasks?${query}`, { credentials: "include" })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setTasks(data);
                    else if (Array.isArray(data.tasks)) setTasks(data.tasks);
                    else setTasks([]);
                });
        } catch (err) {
            toast.error(err && typeof err === "object" && "error" in err
                ? String((err as { error: unknown }).error)
                : "Error assigning task");
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 bg-gray-100 h-screen">
                <div className="max-w-7xl mx-auto p-2">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Team Tasks</h1>
                            <p className="text-gray-500 mt-1">Manage and track your team's tasks.</p>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <CirclePlus size={18} />
                            <span>Assign Task</span>
                        </button>
                    </header>

                    <div className="bg-white rounded-sm shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Project</label>
                            <select onChange={e => setFilters({ ...filters, project: e.target.value })} className="mt-1 block w-full rounded-sm border-gray-300 p-2">
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
                            <select onChange={e => setFilters({ ...filters, status: e.target.value })} className="mt-1 block w-full rounded-sm border-gray-300 p-2">
                                <option value="">All Statuses</option>
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Team Member</label>
                            <select onChange={e => setFilters({ ...filters, member: e.target.value })} className="mt-1 block w-full rounded-sm border-gray-300 p-2">
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
                            <input type="date" onChange={e => setFilters({ ...filters, dueDate: e.target.value })} className="mt-1 block w-full p-2 rounded-sm border-gray-300" />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
                                <ClipboardList size={64} className="text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks created yet</h3>
                                <p className="text-gray-500 mb-6">Get started by assigning a task to your team</p>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                    <CirclePlus size={18} />
                                    <span>Assign First Task</span>
                                </button>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.task_id} className="bg-white shadow-sm rounded p-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <img src={task.profile_pic || "/default-avatar.png"} className="w-10 h-10 rounded-full" alt={task.username} />
                                        <h2 className="text-xl font-bold">{task.username}</h2>
                                    </div>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 text-xs">
                                                <th className="px-3 py-2">Task</th>
                                                <th className="px-3 py-2">Project</th>
                                                <th className="px-3 py-2">Status</th>
                                                <th className="px-3 py-2">Priority</th>
                                                <th className="px-3 py-2">Due</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-3 py-2">{task.task_name}</td>
                                                <td className="px-3 py-2">{task.project_name}</td>
                                                <td className="px-3 py-2">{task.status}</td>
                                                <td className="px-3 py-2">{task.priority}</td>
                                                <td className="px-3 py-2">{task.due_date}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Assign Task</h2>
                        <form onSubmit={handleAssignTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                                <select 
                                    required 
                                    value={newTask.project_id}
                                    onChange={e => setNewTask({ ...newTask, project_id: e.target.value, milestone_id: "" })} 
                                    className="w-full p-2 border rounded">
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
                                    disabled={!newTask.project_id}>
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
                                    className="w-full p-2 border rounded">
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
                                    onChange={e => setNewTask({ ...newTask, task_name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={newTask.due_date}
                                    className="w-full p-2 border rounded" 
                                    onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setModalOpen(false);
                                        setNewTask({ project_id: "", milestone_id: "", user_id: "", task_name: "", due_date: "" });
                                    }} 
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamTasks;