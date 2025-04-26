"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"; // ShadCN UI components
import Link from "next/link";
import BackButton from "@/components/BackButton";

type Course = {
    _id: string;
    name: string;
    duration: string;
};

function CreateCourse() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch courses data
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/admin/create-course");
                setCourses(res.data); // Assuming res.data is an array of courses
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.error("Error fetching courses:", err.response?.data || err.message);
                    setError("Failed to fetch courses. Please try again.");
                } else {
                    console.error("Unexpected error:", err);
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <CardTitle>Created Courses</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {courses.length > 0 && (
                        <p className="mb-4">
                            Available courses: <span className="font-semibold">{courses.length}</span>
                        </p>
                    )}

                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="h-64 overflow-y-auto border rounded-md p-4 bg-gray-50">
                            {loading ? "Loading courses..." : null}

                            <ol className="list-decimal pl-8">
                                {courses.map((course: Course) => (
                                    <li key={course._id} className="mb-4">
                                        <span className="text-lg font-semibold">{course.name}</span> - {course.duration}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </CardContent>
                <div className="mt-4 justify-center items-center text-center p-4 bg-gray-50 rounded-b-lg">
                    <p className="text-gray-600">Click the button below to create a new course.</p>
                    <Link href="/adminDashboard/createCourse">
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Create Course
                        </button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}

export default CreateCourse;