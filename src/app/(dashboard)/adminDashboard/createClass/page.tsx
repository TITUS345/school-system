"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

const classSchema = z.object({
    name: z.string().min(2, { message: "Class name must be at least 2 characters." }),
    course: z.string().min(2, { message: "Course name must be at least 2 characters." }),
    term: z.string().min(2, { message: "Term name must be at least 2 characters." }),
});
type ClassFormValues = z.infer<typeof classSchema>;

type Course = {
    _id: string;
    name: string;
};

function CreateClass() {
    const router = useRouter(); // For navigation
    const [Loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/admin/create-course"); // Backend route
                console.log("Fetched courses:", response.data);
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch courses. Please try again.");
            }
        };

        fetchCourses();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues: { name: "", course: "", term: "" },
    });

    const onSubmit = async (data: ClassFormValues) => {
        const payload = {
            ...data,
            courseId: data.course, // Map `course` to `courseId`
        };
        console.log("Payload being sent to backend:", payload); // Debugging

        setLoading(true);
        try {
            const response = await axios.post("/api/admin/create-class", payload);
            console.log("Response:", response);
            toast.success(`Success: "${response.data.message}"`);
            router.push("/adminDashboard/createClass/classesCreated/[id]"); // Redirect to createUnit page
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Error creating class:", error.response?.data || error.message);
                toast.error(`Error: ${error.response?.data.error || "Class creation failed"}`);
            } else {
                console.error("Unexpected error:", error);
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <CardTitle>Create New Class</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label>Class Name</Label>
                            <Input type="text" {...register("name")} placeholder="Class Name" required />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label>Course</Label>
                            <select {...register("course")} className="border rounded-md p-2 w-full">
                                <option value="">Select Course</option>
                                {courses.map((course: Course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            {error && <p className="text-red-500">{error}</p>}
                            {errors.course && <p className="text-red-500">{errors.course.message}</p>}
                        </div>
                        <div>
                            <Label>Term</Label>
                            <Input type="text" {...register("term")} placeholder="Term" required />
                            {errors.term && <p className="text-red-500">{errors.term.message}</p>}
                        </div>
                        <div>
                            <Button type="submit" disabled={Loading} className="w-full mt-4">
                                {Loading ? "Creating..." : "Create Class"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateClass;