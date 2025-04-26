"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Alert } from "@/components/ui/alert";
import BackButton from "@/components/BackButton";

// Define the type for a Timetable
interface Timetable {
    unit: string;
    class: string;
    course: string;
    date: string;
    time: string;
    term: string;
}

// Define the type for a Teacher
interface Teacher {
    name: string;
    email: string;
}

const TeacherDashboard = () => {
    const [teacher, setTeacher] = useState<Teacher>({ name: "", email: "" });
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            const teacherId = localStorage.getItem("userId");

            if (!teacherId) {
                setError("No teacherId found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/teacherDashboard?teacherId=${teacherId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch teacher data.");
                }

                setTeacher(data.teacher);
                setTimetables(data.timetables);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Error fetching teacher data:", err.message);
                    setError("Unable to load dashboard data. Please try again later.");
                } else {
                    console.error("Unexpected error:", err);
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader text="Loading dashboard data..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Alert variant="destructive">
                    <p className="text-red-600 font-semibold">{error}</p>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-gray-100 dark:bg-gray-800 p-6">
            <div className="absolute top-4 left-4 max-[416px]:top-1">
                <BackButton />
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
                    Welcome, {teacher.name}
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-200">Email: {teacher.email}</p>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mt-6">Your Timetables</h2>
                    {timetables.length > 0 ? (
                        timetables.map((timetable, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-4 border border-gray-200 space-y-2"
                            >
                                <p><strong>Unit:</strong> {timetable.unit}</p>
                                <p><strong>Class:</strong> {timetable.class}</p>
                                <p><strong>Course:</strong> {timetable.course}</p>
                                <p><strong>Date:</strong> {new Date(timetable.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {timetable.time}</p>
                                <p><strong>Term:</strong> {timetable.term}</p>

                                <Link
                                    href={{
                                        pathname: "/gradesUpload",
                                        query: {
                                            unit: timetable.unit,
                                            class: timetable.class,
                                            term: timetable.term,
                                        },
                                    }}
                                >
                                    <Button className="mt-2">Upload Grades</Button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-200 mt-4">No timetables found for you.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default TeacherDashboard;