import connectDB from "@/utils/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Class from "@/models/Class";
import Unit from "@/models/Unit";
import Timetable from "@/models/Timetable";
import Enrollment from "@/models/Enrollment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const { userId, courseId, classId, units, term } = await req.json();

        // Connect to the database
        await connectDB();

        // 1. Validate the User
        const user = await User.findById(userId);
        if (!user || user.role !== "Student") {
            return NextResponse.json({ error: "User not found or not a student" }, { status: 404 });
        }

        // 2. Validate the Course
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // 3. Validate the Class
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return NextResponse.json({ error: "Invalid class ID provided" }, { status: 400 });
        }
        const classObj = await Class.findById(classId);
        if (!classObj || classObj.course.toString() !== course._id.toString()) {
            return NextResponse.json({ error: "Class not found or does not belong to the course" }, { status: 404 });
        }

        // 4. Validate the Units
        if (!units || !Array.isArray(units) || units.length === 0) {
            return NextResponse.json({ error: "Invalid units data. Units must be a non-empty array." }, { status: 400 });
        }

        // 5. Validate the Units exist in the database
        const validUnits = await Unit.find({ _id: { $in: units }, course: courseId });
        if (validUnits.length !== units.length) {
            return NextResponse.json({ error: "One or more units are invalid or missing from the database" }, { status: 400 });
        }

        // Normalize term format
        const normalizedTerm = term?.trim().replace(/\s+/g, " ") || "Term 1";

        // 6. Check if the student is already enrolled in the same course, class, and term
        const existingEnrollment = await Enrollment.findOne({ student: userId, course: courseId, class: classId, term: normalizedTerm });

        if (existingEnrollment) {
            return NextResponse.json({ error: "You are already enrolled in this course and class for the selected term." }, { status: 400 });
        }

        // 7. Assign Course and Class to Student
        user.class = classId;
        await user.save();

        // 8. Add Student to the Class
        if (!classObj.students.includes(userId)) {
            classObj.students.push(userId);
            await classObj.save();
        }

        // 9. Fetch Timetables for the enrolled class and units
        const timetables = await Timetable.find({
            class: classId,
            unit: { $in: units },
            term: normalizedTerm,
        });

        if (!timetables || timetables.length === 0) {
            return NextResponse.json({
                error: "No matching timetables found for the specified class and units.",
                timetables: [],
            });
        }

        // 10.  Create Enrollment if no duplicate found
        const newEnrollment = await Enrollment.create({
            student: userId,
            course: courseId,
            class: classId,
            units,
            timetables: timetables.map((tt) => tt._id),
            term: normalizedTerm,
        });

        return NextResponse.json({
            message: "Enrollment successful!",
            enrollment: newEnrollment,
            timetables,
            redirect: "/timetable",
        });
    } catch (error) {
        console.error("Enrollment Error:", error);
        return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
    }
}
