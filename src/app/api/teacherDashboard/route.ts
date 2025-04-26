import connectDB from "@/utils/db";

import mongoose from "mongoose";
import User from "@/models/User";

import Course from "@/models/Course";
import Class from "@/models/Class";
import Timetable from "@/models/Timetable";
import Unit from "@/models/Unit";
import Grade from "@/models/Grade"; // Define a Grade schema
import { NextResponse } from "next/server";

interface GradeInput {
    studentId: string;
    grade: number;
}



export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    await connectDB();
    console.log("Registered Models:", mongoose.modelNames());
    console.log("Using Course model:", Course.modelName);


    // Validate the teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "Teacher") {
        return NextResponse.json({ error: "User not found or not a teacher" }, { status: 404 });
    }

    // Fetch timetables for the teacher
    const timetables = await Timetable.find({ teacher: teacherId })
        .populate("unit")
        .populate("class")
        .populate("course");

    // Check if timetables exist
    if (!timetables || timetables.length === 0) {
        return NextResponse.json({
            message: "No timetables found for this teacher.",
            timetables: [],
        });
    }

    // Organize timetable data
    const dashboardData = timetables.map((timetable) => ({
        unit: timetable.unit.name,
        class: timetable.class.name,
        course: timetable.course.name,
        date: timetable.date,
        time: timetable.time,
        term: timetable.term,
    }));

    // Respond with dashboard data
    return NextResponse.json({
        message: "Teacher dashboard data fetched successfully!",
        teacher: {
            name: teacher.name,
            email: teacher.email,
        },
        timetables: dashboardData,
    });
}

export async function POST(req: Request) {
    console.log("Starting POST /api/teacherDashboard");

    try {
        const { teacherId, classId, unitId, grades, term } = await req.json();

        console.log("Received payload:", { teacherId, classId, unitId, grades, term });

        if (!teacherId || !classId || !unitId || !grades || !term) {
            console.error("Missing required fields in the request body.");
            return NextResponse.json(
                { error: "Missing required fields in the request body." },
                { status: 400 }
            );
        }

        await connectDB();
        console.log("Database connected successfully.");
        console.log("Registered Models:", mongoose.modelNames());

        // Validate the Teacher
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== "Teacher") {
            console.error("User not found or not a teacher.");
            return NextResponse.json({ error: "User not found or not a teacher" }, { status: 404 });
        }
        console.log("Validated teacher:", { name: teacher.name, email: teacher.email });

        // Validate the Class (search by name)
        const classObj = await Class.findOne({ name: classId });
        if (!classObj) {
            console.error(`Class not found for name: ${classId}`);
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }
        console.log("Validated class:", classObj);

        // Validate the Unit (fetch _id using name)
        const unit = await Unit.findOne({ name: unitId });
        if (!unit || unit.teacher.toString() !== teacherId) {
            console.error(`Unit not found or not assigned to this teacher: ${unitId}`);
            return NextResponse.json(
                { error: "Unit not found or not assigned to this teacher" },
                { status: 404 }
            );
        }
        const unitObjectId = unit._id; // Use ObjectId for subsequent queries
        console.log("Validated unit:", unit);

        // Validate Students in the Class
        const validStudentIds = (classObj.students as mongoose.Types.ObjectId[]).map((id) =>
            id.toString()
        );
        console.log("Valid student IDs for the class:", validStudentIds);

        for (const grade of grades as GradeInput[]) {
            if (!validStudentIds.includes(grade.studentId)) {
                console.error(`Student ${grade.studentId} is not part of the class.`);
                return NextResponse.json(
                    { error: `Student ${grade.studentId} is not part of the class` },
                    { status: 400 }
                );
            }
        }

        // Save or Update Grades (use unitObjectId)
        const savedGrades = [];
        for (const grade of grades) {
            const existingGrade = await Grade.findOne({
                student: grade.studentId,
                unit: unitObjectId,
                term,
            });

            if (existingGrade) {
                console.log("Updating existing grade:", existingGrade);
                existingGrade.grade = grade.grade;
                await existingGrade.save();
                savedGrades.push(existingGrade);
            } else {
                console.log("Creating new grade for student:", grade.studentId);
                const newGrade = await Grade.create({
                    student: grade.studentId,
                    unit: unitObjectId,
                    grade: grade.grade,
                    term,
                });
                savedGrades.push(newGrade);
            }
        }

        console.log("Saved grades:", savedGrades);

        return NextResponse.json({
            message: "Grades uploaded successfully!",
            grades: savedGrades,
        });
    } catch (error: unknown) {
        console.error("Error in POST /api/teacherDashboard:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred on the server." },
            { status: 500 }
        );
    }
}