"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import DashboardDropdown from "./Dashboard";
import { SwitchTheme } from "./Switch";

export default function Sidebar() {

    return (
        <div className="  flex-col  hidden min-[520px]:flex w-64 min-w-[200px] bg-gray-400 dark:bg-gray-700  min-h-screen">
            <div className="flex flex-col mt-4 items-center bg-gray-400 p-4 dark:bg-gray-700 text-blue-900 dark:text-gray-900">
                <div className="flex flex-row items-center justify-center gap-2">
                    <div className=" flex h-5 w-5 bg-gray-500 dark:bg-amber-50 rounded-full items-center justify-center"><p className="text-center pt-0 justify-center font-extrabold ">E</p></div>
                    <h1 className="font-extrabold">Education</h1>

                </div>


            </div>
            <div className="m-4">
                <hr className="border-t border-gray-900 dark:border-gray-100 my-4" />
            </div>


            <div className="flex flex-col mt-4 items-center bg-gray-400 dark:bg-gray-700 text-white hover:text-zoom-out-10">
                <DropdownMenu >
                    <DropdownMenuTrigger className="dark:bg-gray-700 text-gray-950 dark:text-gray-100">Settings</DropdownMenuTrigger>
                    <DropdownMenuContent >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500">
                            <Link href="app/requestReset">Password Reset</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem ><div className="flex flex-col gap-2">
                            <h2 className="text-gray-900 dark:text-gray-100"> Change Theme</h2>
                            <SwitchTheme />
                        </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>


            <div className="flex flex-col mt-4 items-center bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-white hover:zoom-out-10">
                <DashboardDropdown />
            </div>




        </div>
    );
}