import React, { useEffect, useRef, useState } from 'react';
import profile from '../assets/profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';



const Header: React.FC = () => {
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {

        const handleKey = (event: KeyboardEvent) => {

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchInputRef.current?.focus();
            }

        }

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);


    }, [])


    



    return (
        <header className="z-10 flex justify-between  items-center px-4 py-2 shadow-sm fixed w-full h-[70px] bg-white">
            <div className="nav-left flex gap-1 items-center">
                <div  className="hamburger  cursor-pointer p-2 hover:bg-gray-200 rounded-xl transition-colors">
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <h1 className="text-xl font-bold font-mono">Project Tracker</h1>
            </div>

            <div className="nav-right flex items-center gap-4">
                <div className="searchBox relative">
                    <input
                        ref={searchInputRef}
                        type="search"
                        name="search"
                        id="SearchBar"
                        placeholder="search..."
                        className="pl-10 pr-4 py-[6px] border border-gray-300 outline-gray-300 rounded-md"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    {!isFocused && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm bg-gray-200 pr-2 pl-2 rounded-2xl">
                            Ctrl+K
                        </span>
                    )}
                </div>

                <div className="headerIcons relative p-[5px]">
                    <FontAwesomeIcon
                        icon={faBell}
                        className="text-[17px] text-gray-600 cursor-pointer"
                    />
                    <span className="absolute top-[-5px] right-[-5px] cursor-pointer bg-red-500 pr-1 pl-1 rounded-full text-white text-[12px]">
                        12
                    </span>
                </div>

                <div className="profile relative">
                    <img
                        src={profile}
                        alt="profile"
                        id="profilePicture"
                        className="h-[40px] w-[40px] rounded-full object-cover"
                    />


                </div>
            </div>
        </header>
    );
}

export default Header;
