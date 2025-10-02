
import React from 'react';
import Sidebar from "../sub-components/sidebar.tsx";



const UserManagement:React.FC  = () => {
    return (
        <>
            <div className="flex w-full min-h-screen bg-gray-100">
                <Sidebar />

                <main className="flex-1 overflow-y-auto p-2 bg-gray-100 content-area  h-screen">
                    <div className="mx-auto max-w-7xl px-2 py-8 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8 pt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    User Management
                                </h1> 
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage user accounts, roles, and project assignments.
                                </p>
                            </div>
                            <button className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">
                                <svg
                                    className="mr-2"
                                    fill="currentColor"
                                    height="16"
                                    viewBox="0 0 256 256"
                                    width="16"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                                </svg>
                                Add New User
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1 ">
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                    fill="currentColor"
                                    height="24"
                                    viewBox="0 0 256 256"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                                </svg>
                                <input
                                    className="h-12 w-full rounded-lg border outline-0 border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    placeholder="Search users by name or email..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select className="flex h-12 outline-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <option value="">Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="project-manager">Project Manager</option>
                                    <option value="team-member">Team Member</option>
                                </select>

                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Assigned Projects
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {/* User Row Example */}
                                    <tr>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        alt=""
                                                        className="h-10 w-10 rounded-full"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJdVdiPR7USDkGfE014CAbF6TBlKwY-yYm1t_fmtjibHL-Pk-vm4UFnvHHGvj6Gre15uB72asgSF8SOnDLKw52XyYS07o1gAzR2dI87TP0sSH2n2j8zWYKRfhiRRRggp2ZMQ8nLeWJO_gRwzyUfnOegMJdxELi4JPgoNr5VHdjQXRMpok5PgcazZoos58nDOfKR8wiv6uguSsnt82-U7Hb_AjwU1-U5N2qzxSjMmipZK7A8IWBxA79NS5o1sWGykmkc43JBJEC4uo"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Sophia Carter</div>
                                                    <div className="text-sm text-gray-500">sophia.carter@example.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Administrator</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">All Projects</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <a className="text-primary hover:text-primary/80" href="#">
                                                Edit
                                            </a>
                                        </td>
                                    </tr>
                                    {/* Add other users similarly */}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">20</span> results
                            </p>
                            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-lg shadow-sm">
                                <a className="relative inline-flex items-center rounded-l-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50" href="#">
                                    <span className="sr-only">Previous</span>
                                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path clipRule="evenodd" d="M12.79 5.23a.75.75 0 010 1.06L9.06 10l3.73 3.71a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" fillRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a className="relative z-10 inline-flex items-center border border-primary bg-primary/20 px-4 py-2 text-sm font-medium text-primary" href="#">
                                    1
                                </a>
                                <a className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50" href="#">2</a>
                                <a className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 md:inline-flex" href="#">3</a>
                                <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">...</span>
                                <a className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 md:inline-flex" href="#">10</a>
                                <a className="relative inline-flex items-center rounded-r-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50" href="#">
                                    <span className="sr-only">Next</span>
                                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path clipRule="evenodd" d="M7.21 14.77a.75.75 0 010-1.06L10.94 10 7.21 6.29a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z" fillRule="evenodd"></path>
                                    </svg>
                                </a>
                            </nav>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default UserManagement;
