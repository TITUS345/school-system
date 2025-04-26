"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import BackButton from "@/components/BackButton";

type Course = {
    _id: string;
    name: string;
};

type ClassItem = {
    _id: string;
    name: string;
};

export default function ClassesCreated() {
    const [classes, setClasses] = useState<ClassItem[]>([]); // State for classes
    const [courses, setCourses] = useState<Course[]>([]); // State for courses
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [courseId, setCourseId] = useState(""); // Selected course

    // Fetch courses on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("/api/admin/create-course"); // Fetch courses
                console.log("Fetched courses:", res.data);
                setCourses(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching courses", error);
                setError("Failed to fetch courses. Please try again.");
            }
        };

        fetchCourses();
    }, []);

    // Fetch classes for the selected course
    const fetchClasses = async () => {
        if (!courseId) {
            setError("Please select a course.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`/api/admin/create-class?courseId=${courseId}`);
            console.log("Fetched classes:", res.data);
            setClasses(res.data.classes); // Extract the classes array
            setError(null);
        } catch (error) {
            console.error("Error fetching classes", error);
            setError("Failed to fetch classes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <CardTitle>Classes by Course</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {/* Course Selector */}
                    <div>
                        <label htmlFor="courseId" className="block mb-2">Select a Course:</label>
                        <select
                            id="courseId"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select a Course</option>
                            {courses.map((course: Course) => (
                                <option key={course._id} value={course._id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fetch Classes Button */}
                    <Button
                        className="mt-4 w-full"
                        onClick={fetchClasses}
                        disabled={loading || !courseId}
                    >
                        {loading ? "Loading..." : "Fetch Classes"}
                    </Button>

                    {/* Display Classes */}
                    {classes.length > 0 && !error && (
                        <p className="mb-4">
                            Available classes: <span className="font-semibold">{classes.length}</span>
                        </p>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="h-64 overflow-y-auto border rounded-md p-4 bg-gray-50">
                        <ol className="list-decimal pl-8">
                            {Array.isArray(classes) && classes.map((classItem: ClassItem) => (
                                <li key={classItem._id}>
                                    <span>{classItem.name}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </CardContent>
                <div className="flex justify-end p-4">
                    <Link href="/adminDashboard/createClass">
                        <Button variant="outline">Create New Class</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}