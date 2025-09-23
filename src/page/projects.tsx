import Sidebar from "../componets/sidebar.tsx";

const Projects = () => {

  
    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar />
            <main className=" p-6 content-area flex-1 h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 pt-20">
                        <h1 className="text-4xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-500 mt-1">
                            Manage your projects, track progress, and collaborate with your team.
                        </p>
                    </header>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="flex gap-2">
                            {/* Status Select */}
                            <div className="relative">
                                <select className="pl-8 pr-4 py-2 bg-white border outline-0 border-gray-300 rounded-lg text-gray-700 focus:ring-primary focus:border-primary">
                                    <option>Status: All</option>
                                    <option>On Track</option>
                                    <option>At Risk</option>
                                    <option>Off Track</option>
                                </select>
                                <svg
                                    className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            {/* Date Input */}
                            <div className="relative">
                                <input
                                    type="date"
                                    className="pl-8 pr-4 py-2 bg-white border outline-0 border-gray-300 rounded-lg text-gray-700 focus:ring-primary focus:border-primary"
                                />
                                <svg
                                    className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>

                           
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-blue-500  hover:bg-blue-700  rounded-lg  transition-colors cursor-pointer">
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    fillRule="evenodd"
                                />
                            </svg>
                            <span>New Project</span>
                        </button>
                    </div>

                    {/* Project Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Example Project Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Website Redesign
                                    </h3>
                                    <span className="status-badge status-on-track">On Track</span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Progress
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full"
                                            style={{ width: "75%" }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        75% complete
                                    </p>
                                </div>
                                {/* Key Milestones */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Key Milestones
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <svg
                                                className="h-4 w-4 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Design mockups</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg
                                                className="h-4 w-4 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Frontend development</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg
                                                className="h-4 w-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Backend integration</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <a className="text-primary hover:underline text-sm font-semibold" href="#">
                                View Details
                            </a>
                        </div>

                        {/* You can duplicate project cards here and change data */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Projects;
