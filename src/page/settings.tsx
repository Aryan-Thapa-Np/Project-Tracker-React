import React, { useState } from "react";
import type { User } from "../types/usersFTypes.tsx";
import Sidebar from "../sub-components/sidebar.tsx";
import { User as UserIcon, Mail, ShieldCheck, ShieldX, Pencil, Camera } from "lucide-react";


import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from '../sub-components/csrfToken.tsx';
// import { escapeHTML, escapeForSQL } from "../sub-components/sanitize.tsx";

interface SettingsProps {
    user?: User | null;
}

interface FormData {
    username: string;
    email: string;
    profile_pic?: string;
}

const SettingsPage: React.FC<SettingsProps> = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        username: user?.username || "",
        email: user?.email || "",
        profile_pic: user?.profile_pic || ""
    });
    const [previewPic, setPreviewPic] = useState<string>(user?.profile_pic || "");
    const [loading, setLoading] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        const updates: Partial<FormData> = {};
        (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
            if (formData[key] !== (user as User)?.[key]) {
                updates[key] = formData[key];
            }
        });

        if (previewPic && previewPic !== user?.profile_pic) {
            updates.profile_pic = previewPic;
        }

        if (Object.keys(updates).length === 0) {
            toast.error("No changes to update.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${apiUrl}/api/users/updateUsers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": await getCsrfToken(),
                },
                credentials: "include",
                body: JSON.stringify(updates),
            });

            const data = await res.json();
            console.log(data);
            let msg: string;

            if (res.ok) {
                msg = data.message;
                toast.success(msg || "Profile updated successfully!");
            } else {
                msg = data.error;
                toast.error(msg || "Update failed!");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen  bg-gray-100">
            <Sidebar user={user} />

            {/* Main content */}
            <main className="content-area flex-1 h-screen overflow-y-auto">
                <div className="pt-20 px-10">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800"> User Settings</h1>

                    {/* Profile Card */}
                    <div className="bg-white rounded-sm shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={user?.profile_pic || "/default-avatar.png"}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <UserIcon size={18} /> {user?.username}
                                </h2>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Mail size={16} />
                                    {user?.email}
                                    {user?.email_verified ? (
                                        <ShieldCheck size={18} className="text-green-600" />
                                    ) : (
                                        <ShieldX size={18} className="text-red-500" />
                                    )}
                                </p>
                                <p className="text-gray-600 capitalize">Role: {user?.role}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 flex  items-center gap-2 cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 transition"
                        >
                            <Pencil size={18} />Update Profile
                        </button>


                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-sm shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Profile</h2>

                        <div className="flex flex-col items-center mb-4">
                            <div className="relative">
                                <img
                                    src={previewPic || "/default-avatar.png"}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                                />
                                <label
                                    htmlFor="profilePic"
                                    className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                                >
                                    <Camera size={18} className="text-white" />
                                </label>
                                <input
                                    id="profilePic"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-gray-500 text-sm mt-2">Click camera icon to change</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                            </div>


                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-sm cursor-pointer hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-sm hover:bg-blue-700 shadow transition disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
