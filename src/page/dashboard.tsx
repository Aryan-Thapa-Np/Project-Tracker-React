
import Sidebar from "../componets/sidebar.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';



function Dashboard() {
    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar />
            {/* content area fixed */}
            <div className="content-area flex-1 h-screen overflow-y-auto">
                <section className="py-20 px-6 bg-gray-50 min-h-full">
                    <h2 className="text-3xl font-extrabold mb-4 text-gray-700">
                        Dashboard
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Welcome back, Alex! Here's an overview of your projects and team progress.
                    </p>

                    {/* Tasks Table */}
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Tasks</h2>
                        <div className="bg-white rounded-md shadow-md overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">Task</th>
                                        <th className="px-6 py-3">Project</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Design landing page
                                        </td>
                                        <td className="px-6 py-4">Website Redesign</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                In Progress
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 15, 2024</td>
                                    </tr>

                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Implement user authentication
                                        </td>
                                        <td className="px-6 py-4">Mobile App Development</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                To Do
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 20, 2024</td>
                                    </tr>

                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Write documentation
                                        </td>
                                        <td className="px-6 py-4">API Integration</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 10, 2024</td>
                                    </tr>

                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Prepare presentation
                                        </td>
                                        <td className="px-6 py-4">Marketing Campaign</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                In Progress
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 25, 2024</td>
                                    </tr>

                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            Review code
                                        </td>
                                        <td className="px-6 py-4">Backend Optimization</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                To Do
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">July 18, 2024</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Team Progress */}
                        <div className="p-6 bg-white rounded-md shadow">
                            <h1 className="text-gray-800 font-bold text-2xl mb-6">Team Progress</h1>

                            {[
                                {
                                    name: "Alex",
                                    percent: 65,
                                    color: "bg-blue-500",
                                    img: "https://i.pravatar.cc/40?img=1",
                                },
                                {
                                    name: "Sophia",
                                    percent: 80,
                                    color: "bg-green-500",
                                    img: "https://i.pravatar.cc/40?img=2",
                                },
                                {
                                    name: "Michael",
                                    percent: 45,
                                    color: "bg-yellow-500",
                                    img: "https://i.pravatar.cc/40?img=3",
                                },
                            ].map((member, i) => (
                                <div key={i} className="mb-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className="w-8 h-8 rounded-full object-cover border"
                                        />
                                        <p className="text-sm font-medium text-gray-700">{member.name}</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className={`${member.color} h-4 flex items-center justify-center text-white text-xs font-semibold`}
                                            style={{ width: `${member.percent}%` }}
                                        >
                                            {member.percent}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Column - Upcoming Deadlines */}
                        <div className="p-6 bg-white rounded-md shadow">
                            <h1 className="text-gray-800 font-bold text-2xl mb-6">Upcoming Deadlines</h1>
                            <ul className="space-y-4 text-gray-700 text-sm">
                                <div className="p-3">
                                    <li className="flex items-center justify-between  pb-2">
                                        <span className="flex items-center gap-2 text-[16px] font-medium ">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 bg-blue-100 p-2 rounded-md" />
                                            Project Alpha
                                        </span>
                                        <span className="text-gray-500 font-semibold">Sep 30, 2025</span>
                                    </li>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`bg-green-500 h-3 flex items-center justify-center text-white text-xs font-semibold`}
                                            style={{ width: `${80}%` }}
                                        >
                                            {80}%
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3">
                                    <li className="flex items-center justify-between pb-2">
                                        <span className="flex items-center gap-2 text-[16px] font-medium">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 bg-blue-100 p-2 rounded-md" />
                                            Design Review
                                        </span>
                                        <span className="text-gray-500 font-semibold">Oct 5, 2025</span>
                                    </li>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`bg-green-500 h-3 flex items-center justify-center text-white text-xs font-semibold`}
                                            style={{ width: `${80}%` }}
                                        >
                                            {80}%
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <li className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-[16px] font-medium">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 bg-blue-100 p-2 rounded-md" />
                                            Final Report
                                        </span>
                                        <span className="text-gray-500 font-semibold">Oct 15, 2025</span>
                                    </li>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                                        <div
                                            className={`bg-green-500 h-3 flex items-center justify-center text-white text-xs font-semibold`}
                                            style={{ width: `${80}%` }}
                                        >
                                            {80}%
                                        </div>
                                    </div>
                                </div>



                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
