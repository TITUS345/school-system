"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BackButton from "@/components/BackButton";

export default function ResetPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    async function handleResetPassword() {
        console.log("Reset Token:", resetToken);
        console.log("New Password:", newPassword);

        if (!resetToken || !newPassword) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (resetToken.length < 5) {
            toast.error("Invalid reset token.");
            return;
        }
        if (newPassword.length < 5) {
            toast.error("Password must be at least 5 characters long.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                resetToken,
                newPassword,
            };
            console.log("Payload being sent to backend:", payload);

            const res = await axios.post("/api/auth/reset-password", payload);
            console.log("Response from password reset:", res.data);
            if (res.data && res.data.success) {
                toast.success(res.data.message || "Password reset successful. You can now log in with your new password.");
                router.push("/auth/logIn");
            } else {
                toast.error(res.data.error || "Something went wrong. Please try again.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Error during password reset:", error.response?.data || error.message);
                toast.error(error.response?.data?.error || error.message || "An unexpected error occurred.");
            } else {
                console.error("Unexpected Error:", error);
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg mx-auto mt-20">
                <CardHeader className="items-center">
                    <CardTitle className="text-center">Reset Your Password</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <form className="space-y-4">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Reset Token
                            </label>
                            <input
                                type="text"
                                id="resetToken"
                                name="resetToken"
                                value={resetToken}
                                onChange={(e) => setResetToken(e.target.value)}
                                required
                                placeholder="Enter your Reset Token"
                                className="mt-1 block w-full p-2 dark:text-gray-100 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                name="new-password"
                                required
                                placeholder="Enter new password"
                                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-700"
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}