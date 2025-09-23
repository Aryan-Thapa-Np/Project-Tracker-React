import React from 'react';
import Sidebar from "../componets/sidebar.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileAlt, 
    faCommentDots, 
    faClock, 
    faUsers, 
    faCheck, 
    faSearch, 
    faXmark, 
    faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

const Notifications:React.FC = ()=>{
    const notifications = [
        { icon: faFileAlt, title: "New task assigned: 'Prepare presentation slides'", project: "Project Alpha", time: "2h ago" },
        { icon: faCommentDots, title: "Comment on 'Design review'", project: "Project Beta", time: "4h ago" },
        { icon: faClock, title: "Deadline approaching for 'Finalize report'", project: "Project Alpha", time: "1d ago" },
        { icon: faUsers, title: "New member joined the team", project: "Project Gamma", time: "1d ago" },
        { icon: faFileAlt, title: "Document updated: 'Project scope'", project: "Project Beta", time: "1d ago" }
    ];

    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Notifications
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            Stay up-to-date with the latest project activities and updates.
                        </p>
                    </div>

                    {/* Search and Button */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search notifications..."
                                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <FontAwesomeIcon icon={faCheckCircle} className="hidden sm:inline" />
                            <span>Mark all as read</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200 ">
                        <nav aria-label="Tabs" className="-mb-px flex space-x-6 min-w-max sm:min-w-0">
                            <a className="border-primary text-primary whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium" href="#">All</a>
                            <a className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium" href="#">Unread</a>
                        </nav>
                    </div>

                    {/* Notifications List */}
                    <div className="flow-root mt-4">
                        <ul className="-my-4 divide-y divide-slate-200" role="list">
                            {notifications.map((notif, index) => (
                                <li key={index} className="group relative py-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <FontAwesomeIcon icon={notif.icon} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-900">{notif.title}</p>
                                                <p className="text-sm text-slate-500">{notif.project}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3">
                                            <span className="text-sm text-slate-500 whitespace-nowrap">{notif.time}</span>
                                            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                                <button className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-500 cursor-pointer">
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Notifications;
