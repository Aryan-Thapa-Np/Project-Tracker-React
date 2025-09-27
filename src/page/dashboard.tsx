
import React from 'react';
import Sidebar from "../sub-components/sidebar.tsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () =>{
    return (
        
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
            <Sidebar />
            
            {/* Content Area */}
            <div className="content-area flex-1 h-screen overflow-y-auto">
                <section className="py-10 px-4 sm:px-6 md:px-8 bg-gray-50 min-h-full">
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-gray-700">
                        Dashboard
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Welcome back, Alex! Here's an overview of your projects and team progress.
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
                                    {[
                                        { task: "Design landing page", project: "Website Redesign", status: "In Progress", statusColor: "bg-yellow-100 text-yellow-700", date: "July 15, 2024" },
                                        { task: "Implement user authentication", project: "Mobile App Development", status: "To Do", statusColor: "bg-gray-100 text-gray-700", date: "July 20, 2024" },
                                        { task: "Write documentation", project: "API Integration", status: "Completed", statusColor: "bg-green-100 text-green-700", date: "July 10, 2024" },
                                        { task: "Prepare presentation", project: "Marketing Campaign", status: "In Progress", statusColor: "bg-yellow-100 text-yellow-700", date: "July 25, 2024" },
                                        { task: "Review code", project: "Backend Optimization", status: "To Do", statusColor: "bg-gray-100 text-gray-700", date: "July 18, 2024" },
                                    ].map((item, i) => (
                                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                            <td className="px-4 sm:px-6 py-4 font-medium text-gray-700">{item.task}</td>
                                            <td className="px-4 sm:px-6 py-4">{item.project}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`px-3 py-1 text-nowrap rounded-full text-xs font-medium ${item.statusColor}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">{item.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grid Section */}
                    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Team Progress */}
                        <div className="p-4 sm:p-6 bg-white rounded-md shadow">
                            <h1 className="text-gray-800 font-bold text-xl sm:text-2xl mb-6">Team Progress</h1>
                            {[
                                { name: "Alex", percent: 65, color: "bg-blue-500", img: "https://i.pravatar.cc/40?img=1" },
                                { name: "Sophia", percent: 80, color: "bg-green-500", img: "https://i.pravatar.cc/40?img=2" },
                                { name: "Michael", percent: 45, color: "bg-yellow-500", img: "https://i.pravatar.cc/40?img=3" },
                            ].map((member, i) => (
                                <div key={i} className="mb-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={member.img} alt={member.name} className="w-8 h-8 rounded-full object-cover border" />
                                        <p className="text-sm font-medium text-gray-700">{member.name}</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div className={`${member.color} h-4 flex items-center justify-center text-white text-xs font-semibold`} style={{ width: `${member.percent}%` }}>
                                            {member.percent}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="p-4 sm:p-6 bg-white rounded-md shadow">
                            <h1 className="text-gray-800 font-bold text-xl sm:text-2xl mb-6">Upcoming Deadlines</h1>
                            <ul className="space-y-4 text-gray-700 text-sm">
                                {[
                                    { title: "Project Alpha", date: "Sep 30, 2025", percent: 80 },
                                    { title: "Design Review", date: "Oct 5, 2025", percent: 80 },
                                    { title: "Final Report", date: "Oct 15, 2025", percent: 80 },
                                ].map((deadline, i) => (
                                    <li key={i} className="p-3 ">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                                            <span className="flex items-center gap-2 text-base font-medium">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 bg-blue-100 p-2 rounded-md" />
                                                {deadline.title}
                                            </span>
                                            <span className="text-gray-500 font-semibold">{deadline.date}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div className="bg-green-500 h-3 flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${deadline.percent}%` }}>
                                                {deadline.percent}%
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
