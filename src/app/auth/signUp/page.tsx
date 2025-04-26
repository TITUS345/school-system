"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

// Schema validation using Zod
const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["Admin", "Teacher", "Student"]),
    signupKey: z.string().optional(),
});

// Infer type from Zod schema
type SignupData = z.infer<typeof signupSchema>;

const SignupPage = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupData) => {
        setLoading(true);
        try {
            console.log("Signup Data:", data); // Debugging log
            const response = await axios.post("/api/auth/signup", data);

            toast.success(`Success: ${response.data.message}`); // Notify user
            router.push("/auth/logIn"); // Redirect to login page
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Signup Error:", error.response?.data || error.message); // Debugging log
                toast.error(`Error: ${error.response?.data.error || "Signup failed"}`);
            } else {
                console.error("Unexpected Error:", error);
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <Label>Name</Label>
                            <Input {...register("name")} placeholder="Your User Name" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Email Input */}
                        <div>
                            <Label>Email</Label>
                            <Input type="email" {...register("email")} placeholder="example@mail.com" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password Input */}
                        <div>
                            <Label>Password</Label>
                            <Input type="password" {...register("password")} placeholder="******" />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <Label>Role</Label>
                            <select {...register("role")} className="border rounded-md p-2 w-full dark:bg-gray-700 dark:text-white">
                                <option value="Admin">Admin</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                        </div>

                        {/* Signup Key Input */}
                        <div>
                            <Label>Signup Key (optional)</Label>
                            <Input {...register("signupKey")} placeholder="Enter signup key (if applicable)" />
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignupPage;