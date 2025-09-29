import React from 'react';
import Sidebar from "../sub-components/sidebar.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';



const Task:React.FC  = ()=> {
    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar />
            {/* content area fixed */}
            <div className="content-area flex-1 h-screen overflow-y-auto ">
                <section className="py-20 px-6 bg-gray-50 min-h-full">


                    {/* Tasks Table */}
                    <div className="p-2 pt-5">
                        <div className="p-1 flex justify-between">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">My Tasks</h2>
                            {/* <button className="text-md border-0 font-bold text-gray-100 mb-4 bg-[#2486e7]  py-1 px-6 rounded-lg cursor-pointer hover:bg-[#1173d4] transition-colors">New Task</button> */}

                        </div>
                        <div className="bg-white rounded-md shadow-md overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">Task</th>
                                        <th className="px-6 py-3">Project</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Due Date</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Design landing page
                                        </td>
                                        <td className="px-6 py-4">Website Redesign</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-nowrap rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                In Progress
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 15, 2024</td>
                                        <td className="px-6 py-4"><FontAwesomeIcon icon={faPenToSquare} /></td>

                                    </tr>

                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Implement user authentication
                                        </td>
                                        <td className="px-6 py-4">Mobile App Development</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-nowrap rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                To Do
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 20, 2024</td>
                                        <td className="px-6 py-4"><FontAwesomeIcon icon={faPenToSquare} /></td>

                                    </tr>

                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Write documentation
                                        </td>
                                        <td className="px-6 py-4">API Integration</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-nowrap  rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 10, 2024</td>
                                        <td className="px-6 py-4"><FontAwesomeIcon icon={faPenToSquare} /></td>
                                    </tr>

                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Prepare presentation
                                        </td>
                                        <td className="px-6 py-4">Marketing Campaign</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-nowrap rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                In Progress
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 25, 2024</td>
                                        <td className="px-6 py-4"><FontAwesomeIcon icon={faPenToSquare} /></td>


                                    </tr>

                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Review code
                                        </td>
                                        <td className="px-6 py-4">Backend Optimization</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-nowrap rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                To Do
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 18, 2024</td>
                                        <td className="px-6 py-4"><FontAwesomeIcon icon={faPenToSquare} /></td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Task;
