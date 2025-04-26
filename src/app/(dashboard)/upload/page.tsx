"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import BackButton from "@/components/BackButton";

interface Student {
    _id: string;
    name: string;
}

interface GradeInput {
    studentId: string;
    grade: number;
}

const UploadGrades = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const unit = searchParams.get("unit");
    const classId = searchParams.get("class");
    const term = searchParams.get("term");

    const [students, setStudents] = useState<Student[]>([]);
    const [grades, setGrades] = useState<GradeInput[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch(`/api/classes/${classId}/students`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch students.");

                setStudents(data.students);
                setGrades(data.students.map((s: Student) => ({ studentId: s._id, grade: 0 })));
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(err.message);
                    setMessage("Failed to load students.");
                } else {
                    console.error("Unexpected error:", err);
                    setMessage("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchStudents();
        } else {
            setMessage("Missing class ID.");
            setLoading(false);
        }
    }, [classId]);

    const handleGradeChange = (index: number, grade: number) => {
        const newGrades = [...grades];
        newGrades[index].grade = grade;
        setGrades(newGrades);
    };

    const handleSubmit = async () => {
        const teacherId = localStorage.getItem("userId");
        const unitId = unit;
        if (!teacherId || !unitId || !classId || !term) {
            return setMessage("Missing required information.");
        }

        try {
            const res = await fetch("/api/teacherDashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teacherId,
                    unitId,
                    classId,
                    term,
                    grades,
                }),
            });

            // Ensure response is successful before parsing
            if (!res.ok) {
                const errorText = await res.text(); // Check if there's error text
                throw new Error(errorText || "Failed to upload grades.");
            }

            // Safe JSON parse
            let data;
            try {
                data = await res.json();
            } catch {
                data = {}; // If no JSON is returned, use empty object
            }

            setMessage(data.message || "Grades uploaded successfully!");
            router.push("/teacherDashboard"); // redirect back
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message || "An error occurred while uploading.");
            } else {
                setMessage("An unknown error occurred.");
            }
        }
    };

    if (loading) return <Loader text="Loading students..." />;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Upload Grades</h1>

            {message && (
                <Alert variant="destructive">
                    <p className="text-red-600">{message}</p>
                </Alert>
            )}

            <p className="text-gray-600">Term: <strong>{term}</strong></p>

            <div className="space-y-4">
                {students.map((student, index) => (
                    <div
                        key={student._id}
                        className="flex items-center justify-between bg-white p-4 border rounded-lg shadow"
                    >
                        <span className="text-gray-700 font-medium">{student.name}</span>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            className="w-24 border rounded px-2 py-1"
                            value={grades[index]?.grade}
                            onChange={(e) => handleGradeChange(index, Number(e.target.value))}
                        />
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <Button onClick={handleSubmit}>Submit Grades</Button>
            </div>
        </div>
    );
};

export default UploadGrades;