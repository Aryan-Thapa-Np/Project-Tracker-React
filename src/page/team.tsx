import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from "../sub-components/sidebar.tsx";
import {
    CirclePlus,
    ClipboardList,
    AlertCircle,
    CircleAlert,
    CheckCircle,
    AlertTriangle,
    Eye,
    Trash2,
    Plus,
    X,
} from "lucide-react";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../sub-components/csrfToken.tsx";
import { escapeHTML } from "../sub-components/sanitize.tsx";
import type { User } from "../types/usersFTypes.tsx";

interface Task {
    task_id: number;
    task_name: string;
    project_id: number;
    project_name: string;
    milestone_id: number;
    milestone_name: string;
    status: string;
    priority: string;
    due_date: string;
    assigned_to: number;
    username: string;
    profile_pic?: string;
}

interface Project { project_id: number; project_name: string; }
interface Milestone { milestone_id: number; milestone_name: string; }

/* -------------------------------------------------------------------------- */
/*                               FILTER CONTROLS                              */
/* -------------------------------------------------------------------------- */
const FilterControls: React.FC<{
    projects: Project[];
    users: User[];
    filters: { project: string; status: string; member: string; dueDate: string };
    setFilters: React.Dispatch<
        React.SetStateAction<{ project: string; status: string; member: string; dueDate: string }>
    >;
}> = ({ projects, users, filters, setFilters }) => {
    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        [setFilters]
    );

    return (
        <div className="bg-white rounded-sm shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="text-sm  font-medium text-gray-700">Project</label>
                <select
                    value={filters.project}
                    onChange={(e) => handleFilterChange("project", e.target.value)}
                    className="mt-1 block w-full rounded-sm outline-1 border-gray-300 p-2"
                >
                    <option value="">All Projects</option>
                    {projects.map((p) => (
                        <option key={p.project_id} value={p.project_id}>
                            {p.project_name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="mt-1 outline-1 block w-full rounded-sm border-gray-300 p-2"
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
                    onChange={(e) => handleFilterChange("member", e.target.value)}
                    className="mt-1 outline-1 block w-full rounded-sm border-gray-300 p-2"
                >
                    <option value="">All Members</option>
                    {users.map((u) => (
                        <option key={u.user_id} value={u.user_id}>
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
                    onChange={(e) => handleFilterChange("dueDate", e.target.value)}
                    className="mt-1 outline-1 block w-full p-2 rounded-sm border-gray-300"
                />
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                               VIEW TASK MODAL                              */
/* -------------------------------------------------------------------------- */
const ViewTaskModal: React.FC<{
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    task: Task | null;
    formatDate: (d: string) => string;
    getStatusBgColor: (s: string) => string;
    getPriorityIcon: (p: string) => React.JSX.Element | null;
}> = ({ isModalOpen, setModalOpen, task, formatDate, getStatusBgColor, getPriorityIcon }) => {
    if (!isModalOpen || !task) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm shadow-2xl p-8 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Task Details</h2>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                        <img
                            src={task.profile_pic || "/default-avatar.png"}
                            alt={`${task.username}'s avatar`}
                            className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Assigned to</p>
                            <p className="text-md font-semibold text-gray-700">{task.username}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Task Name</p>
                        <p className="text-md font-semibold text-gray-700">{task.task_name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Project</p>
                        <p className="text-md font-semibold text-gray-700">{task.project_name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Milestone</p>
                        <p className="text-md font-semibold text-gray-700">{task.milestone_name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <span className={`inline-flex px-3 py-1  mt-1 rounded-full text-[13px] font-semibold ${getStatusBgColor(task.status)}`}>
                            {task.status.replace("_", " ").toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Priority</p>
                        <div className="flex items-center gap-2">
                            {getPriorityIcon(task.priority)}
                            <span className="text-md font-semibold text-gray-700">{task.priority.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-600">Due Date</p>
                        <p className="text-md font-semibold text-gray-700">{formatDate(task.due_date)}</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                              DELETE TASK MODAL                             */
/* -------------------------------------------------------------------------- */
const DeleteTaskModal: React.FC<{
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleConfirmDelete: () => Promise<void>;
    isLoading: boolean;
}> = ({ isModalOpen, setModalOpen, handleConfirmDelete, isLoading }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-sm hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center gap-2"
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                                 TASK LIST                                  */
/* -------------------------------------------------------------------------- */
const TaskList: React.FC<{
    tasks: Task[];
    getPriorityIcon: (p: string) => React.JSX.Element | null;
    getStatusBgColor: (s: string) => string;
    formatDate: (d: string) => string;
    handleEdit: (t: Task) => void;
    handleView: (t: Task) => void;
    isloading: boolean;
    handleOpenDeleteModal: (taskId: number) => void;
}> = ({ tasks, getPriorityIcon, getStatusBgColor, formatDate, handleEdit, handleView,isloading, handleOpenDeleteModal }) => {
    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    };


    if (tasks.length !== 0 && !isloading) {

        return (
            <div className="space-y-8">
                {tasks.map((task) => (
                    <div key={task.task_id} className="bg-white shadow-sm rounded p-4">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={task.profile_pic || "/image.png"}
                                alt={`${task.username}'s avatar`}
                                className="w-10 h-10 rounded-full"
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
                                        <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t ">
                                        <td className="px-4 py-3 font-normal" title={task.task_name}>
                                            {truncateText(task.task_name, 100)}
                                        </td>
                                        <td className="px-4 py-3 font-normal" title={task.project_name}>
                                            {truncateText(task.project_name, 50)}
                                        </td>
                                        <td className="px-4 py-3 font-normal" title={task.milestone_name}>
                                            {truncateText(task.milestone_name, 50)}
                                        </td>
                                        <td>
                                            <span
                                                className={`px-3 py-1 rounded-full ${getStatusBgColor(
                                                    task.status
                                                )}`}
                                            >
                                                {truncateText(task.status.replace("_", " "), 25)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            {getPriorityIcon(task.priority)}
                                            {truncateText(task.priority, 25)}
                                        </td>
                                        <td className="px-4 py-3">{formatDate(task.due_date)}</td>
                                        <td className="px-4 py-3 flex gap-2 items-center">
                                            <button
                                                onClick={() => handleView(task)}
                                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(task)}
                                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                title="Edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteModal(task.task_id)}
                                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    }


    if (tasks.length === 0 ) {



        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
                <ClipboardList size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No tasks created yet
                </h3>
                <p className="text-gray-500 mb-6">
                    Get started by assigning a task to your team
                </p>
                <button
                    onClick={() => document.getElementById("assign-task-btn")?.click()}
                    className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <CirclePlus size={18} />
                    Assign First Task
                </button>
            </div>
        );

    }



};

/* -------------------------------------------------------------------------- */
/*                             ASSIGN TASK MODAL                              */
/* -------------------------------------------------------------------------- */
const AssignTaskModal: React.FC<{
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projects: Project[];
    milestones: Milestone[];
    users: User[];
    newTask: {
        project_id: string;
        milestone_id: string;
        user_id: string;
        task_name: string;
        due_date: string;
        priority: string;
    };
    setNewTask: React.Dispatch<
        React.SetStateAction<{
            project_id: string;
            milestone_id: string;
            user_id: string;
            task_name: string;
            due_date: string;
            priority: string;
        }>
    >;
    handleAssignTask: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
}> = ({
    isModalOpen,
    setModalOpen,
    projects,
    milestones,
    users,
    newTask,
    setNewTask,
    handleAssignTask,
    isLoading,
}) => {
        const handleCancel = useCallback(() => {
            setModalOpen(false);
            setNewTask({
                project_id: "",
                milestone_id: "",
                user_id: "",
                task_name: "",
                due_date: "",
                priority: "",
            });
        }, [setModalOpen, setNewTask]);

        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-sm p-6 w-full max-w-md shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Assign Task</h2>
                    <form onSubmit={handleAssignTask} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project
                            </label>
                            <select
                                required
                                value={newTask.project_id}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, project_id: e.target.value, milestone_id: "" })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Project</option>
                                {projects.map((p) => (
                                    <option key={p.project_id} value={p.project_id}>
                                        {p.project_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Milestone
                            </label>
                            <select
                                required
                                value={newTask.milestone_id}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, milestone_id: e.target.value })
                                }
                                disabled={!newTask.project_id}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Milestone</option>
                                {milestones.map((m) => (
                                    <option key={m.milestone_id} value={m.milestone_id}>
                                        {m.milestone_name}
                                    </option>
                                ))}
                            </select>
                            {!newTask.project_id && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Select a project first
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign To
                            </label>
                            <select
                                required
                                value={newTask.user_id}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, user_id: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Team Member</option>
                                {users.map((u) => (
                                    <option key={u.user_id} value={u.user_id}>
                                        {u.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Name
                            </label>
                            <input
                                required
                                placeholder="Enter task name"
                                value={newTask.task_name}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, task_name: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                required
                                value={newTask.due_date}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, due_date: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                required
                                value={newTask.priority}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, priority: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center cursor-pointer rounded-sm bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                {isLoading && (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {isLoading ? "Assigning..." : "Assign Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

/* -------------------------------------------------------------------------- */
/*                              EDIT TASK MODAL                               */
/* -------------------------------------------------------------------------- */
const EditTaskModal: React.FC<{
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projects: Project[];
    milestones: Milestone[];
    users: User[];
    editTask: {
        task_id: string;
        project_id: string;
        milestone_id: string;
        user_id: string;
        task_name: string;
        due_date: string;
        priority: string;
        status: string;
    };
    setEditTask: React.Dispatch<
        React.SetStateAction<{
            task_id: string;
            project_id: string;
            milestone_id: string;
            user_id: string;
            task_name: string;
            due_date: string;
            priority: string;
            status: string;
        }>
    >;
    handleUpdateTask: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
}> = ({
    isModalOpen,
    setModalOpen,
    projects,
    milestones,
    users,
    editTask,
    setEditTask,
    handleUpdateTask,
    isLoading,
}) => {
        const handleCancel = useCallback(() => {
            setModalOpen(false);
            setEditTask({
                task_id: "",
                project_id: "",
                milestone_id: "",
                user_id: "",
                task_name: "",
                due_date: "",
                priority: "",
                status: "",
            });
        }, [setModalOpen, setEditTask]);

        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-sm p-6 w-full max-w-md shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                    <form onSubmit={handleUpdateTask} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project
                            </label>
                            <select
                                required
                                value={editTask.project_id}
                                onChange={(e) =>
                                    setEditTask({
                                        ...editTask,
                                        project_id: e.target.value,
                                        milestone_id: "",
                                    })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Project</option>
                                {projects.map((p) => (
                                    <option key={p.project_id} value={p.project_id}>
                                        {p.project_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Milestone
                            </label>
                            <select
                                required
                                value={editTask.milestone_id}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, milestone_id: e.target.value })
                                }
                                disabled={!editTask.project_id}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Milestone</option>
                                {milestones.map((m) => (
                                    <option key={m.milestone_id} value={m.milestone_id}>
                                        {m.milestone_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign To
                            </label>
                            <select
                                required
                                value={editTask.user_id}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, user_id: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Team Member</option>
                                {users.map((u) => (
                                    <option key={u.user_id} value={u.user_id}>
                                        {u.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Name
                            </label>
                            <input
                                required
                                value={editTask.task_name}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, task_name: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                required
                                value={editTask.due_date}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, due_date: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                required
                                value={editTask.priority}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, priority: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                required
                                value={editTask.status}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, status: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Status</option>
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                            >
                                {isLoading && (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {isLoading ? "Updating..." : "Update Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };


interface TeamProps {
    user?: User | null;
}



/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
const TeamTasks: React.FC<TeamProps> = ({ user }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [filters, setFilters] = useState({
        project: "",
        status: "",
        member: "",
        dueDate: "",
    });
    const [isAssignOpen, setAssignOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isViewOpen, setViewOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedTaskIdForDelete, setSelectedTaskIdForDelete] = useState<number | null>(null);

    const [newTask, setNewTask] = useState({
        project_id: "",
        milestone_id: "",
        user_id: "",
        task_name: "",
        due_date: "",
        priority: "",
    });
    const [editTask, setEditTask] = useState({
        task_id: "",
        project_id: "",
        milestone_id: "",
        user_id: "",
        task_name: "",
        due_date: "",
        priority: "",
        status: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        setShowSkeleton(true);

        const timer = setTimeout(() => {
            if (mounted) setShowSkeleton(false);
        }, 1000);

        Promise.all([
            fetch(`${apiUrl}/api/users/projectsName`, { credentials: "include" })
                .then((r) => r.json())
                .then((data) => {
                    if (mounted) {
                        const arr = Array.isArray(data)
                            ? data
                            : data.projects || [];
                        setProjects(arr);
                    }
                })
                .catch(() => toast.error("Failed to load projects")),
            fetch(`${apiUrl}/api/users/userNames`, { credentials: "include" })
                .then((r) => r.json())
                .then((data) => {
                    if (mounted) {
                        const arr = Array.isArray(data) ? data : data.users || [];
                        setUsers(arr);
                    }
                })
                .catch(() => toast.error("Failed to load users")),
        ]).finally(() => {
            if (mounted) {
                setTimeout(() => {
                     setIsLoading(false);
                }, 1000);
               }
        });

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);

        const qp = new URLSearchParams({
            ...(filters.project && { project_id: filters.project }),
            ...(filters.status && { status: filters.status }),
            ...(filters.member && { assigned_to: filters.member }),
            ...(filters.dueDate && { due_date: filters.dueDate }),
        }).toString();

        fetch(`${apiUrl}/api/users/getAllTeamTasks?${qp}`, {
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                if (mounted) {
                    setTimeout(() => {
                        const arr = Array.isArray(data) ? data : data.tasks || [];
                        setTasks(arr);

                    }, 1000);
                }
            })
            .catch(() => toast.error("Failed to load tasks"))
            .finally(() => {
                if (mounted) {
                    setTimeout(() => {

                        setIsLoading(false);
                    }, 1000);
                }
            });

        return () => {
            mounted = false;
        };
    }, [filters]);

    const loadMilestones = useCallback(
        async (projectId: string) => {
            if (!projectId) {
                setMilestones([]);
                return;
            }
            try {
                const res = await fetch(
                    `${apiUrl}/api/users/milestones/${projectId}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                const arr =
                    Array.isArray(data) ? data : data.milestones || [];
                setMilestones(arr);
            } catch {
                toast.error("Failed to load milestones");
                setMilestones([]);
            }
        },
        []
    );

    useEffect(() => {
        loadMilestones(newTask.project_id);
    }, [newTask.project_id, loadMilestones]);

    useEffect(() => {
        loadMilestones(editTask.project_id);
    }, [editTask.project_id, loadMilestones]);

    const handleAssignTask = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
            try {
                const res = await fetch(`${apiUrl}/api/users/assignTask`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": await getCsrfToken(),
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        project_id: escapeHTML(newTask.project_id),
                        milestone_id: escapeHTML(newTask.milestone_id),
                        assigned_to: escapeHTML(newTask.user_id),
                        task_name: escapeHTML(newTask.task_name),
                        due_date: escapeHTML(newTask.due_date),
                        priority: escapeHTML(newTask.priority),
                    }),
                });

                if (!res.ok) throw new Error("Assign failed");
                toast.success("Task assigned");
                setAssignOpen(false);
                setNewTask({
                    project_id: "",
                    milestone_id: "",
                    user_id: "",
                    task_name: "",
                    due_date: "",
                    priority: "",
                });

                const qp = new URLSearchParams({
                    ...(filters.project && { project_id: filters.project }),
                    ...(filters.status && { status: filters.status }),
                    ...(filters.member && { assigned_to: filters.member }),
                    ...(filters.dueDate && { due_date: filters.dueDate }),
                }).toString();
                const fresh = await fetch(
                    `${apiUrl}/api/users/getAllTeamTasks?${qp}`,
                    { credentials: "include" }
                );
                const data = await fresh.json();
                setTimeout(() => {

                    setTasks(Array.isArray(data) ? data : data.tasks || []);
                }, 1000);
            } catch (err) {
                toast.error(err && typeof err === "object" && "error" in err
                    ? String((err as { error: unknown }).error)
                    : "Something went wrong!");
            } finally {
                setIsLoading(false);
            }
        },
        [newTask, filters]
    );

    

    const handleUpdateTask = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
            try {
                const res = await fetch(`${apiUrl}/api/users/updateTask`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": await getCsrfToken(),
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        task_id: escapeHTML(editTask.task_id),
                        project_id: escapeHTML(editTask.project_id),
                        milestone_id: escapeHTML(editTask.milestone_id),
                        assigned_to: escapeHTML(editTask.user_id),
                        task_name: escapeHTML(editTask.task_name),
                        due_date: escapeHTML(editTask.due_date),
                        priority: escapeHTML(editTask.priority),
                        status: escapeHTML(editTask.status),
                    }),
                });
                let msg;
                const data2 = await res.json();
                if (data2.success === false && data2.error) {

                    setIsLoading(false);

                    msg = data2.error;
                    setEditOpen(false);
                    toast.error(msg || "Failed to update task.");
                    return


                }
                if (!res.ok) {
                    setIsLoading(false);
                    setEditOpen(false);
                    toast.error("Failed to update task.");
                    return
                }

                toast.success("Task updated");
                setEditOpen(false);
                setEditTask({
                    task_id: "",
                    project_id: "",
                    milestone_id: "",
                    user_id: "",
                    task_name: "",
                    due_date: "",
                    priority: "",
                    status: "",
                });

                const qp = new URLSearchParams({
                    ...(filters.project && { project_id: filters.project }),
                    ...(filters.status && { status: filters.status }),
                    ...(filters.member && { assigned_to: filters.member }),
                    ...(filters.dueDate && { due_date: filters.dueDate }),
                }).toString();
                const fresh = await fetch(
                    `${apiUrl}/api/users/getAllTeamTasks?${qp}`,
                    { credentials: "include" }
                );
                const data = await fresh.json();
                setTasks(Array.isArray(data) ? data : data.tasks || []);
            } catch (err) {
                toast.error(err && typeof err === "object" && "error" in err
                    ? String((err as { error: unknown }).error)
                    : "Something went wrong!");
            } finally {
                setIsLoading(false);
            }
        },
        [editTask, filters]
    );

    const handleDeleteTask = useCallback(
        async () => {
            if (!selectedTaskIdForDelete) return;
            setIsLoading(true);
            try {
                const res = await fetch(`${apiUrl}/api/users/updateTask`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": await getCsrfToken(),
                    },
                    credentials: "include",
                    body: JSON.stringify({ task_id: escapeHTML(String(selectedTaskIdForDelete)) }),
                });

                let msg;
                const data2 = await res.json();

                if (data2.success === false && data2.error) {
                    setDeleteOpen(false);
                    setSelectedTaskIdForDelete(null);
                    msg = data2.error;
                    toast.error(msg || "Failed to delete task.");

                    return
                }

                if (!res.ok) {
                    setIsLoading(false);
                    setDeleteOpen(false);
                    setSelectedTaskIdForDelete(null);
                    toast.error("Failed to delete task.");
                    return
                }
                toast.success("Task deleted");
                setDeleteOpen(false);
                setSelectedTaskIdForDelete(null);

                const qp = new URLSearchParams({
                    ...(filters.project && { project_id: filters.project }),
                    ...(filters.status && { status: filters.status }),
                    ...(filters.member && { assigned_to: filters.member }),
                    ...(filters.dueDate && { due_date: filters.dueDate }),
                }).toString();
                const fresh = await fetch(
                    `${apiUrl}/api/users/getAllTeamTasks?${qp}`,
                    { credentials: "include" }
                );
                const data = await fresh.json();
                setTasks(Array.isArray(data) ? data : data.tasks || []);
            } catch (err) {
                toast.error(err && typeof err === "object" && "error" in err
                    ? String((err as { error: unknown }).error)
                    : "Something went wrong!");
            } finally {
                setIsLoading(false);
            }
        },
        [selectedTaskIdForDelete, filters]
    );

    const handleOpenDeleteModal = useCallback(
        (taskId: number) => {
            setSelectedTaskIdForDelete(taskId);
            setDeleteOpen(true);
        },
        []
    );

    const handleEdit = useCallback(
        (task: Task) => {
            const isoDate = task.due_date.split("T")[0];
            setEditTask({
                task_id: String(task.task_id),
                project_id: String(task.project_id),
                milestone_id: String(task.milestone_id),
                user_id: String(task.assigned_to),
                task_name: task.task_name,
                due_date: isoDate,
                priority: task.priority,
                status: task.status,
            });
            setEditOpen(true);
        },
        []
    );

    const handleView = useCallback(
        (task: Task) => {
            setSelectedTask(task);
            setViewOpen(true);
        },
        []
    );

    const getPriorityIcon = useCallback((priority: string) => {
        switch (priority.toLowerCase()) {
            case "urgent":
                return <AlertTriangle className="text-red-600" size={18} />;
            case "high":
                return <AlertCircle className="text-red-500" size={18} />;
            case "medium":
                return <CircleAlert className="text-yellow-500" size={18} />;
            case "low":
                return <CheckCircle className="text-green-500" size={18} />;
            default:
                return null;
        }
    }, []);

    const getStatusBgColor = useCallback((status: string) => {
        switch (status.toLowerCase()) {
            case "todo":
                return "bg-red-100 text-red-800";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }, []);

    const formatDate = useCallback((dateString: string) => {
        try {
            const d = new Date(dateString);
            return d.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    }, []);

    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar user={user} />
            <main className="flex-1 overflow-y-auto p-8 bg-gray-100 h-screen">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 mt-15 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Team Tasks</h1>
                            <p className="text-gray-500 mt-1">
                                Manage and track your team's tasks.
                            </p>
                        </div>
                        <button
                            id="assign-task-btn"
                            onClick={() => setAssignOpen(true)}
                            className="flex items-center justify-center cursor-pointer rounded-sm bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} />
                            Assign Task
                        </button>
                    </header>
                    <FilterControls
                        projects={projects}
                        users={users}
                        filters={filters}
                        setFilters={setFilters}
                    />
                    {isLoading || showSkeleton ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white shadow-sm rounded p-4 animate-pulse"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                                        <div className="h-6 w-32 bg-gray-200 rounded" />
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
                                                <th className="px-4 py-3 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                                                </td>
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
                            handleEdit={handleEdit}
                            handleView={handleView}
                            isloading={isLoading}
                            handleOpenDeleteModal={handleOpenDeleteModal}
                        />
                    )}
                    <AssignTaskModal
                        isModalOpen={isAssignOpen}
                        setModalOpen={setAssignOpen}
                        projects={projects}
                        milestones={milestones}
                        users={users}
                        newTask={newTask}
                        setNewTask={setNewTask}
                        handleAssignTask={handleAssignTask}
                        isLoading={isLoading}
                    />
                    <EditTaskModal
                        isModalOpen={isEditOpen}
                        setModalOpen={setEditOpen}
                        projects={projects}
                        milestones={milestones}
                        users={users}
                        editTask={editTask}
                        setEditTask={setEditTask}
                        handleUpdateTask={handleUpdateTask}
                        isLoading={isLoading}
                    />
                    <ViewTaskModal
                        isModalOpen={isViewOpen}
                        setModalOpen={setViewOpen}
                        task={selectedTask}
                        formatDate={formatDate}
                        getStatusBgColor={getStatusBgColor}
                        getPriorityIcon={getPriorityIcon}
                    />
                    <DeleteTaskModal
                        isModalOpen={isDeleteOpen}
                        setModalOpen={setDeleteOpen}
                        handleConfirmDelete={handleDeleteTask}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
};

export default TeamTasks;