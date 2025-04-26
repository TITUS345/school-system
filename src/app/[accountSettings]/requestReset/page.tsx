"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function RequestResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleResetRequest() {
        console.log("Email entered:", email);

        if (!email) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/api/auth/request-reset", { email });
            console.log("Response from password reset request:", response.data);

            if (response.data && response.data.success) {
                toast.success(response.data.message || "Password reset request sent. Please check your email.");
                router.push("/app/resetPassword");
            } else {
                toast.error(response.data.error || "Something went wrong. Please try again.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error("Error:", err.response?.data || err.message);
                toast.error(err.response?.data.error || "An unexpected error occurred.");
            } else {
                console.error("Unexpected Error:", err);
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <CardTitle className="text-center">Password Reset</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <form className="space-y-4">
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                className="mt-1 dark:text-gray-100"
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleResetRequest} type="button" disabled={loading}>
                            {loading ? "Processing..." : "Request Password Reset"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}