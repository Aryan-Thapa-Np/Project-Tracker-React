import React from 'react';
import Sidebar from "../sub-components/sidebar.tsx";
import { useState, useEffect } from 'react';
import type { User } from "../types/usersFTypes.tsx";
import { getCsrfToken } from '../sub-components/csrfToken.tsx';
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { toast } from "react-toastify";
import { CalendarClock, MessageCircleWarning } from "lucide-react";

interface DashboardProps {
    user?: User | null;
}

interface Task {
    assigned_to: number;
    due_date: string;
    milestone_id: number;
    milestone_name: string;
    priority: string;
    project_id: number;
    project_name: string;
    status: string;
    task_id: number;
    task_name: string;
}

interface Projects {
    due_date: string;
    progress_percentage: string;
    project_name: string;
}

interface TeamProgress {
    progress_percentage: string;
    profile_pic: string;
    username: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [projects, setProjects] = useState<Projects[] | null>([]);
    const [teamProgress, setProgress] = useState<TeamProgress[] | null>(null);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoadingTeamProgress, setIsLoadingTeamProgress] = useState(true);

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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoadingTasks(true);
                const res = await fetch(`${apiUrl}/api/users/getMytask?page=1&limit=10`, {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        "x-csrf-token": await getCsrfToken(),
                    },
                });

                const data = await res.json();

                if (!res.ok || data.success === false) {
                    const msg = data.error || "Failed to fetch tasks";
                    return toast.error(msg);
                }

                setTimeout(() => {
                    setTasks(data.tasks);
                    setIsLoadingTasks(false);
                }, 1000);
            } catch (error) {
                console.error("Fetch tasks error:", error);
                setIsLoadingTasks(false);
            }
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        const projectDeadlines = async () => {
            try {
                setIsLoadingProjects(true);
                const res = await fetch(`${apiUrl}/api/users/Getprojects`, {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        "x-csrf-token": await getCsrfToken(),
                    },
                });

                const data = await res.json();

                if (!res.ok || data.success === false) {
                    setIsLoadingProjects(false);

                    return null;
                }

                setTimeout(() => {
                    setProjects(data.projects);
                    setIsLoadingProjects(false);
                }, 1000);
            } catch (error) {
                console.error("Fetch projects error:", error);
                setIsLoadingProjects(false);
            }
        };

        projectDeadlines();
    }, []);

    useEffect(() => {
        const teamProgress = async () => {
            try {
                setIsLoadingTeamProgress(true);
                const res = await fetch(`${apiUrl}/api/users/getTeamProgress`, {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        "x-csrf-token": await getCsrfToken(),
                    },
                });

                const data = await res.json();

                if (!res.ok || data.success === false) {
                    const msg = data.error || "Failed to fetch team progress.";
                    return toast.error(msg);
                }

                setTimeout(() => {
                    setProgress(data.progress);
                    setIsLoadingTeamProgress(false);
                }, 1000);
            } catch (error) {
                console.error("Fetch team progress error:", error);
                setIsLoadingTeamProgress(false);
            }
        };

        teamProgress();
    }, []);

    const truncate = (text: string, length: number) => {
        return text.length > length ? text.slice(0, length) + ".." : text;
    };

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
            <Sidebar user={user} />

            {/* Content Area */}
            <div className="content-area flex-1 h-screen overflow-y-auto">
                <section className="mt-15 mb-8 p-8 bg-gray-50 min-h-full">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-700">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Welcome back, {user?.username}! Here's an overview of your projects and team progress.
                    </p>

                    {/* Tasks Table */}
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">My Tasks</h2>
                        <div className="bg-white rounded-md shadow-md overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-600">
                                <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3">Task</th>
                                        <th className="px-4 sm:px-6 py-3">Project</th>
                                        <th className="px-4 sm:px-6 py-3">Status</th>
                                        <th className="px-4 sm:px-6 py-3">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingTasks ? (
                                        [...Array(3)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : tasks && tasks.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 sm:px-6 py-4">
                                                <div className="flex justify-center items-center gap-2 text-gray-500">
                                                    <MessageCircleWarning size={28} />
                                                    <span>Not Available</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        tasks?.map((item, i) => (
                                            <tr
                                                key={i}
                                                style={{ "--timer": `${i * 0.3}s` } as React.CSSProperties}
                                                className="opp border-b border-gray-200 hover:bg-gray-50 transition"
                                            >
                                                <td className="px-4 sm:px-6 py-4 font-medium text-gray-700" title={item.task_name}>
                                                    {truncate(item.task_name, 100)}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">{item.project_name}</td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`px-3 py-1 text-nowrap rounded-full text-xs font-medium ${statusClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">{formatDate(item.due_date)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grid Section */}
                    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Team Progress */}
                        <div className="p-4 sm:p-6 bg-white rounded-md shadow">
                            <h1 className="text-gray-800 font-bold text-xl sm:text-2xl mb-6 ">Team Progress</h1>
                            {isLoadingTeamProgress ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="mb-4 animate-pulse">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                                            <span className="flex items-center gap-2 text-base font-medium">
                                                <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                            </span>
                                            <span className="h-4 bg-gray-200 rounded w-24"></span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                                        </div>
                                    </div>
                                ))
                            ) : teamProgress && teamProgress.length === 0 ? (
                                <div className="flex justify-center items-center gap-2 text-gray-500 h-40">
                                    <MessageCircleWarning size={28} />
                                    <span>Not Available</span>
                                </div>
                            ) : (
                                teamProgress?.map((member, i) => (
                                    <div key={i} className="mb-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src={member.profile_pic?member.profile_pic:"/image.png"}
                                                alt={member.username}
                                                className="w-8 h-8 rounded-full object-cover border"
                                            />
                                            <p className="text-sm font-medium text-gray-700">{member.username}</p>
                                        </div>
                                        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div
                                                style={{ width: `${member.progress_percentage}%` }}
                                                className={`${parseInt(member.progress_percentage) > 40 ? `bg-green-500` : `bg-yellow-400`
                                                    } relative h-4 flex items-center justify-center text-white text-xs font-semibold text-center`}
                                            >
                                            </div>
                                            <span className={`${parseInt(member.progress_percentage) > 0? `text-white font-semibold  drop-shadow-black drop-shadow-sm ` :"text-black font-semibold" } text-xs absolute top-[3px] left-1/2 transform -translate-x-1/2 -translate-y-1`}>
                                              {Math.floor(Number(member.progress_percentage))}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="p-4 sm:p-6 bg-white rounded-md shadow">
                            <h1 className="text-gray-800 font-bold text-xl sm:text-2xl mb-6 ">Upcoming Deadlines</h1>
                            <ul className="space-y-4 text-gray-700 text-sm">
                                {isLoadingProjects ? (
                                    [...Array(3)].map((_, i) => (
                                        <div key={i} className="mb-4 animate-pulse">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                                                <span className="flex items-center gap-2 text-base font-medium">
                                                    <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                </span>
                                                <span className="h-4 bg-gray-200 rounded w-24"></span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : projects && projects.length === 0 ? (
                                    <li className="flex justify-center items-center gap-2 text-gray-500 h-40">
                                        <MessageCircleWarning size={28} />
                                        <span>Not Available</span>
                                    </li>
                                ) : (
                                    projects?.map((deadline, i) => (
                                        <li key={i} className="p-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                                                <span className="flex items-center gap-2 text-base font-medium">
                                                    <CalendarClock size={38} className="text-blue-500 bg-blue-100 p-2 rounded-md" />
                                                    {deadline.project_name}
                                                </span>
                                                <span className="text-gray-500 font-semibold">{formatDate(deadline.due_date)}</span>
                                            </div>
                                            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className={`${parseInt(deadline.progress_percentage) > 40 ? `bg-green-500` : `bg-yellow-400`} h-4 flex items-center justify-center text-white text-xs font-semibold`}
                                                    style={{ width: `${deadline.progress_percentage}%` }}
                                                >
                                                </div>
                                                <span className={`${parseInt(deadline.progress_percentage) > 0? `text-white font-semibold drop-shadow-black drop-shadow-sm ` :"text-black font-semibold" }  text-xs absolute  top-[3px] left-1/2 transform -translate-x-1/2 -translate-y-1`}>
                                              {Math.floor(Number(deadline.progress_percentage))}%
                                            </span>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;