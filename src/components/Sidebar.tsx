"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import DashboardDropdown from "./Dashboard";
import { SwitchTheme } from "./Switch";
import { Button } from "./ui/button";
import { FiX } from "react-icons/fi"; // About icon (info icon)
import AuthButton from "./LogInLogOut";

export default function Sidebar({ closeSidebar }: { closeSidebar: () => void }) {
    return (
        <div className="fixed left-0 top-0 h-screen w-64 min-w-[200px] bg-gray-400 dark:bg-gray-700 transition-transform sm:translate-x-0">
            {/* Sidebar Header */}
            <div className="flex flex-col mt-4 items-center bg-gray-400 p-4 dark:bg-gray-700 text-blue-900 dark:text-gray-900">
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 bg-gray-500 dark:bg-amber-50 rounded-full items-center justify-center">
                            <p className="text-center font-extrabold">E</p>
                        </div>
                        <h1 className="font-extrabold">Education</h1>
                    </div>
                    <Button onClick={closeSidebar} className="bg-blue-400 text-white max-[382px]:pl-10 rounded p-2 flex items-center gap-2">
                        <FiX size={20} />
                    </Button>

                </div>
            </div>

            <div className="m-4">
                <hr className="border-t border-gray-900 dark:border-gray-100 my-4" />
            </div>

            {/* Settings */}
            <div className="flex flex-col mt-4 items-center bg-gray-400 dark:bg-gray-700 text-white">
                <DropdownMenu>
                    <DropdownMenuTrigger className="dark:bg-gray-700 text-gray-950 dark:text-gray-100">
                        Settings
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            asChild
                            className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500"
                        >
                            <Link href="/auth/logIn">Log In</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            asChild
                            className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500"
                        >
                            <AuthButton />
                        </DropdownMenuItem>


                        <DropdownMenuItem
                            asChild
                            className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500"
                        >
                            <Link href="/auth/signUp">Sign Up</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            asChild
                            className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500"
                        >
                            <Link href="/app/requestReset">Password Reset</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <div className="flex flex-col gap-2">
                                <h2 className="text-gray-900 dark:text-gray-100">Change Theme</h2>
                                <SwitchTheme />
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Finance */}
            <div className="flex flex-col mt-4 items-center bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-white">
                <DropdownMenu>
                    <DropdownMenuTrigger>Finance</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Fee Statement</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>HELP loan</DropdownMenuItem>
                        <DropdownMenuItem>Fee Structure</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Dashboard */}
            <div className="flex flex-col mt-4 items-center bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-white">
                <DashboardDropdown />
            </div>
        </div>
    );
}