"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/BackButton";

const courseSchema = z.object({
    name: z.string().min(2, {
        message: "Course name must be at least 2 characters.",
    }),
    duration: z.string().min(2, {
        message: "Duration must be at least 2 characters.",
    }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

function CreateCourse() {
    const [Loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
    });

    const onSubmit = async (data: CourseFormValues) => {
        console.log("Course values:", data);
        setLoading(true);
        try {
            const response = await axios.post("/api/admin/create-course", data);
            console.log("Response:", response);
            toast.success(`Success: "${response.data.message}"`);
            //router.push("/adminDashboard/courses");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Error creating course:", error.response?.data || error.message);
                toast.error(`Error: ${error.response?.data.error || "Course creation failed"}`);
            } else {
                console.error("Unexpected error:", error);
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>

            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <CardTitle>Create New Course</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label>Course Name</Label>
                            <Input type="text" {...register("name")} placeholder="Course Name" />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <Label>Course Duration</Label>
                            <Input type="text" {...register("duration")} placeholder="e.g., Four Years" />
                            {errors.duration && (
                                <p className="text-red-500 text-sm">{errors.duration.message}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={Loading}
                            className="w-full text-white bg-gray-800"
                        >
                            {Loading ? "Creating..." : "Create Course"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateCourse;