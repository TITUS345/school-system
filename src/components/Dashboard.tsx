"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserProfile } from "@/utils/getUserProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardDropdown() {
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        getUserProfile()
            .then((user) => {
                console.log("Logged-in user:", user); // Debug
                if (user && user.role) {
                    setRole(user.role.toLowerCase());
                } else {
                    setRole(null); // If not logged in or role missing
                }
            })
            .catch((err) => {
                console.error("Failed to fetch user profile:", err);
                setRole(null);
            });
    }, []);

    const handleDashboardClick = () => {
        switch (role) {
            case "admin":
                return router.push("/adminDashboard");
            case "teacher":
                return router.push("/teachersDashboard/teachers");
            case "student":
                return router.push("/studentsDashboard");
            default:
                alert("Unknown role or not logged in.");
        }
    };

    const getDashboardLabel = () => {
        switch (role) {
            case "admin":
                return "Admin Dashboard";
            case "teacher":
                return "Teacher Dashboard";
            case "student":
                return "Student Dashboard";
            default:
                return "Loading...";
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>Dashboard</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDashboardClick}>
                    {getDashboardLabel()}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}