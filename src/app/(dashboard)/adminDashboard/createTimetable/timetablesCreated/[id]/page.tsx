"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "@/components/BackButton";

type ClassItem = {
    _id: string;
    name: string;
};

type Unit = {
    _id: string;
    name: string;
};

type Timetable = {
    _id: string;
    class: { name: string };
    course: { name: string };
    unit: { name: string };
    teacher: { name: string };
    term: string;
    date: string;
    time: string;
};

export default function TimetablesCreated() {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [courses, setCourses] = useState<{ _id: string; name: string }[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/admin/create-course");
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchClasses = async () => {
            if (!selectedCourse) {
                setError("Please select a course.");
                return;
            }

            try {
                const response = await axios.get(`/api/admin/create-class?courseId=${selectedCourse}`);
                setClasses(Array.isArray(response.data.classes) ? response.data.classes : []);
            } catch (err) {
                console.error("Error fetching classes:", err);
                setError("Failed to fetch classes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUnits = async () => {
            if (!selectedCourse) {
                setError("Please select a course.");
                return;
            }

            try {
                const response = await axios.get(`/api/admin/create-unit?courseId=${selectedCourse}`);
                setUnits(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching units:", err);
                setError("Failed to fetch units. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
        fetchClasses();
        fetchUnits();
    }, [selectedCourse]);

    const handleFetchTimetables = async () => {
        if (!selectedCourse || !selectedClass || !selectedUnit) {
            setError("Please select a course, class, and unit to fetch timetables.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(
                `/api/admin/create-timetable?courseId=${selectedCourse}&classId=${selectedClass}&unitId=${selectedUnit}`
            );
            setTimetables(Array.isArray(res.data.timetables) ? res.data.timetables : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching timetables:", err);
            setError("Failed to fetch timetables. Please try again.");
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
                    <CardTitle className="text-center">Timetables</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
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
                        <div className="mb-4">
                            <select
                                className="border rounded-md p-2 w-full"
                                id="classId"
                                onChange={(e) => setSelectedClass(e.target.value)}
                                value={selectedClass}
                            >
                                <option value="">Select Class</option>
                                {classes.map((classItem: ClassItem) => (
                                    <option key={classItem._id} value={classItem._id}>
                                        {classItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <select
                                className="border rounded-md p-2 w-full"
                                id="unitId"
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                value={selectedUnit}
                            >
                                <option value="">Select Unit</option>
                                {units.map((unit: Unit) => (
                                    <option key={unit._id} value={unit._id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            {(!selectedCourse || !selectedClass || !selectedUnit) && (
                                <p className="text-red-500 text-sm">
                                    Please select a course, class, and unit to fetch timetables.
                                </p>
                            )}
                            <Button
                                type="button"
                                onClick={handleFetchTimetables}
                                disabled={loading}
                                className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Fetching Tables..." : "Fetch Timetables"}
                            </Button>
                        </div>
                        <div className="mb-4">
                            <h1 className="block text-sm font-medium text-gray-700">List of Timetables</h1>
                            {timetables.length > 0 && !error && (
                                <p className="mb-4">
                                    Available timetables: <span className="font-semibold">{timetables.length}</span>
                                </p>
                            )}
                            <ol className="list-decimal list-inside" id="timetableId">
                                {timetables.map((timetable: Timetable) => (
                                    <li key={timetable._id}>
                                        <p>
                                            <strong>Class:</strong> {timetable.class?.name || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Course:</strong> {timetable.course?.name || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Unit:</strong> {timetable.unit?.name || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Teacher:</strong> {timetable.teacher?.name || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Term:</strong> {timetable.term || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Date:</strong> {new Date(timetable.date).toLocaleDateString() || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Time:</strong> {timetable.time || "N/A"}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}