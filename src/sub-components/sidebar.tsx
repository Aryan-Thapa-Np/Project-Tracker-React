import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { User } from "../types/usersFTypes.tsx";
import { Users, Bell, UserCog,ArrowRightToLine, FolderClock, ClipboardCheck,House, Settings, Clock9 } from "lucide-react";


interface SidebarProps {
  user?: User | null;
}


const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const getActiveClass = (path: string) =>
    location.pathname === path ? 'bg-black/5 text-[#1173d4]' : 'hover:text-gray-600 hover:bg-black/5';

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);


  useEffect(() => {
    if (sidebarRef.current) {
      if (isOpen) {
        sidebarRef.current.classList.add('show');
      } else {
        sidebarRef.current.classList.remove('show');
      }
    }
  }, [isOpen]);








  return (
    <div ref={sidebarRef} className="sidebar  flex flex-col justify-between w-56 bg-white shadow-lg p-6">
      <div className="py-15">
        <ul className="space-y-2 text-gray-600 font-medium">
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/')}`}>
            <Link to="/" className="flex items-center space-x-2">
              <House size={20}/>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/tasks')}`}>
            <Link to="/tasks" className="flex items-center space-x-2">
              <ClipboardCheck size={20} />
              <span>My Tasks</span>
            </Link>
          </li>
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/projects')}`}>
            <Link to="/projects" className="flex items-center space-x-2">
              <FolderClock size={20} />
              <span>Projects</span>
            </Link>
          </li>
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/teams')}`}>
            <Link to="/teams" className="flex items-center space-x-2">
              <Users size={20} />
              <span>Teams</span>
            </Link>
          </li>
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/notifications')}`}>
            <Link to="/notifications" className="flex items-center space-x-2 relative">
              <Bell size={20} />
              <span>Notifications</span>
              <span className="absolute top-[-5px] right-[-5px] cursor-pointer bg-red-500 pr-1 pl-1 rounded-full text-white text-[12px]">
                {user?.notification_count || ""}
              </span>
            </Link>
          </li>
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/users')}`}>
            <Link to="/users" className="flex items-center space-x-2">

              <UserCog size={20} />
              <span>Users</span>
            </Link>
          </li>
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/logs')}`}>
            <Link to="/logs" className="flex items-center space-x-2">
              <Clock9 size={20} />
              <span>Logs</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="bottom-sidebar mt-10 border-gray-200 border-t-1 pt-4">
        <ul className="space-y-3 text-gray-800">
          <li className={`cursor-pointer p-2 rounded-sm ${getActiveClass('/settings')}`}>
            <Link to="/settings" className="flex items-center space-x-2">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
          <li className="hover:text-red-500 cursor-pointer p-2 rounded-sm">
            <Link to="/logout" className="flex items-center space-x-2">
              <ArrowRightToLine size={20} />
              <span>Log out</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;