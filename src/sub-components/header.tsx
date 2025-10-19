import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { User } from "../types/usersFTypes.tsx";
import { Link } from 'react-router-dom';
import {
    Menu,
    Search,
    X,
    Users,
    Bell,
    ClipboardCheck,
    FolderClock,
    House,
    Settings,
} from "lucide-react";
import { sanitizeInput } from "../sub-components/sanitize.tsx";

import { useNotification } from "../context/notificationContext.tsx";

interface HeaderProps {
    user?: User | null;
}

import { getSocket } from "../lib/sockets.ts";

const info = [
    { symbol: House, title: "Dashboard", link: "/" },
    { symbol: ClipboardCheck, title: "My Tasks", link: "/tasks" },
    { symbol: FolderClock, title: "Projects", link: "/projects" },
    { symbol: Users, title: "Teams", link: "/teams" },
    { symbol: Bell, title: "Notifications", link: "/notifications" },
    { symbol: Settings, title: "Settings", link: "/settings" },
];


const Header: React.FC<HeaderProps> = ({ user }) => {
    const { notificationCount, setNotificationCount } = useNotification();

    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [hamburgerChange, setHamburgerChange] = useState<boolean>(false);

    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);


    useEffect(() => {
        setNotificationCount(user?.notification_count);


    }, [setNotificationCount, user?.notification_count]);


    const updateBadge = useCallback((data: number) => {
        setNotificationCount(data !== undefined ? data : user?.notification_count);
    }, [user?.notification_count, setNotificationCount]);


    useEffect(() => {
        console.log("socket.io initilaize....");
        const socket = getSocket();


        socket.emit("register_user", user?.user_id);

        socket.on("notification", (count) => {
            updateBadge(Number(count.noticount));

        });

        return () => {
            socket.off("notification");
        };
    }, []);




    const toggleSidebar = () => {
        setHamburgerChange(prev => !prev);
        const event = new CustomEvent('toggleSidebar', { bubbles: true });
        window.dispatchEvent(event);
    };

    const changeToggle = () => setHamburgerChange(false);

    useEffect(() => {
        window.addEventListener('toggleIcon', changeToggle);
        return () => window.removeEventListener('toggleIcon', changeToggle);
    }, []);


    const SideIcon = hamburgerChange ? X : Menu;

    // Filter info based on search input
    const filteredInfo = info.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <header className="z-10 flex justify-between items-center px-4 py-2 shadow-sm fixed w-full h-[70px] bg-white">
            <div className="nav-left flex gap-1 items-center">
                <div onClick={toggleSidebar} className="hamburger cursor-pointer p-2 hover:bg-gray-200 rounded-xl transition-colors">
                    <SideIcon size={22} />
                </div>
                <h1 className="text-xl font-bold font-mono">Project Tracker</h1>
            </div>

            <div className="nav-right flex items-center gap-4">
                <div className="searchBox relative">
                    <input
                        ref={searchInputRef}
                        type="search"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-[6px] border border-gray-300 outline-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}

                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    {!isFocused && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm bg-gray-200 pr-2 pl-2 rounded-2xl">
                            Ctrl+K
                        </span>
                    )}

                    {/* Dropdown */}
                    {isFocused && filteredInfo.length > 0 && (
                        <div
                            className="absolute p-2 text-gray-600 rounded-md top-10 left-0 bg-gray-50 shadow-md w-full max-h-60 overflow-auto z-50"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <ul>
                                {filteredInfo.map((item, i) => {
                                    const Icon = item.symbol;
                                    return (
                                        <li key={i} onClick={() => searchInputRef.current?.blur()} className='py-1 px-2 hover:bg-gray-300 rounded cursor-pointer'>
                                            <Link
                                                to={item.link}
                                                className="flex items-center gap-2 w-full"
                                                onClick={() => setIsFocused(false)}
                                            >
                                                <Icon size={18} /> {item.title}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>


                <div className="headerIcons relative p-[5px]">
                    <Link to="/notifications">
                        <Bell size={18} className="text-[17px] text-gray-600 cursor-pointer" />
                        <span id='countvalueall' className="absolute top-[-5px] right-[-5px] bg-red-500 pr-[6px] pl-[6px] rounded-full text-white text-[12px]">
                            {notificationCount === 0 ? "" : notificationCount}

                        </span>
                    </Link>
                </div>

                <div className="profile relative">
                    <img
                        src={user?.profile_pic || "/image.png"}
                        alt="profile"
                        id="profilePicture"
                        className="h-[40px] w-[40px] rounded-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
