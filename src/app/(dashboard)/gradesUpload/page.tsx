"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Alert } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import BackButton from "@/components/BackButton";

interface Student {
    id: string;
    name: string;
}

interface GradeInput {
    studentId: string;
    grade: number;
}

const GradesUpload = () => {
    const searchParams = useSearchParams();

    const [unit, setUnit] = useState<string | null>(null);
    const [className, setClassName] = useState<string | null>(null);
    const [term, setTerm] = useState<string | null>(null);

    const [students, setStudents] = useState<Student[]>([]);
    const [grades, setGrades] = useState<GradeInput[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch query params
    useEffect(() => {
        const unitParam = searchParams.get("unit");
        const classParam = searchParams.get("class");
        const termParam = searchParams.get("term");

        if (unitParam) setUnit(unitParam);
        if (classParam) setClassName(classParam);
        if (termParam) setTerm(termParam);
    }, [searchParams]);

    // Fetch students based on class and term
    useEffect(() => {
        const fetchStudents = async () => {
            if (!unit || !className || !term) return;

            setLoading(true);
            try {
                const response = await fetch(`/api/getStudentsInClass?class=${className}`);
                const data = await response.json();
                console.log("Fetched students:", data);

                if (response.ok) {
                    setStudents(data.students);
                    setGrades(
                        data.students.map((student: Student) => ({
                            studentId: student.id,
                            grade: 0, // Default grade value
                        }))
                    );
                } else {
                    setError(data.error || "Failed to fetch students.");
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || "An error occurred while fetching student data.");
                } else {
                    setError("An unknown error occurred.");
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [unit, className, term]);

    // Handle grade change
    const handleGradeChange = (studentId: string, value: number) => {
        setGrades((prevGrades) =>
            prevGrades.map((grade) =>
                grade.studentId === studentId ? { ...grade, grade: value } : grade
            )
        );
    };

    // Handle form submission to upload grades
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!unit || !className || !term) {
            setError("Missing required data.");
            return;
        }

        try {
            setLoading(true);
            const teacherId = localStorage.getItem("userId");
            if (!teacherId) {
                setError("Teacher not logged in.");
                return;
            }
            console.log("the teacherId", teacherId);

            const response = await fetch("/api/teacherDashboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    teacherId,
                    classId: className,
                    unitId: unit,
                    grades,
                    term,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Attempt to read error text
                throw new Error(errorText || "Failed to upload grades.");
            }

            const contentType = response.headers.get("Content-Type");
            const data = contentType && contentType.includes("application/json") ? await response.json() : {};

            console.log("Upload response:", data);
            setSuccess("Grades uploaded successfully!");
            setGrades([]); // Clear grades after successful upload
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An error occurred while uploading grades.");
            } else {
                setError("An unknown error occurred.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader text="Loading students..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                    Upload Grades for {className} - {unit} - {term}
                </h1>

                {error && (
                    <Alert variant="destructive">
                        <p className="text-red-600 font-semibold">{error}</p>
                    </Alert>
                )}

                {success && (
                    <Alert variant="destructive">
                        <p className="text-green-600 font-semibold">{success}</p>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 dark:text-gray-100">
                    {students.map((student) => (
                        <div key={student.id} className="flex justify-between dark:text-gray-100">
                            <span>{student.name}</span>
                            <input
                                type="number"
                                value={grades.find((grade) => grade.studentId === student.id)?.grade || 0}
                                onChange={(e) => handleGradeChange(student.id, Number(e.target.value))}
                                className="p-2 border rounded dark:text-gray-100"
                                min="0"
                                max="100"
                            />
                        </div>
                    ))}
                    <Button type="submit" className="mt-4">
                        Upload Grades
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default GradesUpload;