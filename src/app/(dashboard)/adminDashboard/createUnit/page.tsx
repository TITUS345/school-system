"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import BackButton from "@/components/BackButton";

const unitSchema = z.object({
    name: z.string().min(2, { message: "Unit name must be at least 2 characters." }),
    courseId: z.string().min(2, { message: "Course ID must be at least 2 characters." }),
    teacherId: z.string().min(2, { message: "Teacher ID must be at least 2 characters." }),
    semester: z.string().min(2, { message: "Semester must be at least 2 characters." }),
});
type UnitFormValues = z.infer<typeof unitSchema>;

type Course = {
    _id: string;
    name: string;
};

type Teacher = {
    _id: string;
    name: string;
};

function CreateUnit() {
    const router = useRouter(); // For navigation
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]); // State for courses
    const [teachers, setTeachers] = useState<Teacher[]>([]); // State for teachers

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UnitFormValues>({
        resolver: zodResolver(unitSchema),
        defaultValues: { name: "", courseId: "", teacherId: "", semester: "" },
    });

    // Fetching courses and teachers on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                const res = await axios.get("/api/admin/create-course");
                console.log("Fetched courses:", res.data);
                setCourses(res.data); // Set courses from response
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.error("Error fetching courses:", err.response?.data || err.message);
                } else {
                    console.error("Unexpected error:", err);
                }
            } finally {
                setLoadingCourses(false);
            }
        };

        const fetchTeachers = async () => {
            try {
                const res = await axios.get("/api/auth/signup?role=Teacher"); // role as a query parameter
                console.log("Fetched teachers:", res.data);
                setTeachers(Array.isArray(res.data.users) ? res.data.users : []);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.error("Error fetching teachers:", err.response?.data || err.message);
                } else {
                    console.error("Unexpected error:", err);
                }
            }
        };

        fetchCourses();
        fetchTeachers();
    }, []);

    const onSubmit = async (data: UnitFormValues) => {
        const payload = {
            ...data,
            courseId: data.courseId, // Map `course` to `courseId`
            teacherId: data.teacherId, // Map `teacher` to `teacherId`
        };
        console.log("Payload being sent to backend:", payload);

        try {
            const response = await axios.post("/api/admin/create-unit", payload); // Backend endpoint
            console.log("Response:", response);
            toast.success(`Success: "${response.data.message}"`);
            router.push("/adminDashboard/createUnit/unitscreated/[id]");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error("Error creating unit:", err.response?.data || err.message);
                toast.error(`Error: ${err.response?.data.error || "Unit creation failed"}`);
            } else {
                console.error("Unexpected error:", err);
                toast.error("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <CardTitle className="text-center">Create Unit</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="unitName">Unit Name</Label>
                            <Input
                                {...register("name")}
                                id="unitName"
                                placeholder="Unit Name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="courseId">Select Course</Label>
                            <select
                                {...register("courseId")}
                                id="courseId"
                                className="border rounded-md p-2 w-full"
                            >
                                <option value="">Select Course</option>
                                {courses.map((course: Course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            {errors.courseId && (
                                <p className="text-red-500 text-sm">{errors.courseId.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="teacherId">Select Teacher</Label>
                            <select
                                {...register("teacherId")}
                                id="teacherId"
                                className="border rounded-md p-2 w-full"
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher: Teacher) => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                            {errors.teacherId && (
                                <p className="text-red-500 text-sm">{errors.teacherId.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="semester">Semester</Label>
                            <Input
                                {...register("semester")}
                                id="semester"
                                placeholder="Semester"
                            />
                            {errors.semester && (
                                <p className="text-red-500 text-sm">{errors.semester.message}</p>
                            )}
                        </div>

                        <div>
                            <Button type="submit" disabled={loadingCourses} className="w-full mt-4">
                                {loadingCourses ? "Loading..." : "Create Unit"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateUnit;