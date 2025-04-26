"use client";

import { useEffect, useState } from "react";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { getUserProfile } from "@/utils/getUserProfile";

type User = {
    name: string;
    email: string;
    image?: string;
};

export function Avatars() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserProfile();
                setUser(res);
            } catch (err) {
                console.error("User fetch failed:", err);
                setError("Unable to load user info");
            }
        };

        fetchUser();
    }, []);

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    const initials = user?.name ? getInitials(user.name) : "??";

    return (
        <div className="flex flex-col items-center text-center">
            <Avatar className="w-10 h-10 max-[470px]:ml-6">
                <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <p className="text-sm mt-1 font-medium max-[392px]:hidden text-gray-700 dark:text-gray-300">
                {user?.email || "Guest User"}
            </p>

            {error && (
                <p className="text-xs text-red-500 max-[392px]:hidden mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
