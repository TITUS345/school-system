import connectDB from "@/utils/db";
import Timetable from "@/models/Timetable";
import Course from "@/models/Course";
import Class from "@/models/Class";
import Unit from "@/models/Unit";
import User from "@/models/User"; // To validate Teacher role
import { NextResponse } from "next/server";

interface TimetableQuery {
    class?: string;
    teacher?: string;
    term?: string;
}

export async function POST(req: Request) {
    const { courseId, classId, unitId, teacherId, date, time, term } = await req.json();

    await connectDB();

    // Validate the Course
    const course = await Course.findById(courseId);
    if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Validate the Class
    const classObj = await Class.findById(classId);
    if (!classObj || classObj.course.toString() !== courseId) {
        return NextResponse.json({ error: "Class not found or does not belong to the course" }, { status: 404 });
    }

    // Validate the Unit
    const unit = await Unit.findById(unitId);
    if (!unit || unit.course.toString() !== courseId) {
        return NextResponse.json({ error: "Unit not found or does not belong to the course" }, { status: 404 });
    }

    // Validate the Teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "Teacher") {
        return NextResponse.json({ error: "Invalid teacher ID or user is not a teacher" }, { status: 400 });
    }

    // Conflict resolution: Check for overlapping sessions
    const conflictingClassTimetable = await Timetable.findOne({
        class: classId,
        date: new Date(date),
        time: time,
    });

    const conflictingTeacherTimetable = await Timetable.findOne({
        teacher: teacherId,
        date: new Date(date),
        time: time,
    });

    if (conflictingClassTimetable) {
        return NextResponse.json({ error: "Conflict detected: This class already has a session scheduled at the same time." }, { status: 400 });
    }

    if (conflictingTeacherTimetable) {
        return NextResponse.json({ error: "Conflict detected: This teacher is already assigned to another session at the same time." }, { status: 400 });
    }

    // Create Timetable Entry
    const newTimetable = await Timetable.create({
        course: courseId,
        class: classId,
        unit: unitId,
        teacher: teacherId,
        date: new Date(date),
        time: time,
        term: term,
    });

    return NextResponse.json({ message: "Timetable entry created successfully!", timetable: newTimetable });
}

// To get all timetable entries for a specific course, class, and unit
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const teacherId = searchParams.get("teacherId");
    const term = searchParams.get("term");

    await connectDB();

    const query: TimetableQuery = {};
    if (classId) query.class = classId;
    if (teacherId) query.teacher = teacherId;
    if (term) query.term = term;

    try {
        const timetables = await Timetable.find(query)
            .populate("course", "name duration") // Only include `name` and `duration`
            .populate("class", "name")
            .populate("unit", "name semester")
            .populate("teacher", "name email role"); // Exclude `password` and `refreshToken`

        return NextResponse.json({ timetables });
    } catch (err) {
        console.error("Error fetching timetables:", err);
        return NextResponse.json({ error: "Failed to fetch timetables." }, { status: 500 });
    }
}

// To update an existing timetable entry
export async function PUT(req: Request) {
    const { timetableId, updates } = await req.json();

    await connectDB();

    // Validate the timetable ID
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
        return NextResponse.json({ error: "Timetable not found" }, { status: 404 });
    }

    // Update the timetable entry
    Object.assign(timetable, updates);
    await timetable.save();

    return NextResponse.json({ message: "Timetable updated successfully!", timetable });
}

// To delete an existing timetable entry
export async function DELETE(req: Request) {
    const { timetableId } = await req.json();

    await connectDB();

    // Validate and delete the timetable
    const deletedTimetable = await Timetable.findByIdAndDelete(timetableId);
    if (!deletedTimetable) {
        return NextResponse.json({ error: "Timetable not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Timetable entry deleted successfully!", timetable: deletedTimetable });
}