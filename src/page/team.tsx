import React from 'react';
import Sidebar from "../sub-components/sidebar.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import { CirclePlus } from "lucide-react";


const TeamTasks: React.FC = () => {
    return (

        <>
            <div className="flex w-full min-h-screen bg-gray-100">
                <Sidebar />


                <main className=" flex-1 overflow-y-auto p-8 bg-gray-100 content-area  h-screen ">
                    <div className="max-w-7xl mx-auto p-2 pt-15">
                        <header className="mb-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">Team Tasks</h1>
                                    <p className="text-gray-500 mt-1">
                                        Manage and track your team's tasks and progress.
                                    </p>
                                </div>
                                <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                                    <CirclePlus size={18}/>
                                    <span>Assign Task</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700" htmlFor="project-filter">
                                        Project
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-sm border-gray-300 p-2 outline-0 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                                        id="project-filter"
                                    >
                                        <option>All Projects</option>
                                        <option>Website Redesign</option>
                                        <option>Mobile App Development</option>
                                        <option>API Integration</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700" htmlFor="status-filter">
                                        Status
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-sm p-2 outline-0 border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                                        id="status-filter"
                                    >
                                        <option>All Statuses</option>
                                        <option>To Do</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700" htmlFor="member-filter">
                                        Team Member
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-sm p-2 outline-0 border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                                        id="member-filter"
                                    >
                                        <option>All Members</option>
                                        <option>Olivia Chen</option>
                                        <option>Benjamin Carter</option>
                                        <option>Sophia Rodriguez</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium  text-gray-700" htmlFor="due-date-filter">
                                        Due Date
                                    </label>
                                    <input
                                        className="mt-1 block p-2 outline-0 w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                                        id="due-date-filter"
                                        type="date"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Olivia Chen */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        alt="Olivia Chen"
                                        className="w-10 h-10 rounded-full"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-tVNLafuBLNYWFR8-BzVO_5X-w7TQsG9OqCIOrKnP-hNM2o2FAcbavVEZLYYWHfRKAN0apNKAz2MUElPAMb1af_KPA1cMOqe_mPQmokbIQW1yc1C1AvMI5WpQS-fcm-JNYYZJyGYCMtQbl-rURM8XhUe-5kRtPB5QhLIAuI5l3Q12yDBcDxPEf4ocwpnEUiobvX7lMQCZoCX55LzaCpjNYZbPOejOFoSbpn1fmZxd00CZIPvvHvYWCJN-5bdniehSvuKV6eOXP8Y"
                                    />
                                    <h2 className="text-2xl font-bold text-gray-900">Olivia Chen</h2>
                                </div>
                                <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3">Task Name</th>
                                                <th className="px-6 py-3">Project</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Priority</th>
                                                <th className="px-6 py-3">Due Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white border-b border-gray-200">
                                                <th className="px-6 py-4 font-medium text-gray-700" scope="row">
                                                    Finalize UI mockups
                                                </th>
                                                <td className="px-6 py-4">Website Redesign</td>
                                                <td className="px-6 py-4">
                                                    <span className="status-badge text-nowrap  bg-yellow-100 text-yellow-700">In Progress</span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm priority-high">
                                                        <FontAwesomeIcon icon={faArrowUp} />
                                                    </span>{" "}
                                                    High
                                                </td>
                                                <td className="px-6 py-4">July 28, 2024</td>
                                            </tr>
                                            <tr className="bg-white">
                                                <th className="px-6 py-4 font-medium text-gray-700" scope="row">
                                                    Create user flow diagrams
                                                </th>
                                                <td className="px-6 py-4">Mobile App Development</td>
                                                <td className="px-6 py-4">
                                                    <span className="status-badge  text-nowrap bg-gray-100 text-gray-700">To Do</span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm priority-medium">
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </span>{" "}
                                                    Medium
                                                </td>
                                                <td className="px-6 py-4">August 05, 2024</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Benjamin Carter */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        alt="Benjamin Carter"
                                        className="w-10 h-10 rounded-full"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaVsY-rcqxjT7EASjLcTI2WBTzVpm_cnvBq8HK5D2Qzg0qTYKy3b4DCalS2qfS00tHpH8YujZm7vdzXHdaGyuCfnQiXg1jFZ12FLXdLPpGv5lXB7TfNEvVAhZRSbNhpLFr_fxn3QMUk692CQGy6brTyTmVhIbbzrybHv_eOHNhzW7mbEYnTNY2IOpA6RfVcOi6pzSC3BdxnzfqQJDbrallIDSZFjRBSQfTYrO1Us5kNd2CgJhwwR3Ma2i-24GEy_P1cYZ59EQG_Cg"
                                    />
                                    <h2 className="text-2xl font-bold text-gray-900">Benjamin Carter</h2>
                                </div>
                                <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3">Task Name</th>
                                                <th className="px-6 py-3">Project</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Priority</th>
                                                <th className="px-6 py-3">Due Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white border-b border-gray-200">
                                                <th className="px-6 py-4 font-medium text-gray-700" scope="row">
                                                    Develop REST API endpoints
                                                </th>
                                                <td className="px-6 py-4">API Integration</td>
                                                <td className="px-6 py-4">
                                                    <span className="status-badge text-nowrap bg-green-100 text-green-700">Completed</span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm priority-high">
                                                        <FontAwesomeIcon icon={faArrowUp} />
                                                    </span>{" "}
                                                    High
                                                </td>
                                                <td className="px-6 py-4">July 22, 2024</td>
                                            </tr>
                                            <tr className="bg-white">
                                                <th className="px-6 py-4 font-medium text-gray-700" scope="row">
                                                    Optimize database queries
                                                </th>
                                                <td className="px-6 py-4">Backend Optimization</td>
                                                <td className="px-6 py-4">
                                                    <span className="status-badge text-nowrap  bg-yellow-100 text-yellow-700">In Progress</span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm priority-low">
                                                        <FontAwesomeIcon icon={faArrowDown} />
                                                    </span>{" "}
                                                    Low
                                                </td>
                                                <td className="px-6 py-4">August 10, 2024</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Sophia Rodriguez */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        alt="Sophia Rodriguez"
                                        className="w-10 h-10 rounded-full"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmdSDv7gj2R1wObWyaxqf05U3dFtAPXIs5hWy-UpyFem34HIOfw4dIgDcr__w0VH6hyZE3hae0XgwxtRTGg_0OPMzYea9G4rKLqDv_a2R18i4v7qAWAfXDKfZCXuL5Jpyx0OYEhF14deIBHJzgpbO4tBVd5ZCtigZ9ETP3YoaNoJjZ0s4ahycyarVhT1Z7qt9dg1uyuVZK1az3whrZm40Zcd_c5hbh-KglnsBfQ2o3sJ5VCzgiapbc5wd68IpEGtgDDITW_J1xNh8"
                                    />
                                    <h2 className="text-2xl font-bold text-gray-700">Sophia Rodriguez</h2>
                                </div>
                                <div className="bg-white rounded-sm  shadow-sm overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 ">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3">Task Name</th>
                                                <th className="px-6 py-3">Project</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Priority</th>
                                                <th className="px-6 py-3">Due Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white border-b border-gray-200">
                                                <th className="px-6 py-4  font-medium text-gray-700" scope="row">
                                                    Plan social media campaign
                                                </th>
                                                <td className="px-6 py-4">Marketing Campaign</td>
                                                <td className="px-6 py-4">
                                                    <span className="status-badge  bg-gray-100 text-nowrap text-gray-700">To Do</span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm priority-medium">
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </span>{" "}
                                                    Medium
                                                </td>
                                                <td className="px-6 py-4">August 01, 2024</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default TeamTasks;
