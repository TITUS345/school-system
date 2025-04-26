"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const router = useRouter();

    // Checks login status on mount and after logout
    const checkLoginStatus = () => {
        const token = localStorage.getItem("accessToken");
        console.log("Token exists?", token);
        setIsLoggedIn(!!token);
    };

    useEffect(() => {
        checkLoginStatus();

        window.addEventListener("focus", checkLoginStatus);
        return () => window.removeEventListener("focus", checkLoginStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        router.refresh();
        router.push("/auth/logIn");
    };

    if (isLoggedIn === null) {
        return null;
    }

    return (
        <div className="hidden sm:flex items-center space-x-4">
            {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="text-red-300 rounded-full bg-gray-200  dark:bg-gray-900 p-1 hover:underline"
                >
                    Logout
                </button>
            ) : (
                <button>
                    <div className="flex bg-gray-200  dark:bg-gray-900 rounded-full p-1">
                        <Link href="/auth/logIn" className="text-gray-700 dark:text-gray-100 hover:underline">
                            Login
                        </Link>

                    </div>
                </button>

            )}
        </div>
    );
}
