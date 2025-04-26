"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

const LoginPage = () => {
    const [email, setEmail] = useState(""); // Email state
    const [password, setPassword] = useState(""); // Password state
    const [role, setRole] = useState("Student"); // Default role
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter(); // For navigation

    // **Handle Form Submission**
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        setLoading(true); // Show loading state while processing

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();
            console.log("Login Response:", data); // Debug log for response data

            if (response.ok) {
                // Save tokens and user info to localStorage
                localStorage.setItem("accessToken", data.accessToken); // Store short-lived access token
                localStorage.setItem("refreshToken", data.refreshToken); // Store long-lived refresh token
                localStorage.setItem("userId", data.user.id); // Store user ID
                console.log("Tokens saved to localStorage:", {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    userId: data.user.id,
                }); // Debug log for token storage

                // Redirect based on enrollment status
                if (data.user.role === "Student") {
                    if (data.enrolled) {
                        router.push("/timetable"); // Redirect enrolled students
                    } else {
                        router.push("/enrollment"); // Redirect unenrolled students
                    }
                } else if (data.user.role === "Teacher") {
                    router.push("/teachersDashboard"); // Teacher dashboard
                } else {
                    router.push("/adminDashboard"); // Admin dashboard
                }
            } else {
                // Handle invalid credentials or login failure
                toast.error(data.error || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            console.error("Login Error:", err); // Debug log for errors
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md space-y-4 bg-white dark:bg-gray-500 p-6 rounded-lg shadow-md"
            >
                <h1 className="text-2xl font-bold text-center">Login</h1>

                {/* Email Input */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        className="dark:text-gray-100"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="mb-4 dark:text-gray-100">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        className="dark:text-gray-100"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Role Selector */}
                <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    >
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;