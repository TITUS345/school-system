"use client";

import Link from "next/link";
import { Avatars } from "./Avatar";
import { SwitchTheme } from "./Switch";
import AuthButton from "./LogInLogOut";
import { Button } from "./ui/button";
import { FiMenu, FiX } from "react-icons/fi"; // Menu (open) & X (close)

const Navbar = ({ toggleSidebar, isSidebarOpen }: { toggleSidebar?: () => void, isSidebarOpen?: boolean }) => {
    return (
        <header className={`rounded-b-3xl bg-blue-500 dark:bg-gray-700 p-6 transition-all ${isSidebarOpen ? "sm:w-[calc(100vw-256px)] sm:ml-64" : "w-full"
            }`}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="max-[495px]:hidden text-gray-800 dark:text-blue-500 text-lg font-bold">
                    MyApp
                </div>

                <ul className="flex max-[246px]:flex-col space-x-4">
                    <li>
                        <Link
                            href="/"
                            className="text-gray-900 dark:text-blue-500 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/navbar/about"
                            className="text-gray-800 dark:text-white hover:text-gray-100 dark:hover:text-blue-300"
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/navbar/contact"
                            className="text-gray-800 dark:text-white hover:text-gray-100 dark:hover:text-blue-300"
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                <div className="flex items-center space-x-4">
                    <div className="max-[364px]:hidden"> {/* Hides on extra small screens */}
                        <Avatars />
                    </div>
                    <div className="hidden sm:flex items-center space-x-4">
                        <AuthButton />
                    </div>
                </div>

                {/* Sidebar Toggle Button */}
                {toggleSidebar && (
                    <Button onClick={toggleSidebar} className="bg-blue-500 rounded p-2 text-white sm:hidden flex items-center">
                        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </Button>
                )}

                <div className="max-[360px]:ml-0 pl-0 max-[629px]:hidden">
                    <SwitchTheme />
                </div>
            </div>
        </header>
    );
};

export default Navbar;