"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BackButton from "@/components/BackButton";

const timetableSchema = z.object({
    courseId: z.string().min(2, { message: "Course name must be at least 2 characters." }),
    classId: z.string().min(2, { message: "Class name must be at least 2 characters." }),
    unitId: z.string().min(2, { message: "Unit name must be at least 2 characters." }),
    teacherId: z.string().min(2, { message: "Teacher name must be at least 2 characters." }),
    date: z.string().min(2, { message: "Date name must be at least 2 characters." }),
    time: z.string().min(2, { message: "Time name must be at least 2 characters." }),
    term: z.string().min(2, { message: "Term name must be at least 2 characters." }),
});

type TimetableFormValues = z.infer<typeof timetableSchema>;

type Course = {
    _id: string;
    name: string;
};

type ClassItem = {
    _id: string;
    name: string;
};

type Unit = {
    _id: string;
    name: string;
};

type Teacher = {
    _id: string;
    name: string;
};

function CreateTimetable() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<string>("");
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("");
    const [classesItem, setClassesItem] = useState<ClassItem[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TimetableFormValues>({
        resolver: zodResolver(timetableSchema),
        defaultValues: { courseId: "", classId: "", unitId: "", teacherId: "", date: "", time: "", term: "" },
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/admin/create-course");
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                toast.error("Failed to fetch courses. Please try again.");
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await axios.get("/api/auth/signup?role=Teacher");
                setTeachers(Array.isArray(response.data.users) ? response.data.users : []);
            } catch (err) {
                console.error("Error fetching teachers:", err);
                toast.error("Failed to fetch teachers. Please try again.");
            }
        };

        const fetchUnits = async () => {
            if (!selectedCourse) return;

            try {
                const response = await axios.get(`/api/admin/create-unit?courseId=${selectedCourse}`);
                setUnits(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching units:", err);
                toast.error("Failed to fetch units. Please try again.");
            }
        };

        const fetchClassesItem = async () => {
            if (!selectedCourse) return;

            try {
                const response = await axios.get(`/api/admin/create-class?courseId=${selectedCourse}`);
                setClassesItem(Array.isArray(response.data.classes) ? response.data.classes : []);
            } catch (err) {
                console.error("Error fetching classes:", err);
                toast.error("Failed to fetch classes. Please try again.");
            }
        };

        fetchCourses();
        fetchTeachers();

        if (selectedCourse) {
            fetchUnits();
            fetchClassesItem();
        }
    }, [selectedCourse]);

    const onSubmit = async (data: TimetableFormValues) => {
        const payload = { ...data };
        try {
            const response = await axios.post("/api/admin/create-timetable", payload);
            toast.success(`Success: "${response.data.message}"`);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(`Error: ${error.response?.data.error || "Timetable creation failed"}`);
            } else {
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
                    <CardTitle className="text-center">Create Timetable</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <select
                                {...register("courseId")}
                                className="border rounded-md p-2 w-full"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">Select Course</option>
                                {courses.map((course: Course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <select
                                {...register("classId")}
                                className="border rounded-md p-2 w-full"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Select Class</option>
                                {classesItem.map((classItem: ClassItem) => (
                                    <option key={classItem._id} value={classItem._id}>
                                        {classItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <select
                                {...register("unitId")}
                                className="border rounded-md p-2 w-full"
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                            >
                                <option value="">Select Unit</option>
                                {units.map((unit: Unit) => (
                                    <option key={unit._id} value={unit._id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <select
                                {...register("teacherId")}
                                className="border rounded-md p-2 w-full"
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher: Teacher) => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Provide Date</label>
                            <input {...register("date")} type="date" placeholder="Date" required />
                            {errors.date && <p className="text-red-500">{errors.date.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Provide Time Range</label>
                            <input
                                {...register("time", {
                                    pattern: /^\d{2}:\d{2}-\d{2}:\d{2}$/,
                                })}
                                type="text"
                                placeholder="Time Range (e.g., 12:00-1:30)"
                                required
                            />
                            {errors.time && <p className="text-red-500">{errors.time.message || "Invalid time format (HH:mm-HH:mm)"}</p>}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Provide Term</label>
                            <input {...register("term")} type="text" placeholder="Term" required />
                            {errors.term && <p className="text-red-500">{errors.term.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Button type="submit" className="w-full">
                                Create Timetable
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateTimetable;