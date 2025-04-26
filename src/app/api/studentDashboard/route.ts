import connectDB from "@/utils/db";
import mongoose from "mongoose";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import Class from "@/models/Class";
import Unit from "@/models/Unit";
import Timetable from "@/models/Timetable";

import { NextResponse } from "next/server";

interface Unit {
    name: string;
}

interface Timetable {
    unit: { name: string };
    teacher: { name: string };
    date: string;
    time: string;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    await connectDB();
    // Log registered models
    console.log("Registered Models:", mongoose.modelNames());
    console.log("Using Course model:", Course.modelName);
    console.log("Using Class model:", Class.modelName);
    console.log("Using Unit model:", Unit.modelName);
    console.log("Using Timetable model:", Timetable.modelName);

    // Validate the student ID
    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
        return NextResponse.json({ error: "User not found or not a student" }, { status: 404 });
    }

    // Fetch enrollment data for the student
    const enrollment = await Enrollment.findOne({ student: studentId })
        .populate("course")
        .populate("class")
        .populate("units")
        .populate({
            path: "timetables",
            populate: { path: "unit teacher class course" },
        });

    if (!enrollment) {
        return NextResponse.json({ error: "No enrollment found for this student" }, { status: 404 });
    }

    // Structure the response
    return NextResponse.json({
        message: "Dashboard data fetched successfully!",
        student: {
            name: student.name,
            email: student.email,
            class: enrollment.class.name,
            course: enrollment.course.name,
            units: enrollment.units.map((unit: Unit) => unit.name),
            timetables: enrollment.timetables.map((timetable: Timetable) => ({
                unit: timetable.unit.name,
                teacher: timetable.teacher.name,
                date: timetable.date,
                time: timetable.time,
            })),
        },
    });
}