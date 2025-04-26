import connectDB from "@/utils/db";
import Unit from "@/models/Unit";
import Course from "@/models/Course";
// import User from "@/models/User"; // Import the User model
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, courseId, teacherId, semester } = await req.json();
        console.log("Received data:", { name, courseId, teacherId, semester });

        await connectDB();

        // Validate the course
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Create the unit
        const newUnit = await Unit.create({
            name,
            course: courseId, //  Ensure course ID is assigned
            teacher: teacherId,
            semester,
        });

        // Update the course’s units array
        if (!course.units.includes(newUnit._id)) {
            course.units.push(newUnit._id);
            await course.save();
        }

        return NextResponse.json({ message: "Unit created successfully!", unit: newUnit });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: "Server error", details: error.message || "Unknown error" }, { status: 500 });
        }
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        console.log("Received courseId:", courseId);

        if (!courseId) {
            return NextResponse.json({ error: "Missing courseId parameter" }, { status: 400 });
        }

        // Fetch units using courseId 
        const units = await Unit.find({ course: courseId }).select("_id name teacher semester");
        console.log("Fetched units:", units);

        return NextResponse.json(units.length > 0 ? units : []); // Always return an array
    } catch (error: unknown) {
        if (error instanceof Error) {

            return NextResponse.json({ error: "Server error", details: error.message || "Unknown error" }, { status: 500 });
        }
    }
}
