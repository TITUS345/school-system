"use client";

import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useState, useEffect } from "react";

export default function UnitsCreated() {
    const [units, setUnits] = useState<{ _id: string; name: string }[]>([]);
    const [courses, setCourses] = useState<{ _id: string; name: string }[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/admin/create-course");
                console.log("Fetched courses:", res.data);
                setCourses(Array.isArray(res.data) ? res.data : []);
                setError(null);
            } catch (err: unknown) {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleFetchUnits = async () => {
        if (!selectedCourse) {
            setError("Please select a course to fetch units.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`/api/admin/create-unit?courseId=${selectedCourse}`);
            console.log("Fetched units response:", res.data); // Debugging
            setUnits(Array.isArray(res.data) ? res.data : []); // Directly set the response as units
            console.log("Updated units state:", Array.isArray(res.data) ? res.data : []); // Debugging
            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching units:", err);
            setError("Failed to fetch units. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     console.log("Updated units state:", units); // Debugging
    // }, [units]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <CardTitle className="text-center">Created Units</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form className="space-y-4">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
                                Select Course
                            </label>
                            <select
                                id="courseId"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="border rounded-md p-2 w-full"
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            type="button"
                            onClick={handleFetchUnits}
                            disabled={loading}
                            className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Fetching Units..." : "Fetch Units"}
                        </Button>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                            <label>List of Units</label>
                            {units.length > 0 ? (
                                <ol className="list-decimal pl-5">
                                    {units.map((unit) => (
                                        <li key={unit._id} className="py-2">
                                            {unit.name}
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-500">No units available for the selected course.</p>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}