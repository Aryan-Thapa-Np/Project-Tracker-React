import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../sub-components/sidebar.tsx";
import { getCsrfToken } from '../sub-components/csrfToken.tsx';
import { sanitizeInput } from "../sub-components/sanitize.tsx";
import { toast } from "react-toastify";
import type { User } from "../types/usersFTypes.tsx";
import {
    Plus,
    
} from "lucide-react";


interface UsersProps {
    user?: User | null;
}



const roles = ["admin", "project_manager", "team_member", "team_memberPlus", "team_memberSuper"];
const statuses = ["active", "locked", "banned", "inactive"];

const UserManagement: React.FC<UsersProps> = ({user}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "team_member" });
    const [editUser, setEditUser] = useState<Partial<User>>({});

    const pageSize = 5;
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Reset page when filters/search change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, roleFilter, statusFilter]);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (roleFilter) params.append("role", roleFilter);
            if (statusFilter) params.append("status", statusFilter);
            params.append("page", String(page));
            params.append("limit", String(pageSize));

            const res = await fetch(`${apiUrl}/api/users/getAllUsers?${params.toString()}`, {
                method: "GET",
                headers: { "x-csrf-token": await getCsrfToken() },
                credentials: 'include',
            });

            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setTotalPages(Math.max(Math.ceil(data.total / pageSize), 1));
            }
        } catch (err) {
            console.error(err);
        }
    }, [debouncedSearch, roleFilter, statusFilter, page, apiUrl]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Create User
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sanitizedUser = {
                username: sanitizeInput(newUser.username),
                email: sanitizeInput(newUser.email),
                password: sanitizeInput(newUser.password),
                role: newUser.role
            };

            const res = await fetch(`${apiUrl}/api/users/createUsers`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-csrf-token": await getCsrfToken() },
                body: JSON.stringify(sanitizedUser),
                credentials: "include",
            });

            const data = await res.json();

            let msg: string;

            if (data.success) {
                msg = data.message;
                toast.success(msg || "User created successfully!");
                setShowCreateModal(false);
                setNewUser({ username: "", email: "", password: "", role: "team_member" });
                setPage(1);
                fetchUsers();
            } else {
                msg = data.error;

                toast.error(msg || "Failed to create user");
            }
        } catch (err) {
            toast.error(err && typeof err === "object" && "error" in err
                ? String((err as { error: unknown }).error)
                : "Something went wrong!");
        }
    };

    // Update User
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sanitizedEdit = {
                ...editUser,
                role: editUser.role,
                status: editUser.status,
                status_expire: editUser.status_expire,
                email_verified: editUser.email_verified
            };

            const res = await fetch(`${apiUrl}/api/users/updateusersData`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-csrf-token": await getCsrfToken() },
                body: JSON.stringify(sanitizedEdit),
                credentials: "include",
            });

            const data = await res.json();
            let msg: string;
            if (data.success) {
                msg = data.message;
                toast.success(msg || "User updated successfully!");
                setShowEditModal(false);
                setEditUser({});
                fetchUsers();
            } else {
                msg = data.error;
                toast.error(msg || "Failed to update user");

            }
        } catch (err) {
            toast.error(err && typeof err === "object" && "error" in err
                ? String((err as { error: unknown }).error)
                : "Something went wrong!");
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar user={user}/>
            <main className="flex-1 overflow-y-auto  p-8  bg-gray-100 content-area h-screen">
                <div className="mx-auto max-w-7xl ">
                    {/* Header */}
                    <div className="mb-8 mt-15  flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage user accounts, roles, and project assignments.</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center justify-center cursor-pointer rounded-sm bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18}/>
                            Add New User
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <input
                            className="h-12 w-full rounded-lg border outline-0 border-gray-200 bg-white pl-4 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={(e) => setSearch(sanitizeInput(e.target.value))}
                        />
                        <select
                            className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 hover:bg-gray-50"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            {roles.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                        </select>
                        <select
                            className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 hover:bg-gray-50"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email Verified</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user.user_id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.role}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.status === "active" ? "bg-green-100 text-green-800" :
                                                user.status === "locked" ? "bg-yellow-100 text-yellow-800" :
                                                    user.status === "banned" ? "bg-red-100 text-red-800" :
                                                        "bg-gray-100 text-gray-800"
                                                }`}>{user.status}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.email_verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}>{user.email_verified ? "Yes" : "No"}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                className="cursor-pointer text-blue-600 hover:text-blue-800"
                                                onClick={() => { setEditUser(user); setShowEditModal(true); }}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                        {totalPages > 1 && (
                            <div className="flex gap-2">
                                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded border bg-white hover:bg-gray-50 cursor-pointer">Prev</button>
                                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded border bg-white hover:bg-gray-50 cursor-pointer">Next</button>
                            </div>
                        )}
                    </div>

                    {/* Create Modal */}
                    {showCreateModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="bg-white rounded-sm p-6 w-full max-w-md">
                                <h2 className="text-xl font-semibold mb-4">Create New User</h2>
                                <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                                    <input type="text" placeholder="Username" required className="border rounded px-3 py-2" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: sanitizeInput(e.target.value) })} />
                                    <input type="email" placeholder="Email" required className="border rounded px-3 py-2" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: sanitizeInput(e.target.value) })} />
                                    <input type="password" placeholder="Password" required className="border rounded px-3 py-2" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: sanitizeInput(e.target.value) })} />
                                    <select className="border rounded px-3 py-2" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                        {roles.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                                    </select>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button type="button" onClick={() => setShowCreateModal(false)} className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                                        <button type="submit" className="px-4 py-2 cursor-pointer rounded bg-blue-600 text-white hover:bg-blue-700">Create</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="bg-white rounded-sm p-6 w-full max-w-md">
                                <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                                <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
                                    <input type="text" placeholder="Username" disabled className="border rounded px-3 py-2" value={editUser.username} />
                                    <input type="email" placeholder="Email" disabled className="border rounded px-3 py-2" value={editUser.email} />
                                    <select className="border rounded px-3 py-2" value={editUser.role} onChange={e => setEditUser({ ...editUser, role: sanitizeInput(e.target.value) })}>
                                        {roles.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                                    </select>
                                    <select className="border rounded px-3 py-2" value={editUser.status} onChange={e => setEditUser({ ...editUser, status: sanitizeInput(e.target.value) })}>
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {(editUser.status === "locked" || editUser.status === "banned") && (
                                        <input type="datetime-local" placeholder="Status Expire" className="border rounded px-3 py-2" value={editUser.status_expire || ""} onChange={e => setEditUser({ ...editUser, status_expire: e.target.value })} />
                                    )}
                                    <select className="border rounded px-3 py-2" value={editUser.email_verified ? "true" : "false"} onChange={e => setEditUser({ ...editUser, email_verified: e.target.value === "true" })}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button type="button" onClick={() => setShowEditModal(false)} className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                                        <button type="submit" className="px-4 py-2 rounded bg-blue-600 cursor-pointer text-white hover:bg-blue-700">Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
