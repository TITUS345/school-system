import connectDB from "@/utils/db";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, duration } = await req.json();

    await connectDB();

    // Create the new course
    const newCourse = await Course.create({
        name,
        duration,
    });

    return NextResponse.json({ message: "Course created successfully!", course: newCourse });
}


//GET all courses
export async function GET() {
    try {
        await connectDB();
        const courses = await Course.find(); // Fetch all courses
        return NextResponse.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}