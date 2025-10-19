import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sub-components/sidebar.tsx";
import {
    Check,
    Search,
    X,
    BadgeCheck,
    FileCheck,
    Users,
    User as userSingle,
    Clock,
    MessageCircleMore,
    BellOff,
    ChevronLeft,
    ClipboardCheck,
    ChevronRight,
    FolderKanban,
    Megaphone,
    type LucideIcon,
} from "lucide-react";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from '../sub-components/csrfToken.tsx';
import { useNotification } from "../context/notificationContext.tsx";

import type { User } from "../types/usersFTypes.tsx";



interface NotificationItem {
    notification_id: string | number;
    title: string;
    project: string;
    time: string;
    type: keyof typeof iconMap | string;
    is_read?: boolean;
    isFading?: boolean;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

const iconMap: Record<string, LucideIcon> = {
    file: FileCheck,
    comment: MessageCircleMore,
    clock: Clock,
    users: Users,
    User: userSingle,
    ClipboardCheck: ClipboardCheck,
    FolderKanban: FolderKanban,
    Megaphone: Megaphone,
};


interface NotificationProps {
    user?: User | null;
}

const Notifications: React.FC<NotificationProps> = ({ user }) => {
    const { notificationCount, setNotificationCount } = useNotification();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const filterType = query.get("type") || "all";
    const initialPage = parseInt(query.get("page") || "1");

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: initialPage,
        totalPages: 1,
        totalItems: 0,
        limit: 10
    });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [processing, setProcessing] = useState<boolean>(false);


    // Update URL when page or type changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (filterType !== "all") params.set("type", filterType);
        if (pagination.currentPage !== 1) params.set("page", pagination.currentPage.toString());
        if (searchQuery) params.set("search", searchQuery);
        window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
    }, [filterType, pagination.currentPage, searchQuery]);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    type: filterType,
                    page: pagination.currentPage.toString(),
                    ...(searchQuery && { search: searchQuery })
                });
                const res = await fetch(`${apiUrl}/api/users/getnotifications?${params.toString()}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setNotifications(data.notifications || []);
                setPagination(data.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    limit: 10
                });
            } catch (err) {
                console.error("Failed to load notifications:", err);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        fetchNotifications();

      
    }, [filterType, pagination.currentPage, searchQuery,notificationCount]);










    const handleMarkAsRead = async (id: string | number) => {
        try {
            setProcessing(true);
            await fetch(`${apiUrl}/api/users/markasread/${Number(id)}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": await getCsrfToken(),
                },
                credentials: 'include',
            });
            setNotifications((prev) =>
                prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
            );
            setNotificationCount(notificationCount ? (notificationCount - 1) : notificationCount);

        } catch (err) {
            console.error("Failed to mark as read:", err);
        } finally {
            setProcessing(false);
        }
    };
    const handleDelete = async (id: string | number) => {
        try {
            setProcessing(true);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === id ? { ...n, isFading: true } : n
                )
            );

            await new Promise((resolve) => setTimeout(resolve, 300));

            await fetch(`${apiUrl}/api/users/deletenotification/${Number(id)}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": await getCsrfToken(),
                },
                credentials: 'include',
            });

            setNotifications((prev) => prev.filter((n) => n.notification_id !== id));

            // Update pagination if needed
            if (notifications.length === 1 && pagination.currentPage > 1) {
                setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
            }
        } catch (err) {
            console.error("Failed to delete:", err);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === id ? { ...n, isFading: false } : n
                )
            );
        } finally {
            setProcessing(false);
        }
    };
    const handleMarkAll = async () => {
        try {
            setProcessing(true);
            await fetch(`${apiUrl}/api/users/markallasread`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": await getCsrfToken(),
                },
                credentials: 'include',
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setNotificationCount(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        } finally {
            setProcessing(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    const Skeleton = () => (
        <ul className="-my-4 divide-y divide-slate-200 animate-pulse">
            {Array.from({ length: 5 }).map((_, idx) => (
                <li key={idx} className="flex items-center justify-between gap-3 py-4">
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1">
                            <div className="h-3 w-1/2 bg-slate-200 rounded mb-2"></div>
                            <div className="h-3 w-1/3 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar user={user} />
            <main className="content-area flex-1 overflow-y-auto h-screen">
                <div className="mx-auto mt-15 w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            Stay up-to-date with the latest project activities and updates.
                        </p>
                    </div>

                    {/* Search + Mark All */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="search"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <button
                            onClick={handleMarkAll}
                            disabled={processing}
                            className="flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            <BadgeCheck size={18} className="hidden sm:inline" />
                            <span>Mark all as read</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200">
                        <nav aria-label="Tabs" className="-mb-px flex space-x-6">
                            {["all", "unread"].map((type) => (
                                <Link
                                    key={type}
                                    to={`?type=${type}`}
                                    className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium ${filterType === type
                                        ? "border-primary text-primary"
                                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                        }`}
                                >
                                    {type === "all" ? "All" : "Unread"}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Notification List */}
                    <div className="flow-root mt-4">
                        {loading ? (
                            <Skeleton />
                        ) : notifications.length > 0 ? (
                            <ul className="-my-4 divide-y divide-slate-200" role="list">
                                {notifications.map((notif, i) => {
                                    const Icon =
                                        iconMap[notif.type as keyof typeof iconMap] || FileCheck;
                                    return (
                                        <li
                                            key={i}
                                            className={`group relative py-4 mt-1 transition-all opp
                                                ${notif.is_read}
                                                ${notif.is_read
                                                    ? "opacity-70"
                                                    : "bg-white shadow-sm rounded px-2"
                                                } notification ${notif.isFading ? 'fade-out' : ''}`}
                                            style={{ "--timer": "0.3s" } as React.CSSProperties}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Icon size={18} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-slate-600">
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {notif.project === "none" ? "" : notif.project}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                                    <span className="text-sm text-slate-500 whitespace-nowrap">
                                                        {notif.time}
                                                    </span>
                                                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleMarkAsRead(notif.notification_id)}
                                                            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(notif.notification_id)}
                                                            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-500 cursor-pointer"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                                <BellOff size={48} className="mb-3 text-slate-400" />
                                <p className="text-lg font-medium">No notifications available</p>
                                <p className="text-sm text-slate-400">
                                    You’re all caught up! Check back later for updates.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                <ChevronLeft size={18} />
                                Previous
                            </button>
                            <div className="text-sm text-slate-500">
                                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} items)
                            </div>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Notifications;