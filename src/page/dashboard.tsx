
import React from 'react';
import Sidebar from "../sub-components/sidebar.tsx";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import type { User } from "../types/usersFTypes.tsx";
import { getCsrfToken } from '../sub-components/csrfToken.tsx';
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { toast } from "react-toastify";


interface DashboardProps {
    user?: User | null;
}

interface Task {
    assigned_to: number;         // user ID who the task is assigned to
    due_date: string;            // ISO date string (e.g., "2025-10-21T18:15:00.000Z")
    milestone_id: number;        // related milestone ID
    milestone_name: string;      // milestone name
    priority: string;            // e.g., "low" | "medium" | "high"
    project_id: number;          // related project ID
    project_name: string;        // project name
    status: string;              // e.g., "in_progress" | "completed" | "pending"
    task_id: number;             // unique task ID
    task_name: string;           // task title or description
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

    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Projects[]>([]);
    const [teamProgress, setProgress] = useState<TeamProgress[]>([]);




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
                }, 1000);

            } catch (error) {
                console.error("Fetch tasks error:", error);
            }
        };

        fetchTasks();
    }, []);


    //Projects Deadlines....

    useEffect(() => {
        const projectDeadlines = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/users/Getprojects`, {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        "x-csrf-token": await getCsrfToken(),
                    },
                });

                const data = await res.json();

                if (!res.ok || data.success === false) {
                    const msg = data.error || "Failed to fetch projects";
                    return toast.error(msg);
                }

                setTimeout(() => {
                    setProjects(data.projects);
                }, 1000);

            } catch (error) {
                console.error("Fetch tasks error:", error);
            }
        };

        projectDeadlines();
    }, []);




    //Team Progress....
    useEffect(() => {
        const teamProgress = async () => {
            try {
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
                }, 1000);

            } catch (error) {
                console.error("Fetch tasks error:", error);
            }
        };

        teamProgress();
    }, []);


    const truncate = (text: string, length: number) => {
        return text.length > length ? text.slice(0, length) + ".." : text;
    }

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
                <section className="py-10 px-4 sm:px-6 md:px-8 bg-gray-50 min-h-full">
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-gray-700">
                        Dashboard
                    </h2>
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
                                    {tasks.length === 0 ? (
                                        <tr className="animate-pulse">
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded "></div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded "></div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded "></div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded "></div>
                                            </td>
                                        </tr>

                                    ) : (

                                        tasks.map((item, i) => (
                                            <tr key={i} style={{ "--timer": `${i * 0.3}s` } as React.CSSProperties} className=" opp border-b border-gray-200 hover:bg-gray-50 transition">
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
                            <h1 className="text-gray-800 font-bold text-xl sm:text-2xl mb-6">Team Progress</h1>

                            {teamProgress.length === 0 ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="mb-4 animate-pulse">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                                            <span className="flex items-center gap-2 text-base font-medium">
                                                <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                            </span>
                                            <span className="h-4 bg-gray-200 rounded w-24"></span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                                        </div>
                                    </div>
                                ))

                            ) : (teamProgress.map((member, i) => (
                                <div key={i} className="mb-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={member.profile_pic} alt={member.username} className="w-8 h-8 rounded-full object-cover border" />
                                        <p className="text-sm font-medium text-gray-700">{member.username}</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div style={{ width: `${member.progress_percentage}%` }} className={`${parseInt(member.progress_percentage) > 40 ? `bg-green-500 ` : `bg-yellow-400`} h-4 flex items-center justify-center text-white text-xs font-semibold`} >
                                            {member.progress_percentage}%
                                        </div>
                                    </div>
                                </div>
                            )))
                            }
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="p-4 sm:p-6 bg-white rounded-md shadow">
                            <h1 className="text-gray-800 font-bold text-xl sm:text-2xl mb-6">Upcoming Deadlines</h1>
                            <ul className="space-y-4 text-gray-700 text-sm">

                                {projects.length === 0 ? (
                                    [...Array(3)].map((_, i) => (
                                        <div key={i} className="mb-4 animate-pulse">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                                                <span className="flex items-center gap-2 text-base font-medium">
                                                    <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                </span>
                                                <span className="h-4 bg-gray-200 rounded w-24"></span>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Actual projects
                                    projects.map((deadline, i) => (
                                        <li key={i} className="p-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                                                <span className="flex items-center gap-2 text-base font-medium">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 bg-blue-100 p-2 rounded-md" />
                                                    {deadline.project_name}
                                                </span>
                                                <span className="text-gray-500 font-semibold">{formatDate(deadline.due_date)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div className="bg-green-500 h-4 flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${deadline.progress_percentage}%` }}>
                                                    {deadline.progress_percentage}%
                                                </div>
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
}

export default Dashboard;


//   {[
//                                         { task: "Design landing page", project: "Website Redesign", status: "In Progress", statusColor: "bg-yellow-100 text-yellow-700", date: "July 15, 2024" },
//                                         { task: "Implement user authentication", project: "Mobile App Development", status: "To Do", statusColor: "bg-gray-100 text-gray-700", date: "July 20, 2024" },
//                                         { task: "Write documentation", project: "API Integration", status: "Completed", statusColor: "bg-green-100 text-green-700", date: "July 10, 2024" },
//                                         { task: "Prepare presentation", project: "Marketing Campaign", status: "In Progress", statusColor: "bg-yellow-100 text-yellow-700", date: "July 25, 2024" },
//                                         { task: "Review code", project: "Backend Optimization", status: "To Do", statusColor: "bg-gray-100 text-gray-700", date: "July 18, 2024" },
//                                     ].map((item, i) => (
//                                         <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition">
//                                             <td className="px-4 sm:px-6 py-4 font-medium text-gray-700">{item.task}</td>
//                                             <td className="px-4 sm:px-6 py-4">{item.project}</td>
//                                             <td className="px-4 sm:px-6 py-4">
//                                                 <span className={`px-3 py-1 text-nowrap rounded-full text-xs font-medium ${item.statusColor}`}>
//                                                     {item.status}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 sm:px-6 py-4">{item.date}</td>
//                                         </tr>
//                                     ))}