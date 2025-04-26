import connectDB from "@/utils/db";
import Course from "@/models/Course";
import Class from "@/models/Class";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, courseId, term } = await req.json();
    console.log("Request body:", { name, courseId, term });
    if (!name || !courseId || !term) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    // Validate the course
    const course = await Course.findById(courseId);
    if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Create the class
    const newClass = await Class.create({
        name,
        course: courseId,
        term,
    });

    // Update the course’s classes array
    course.classes.push(newClass._id);
    await course.save();

    return NextResponse.json({ message: "Class created successfully!", class: newClass });
}



export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const purpose = searchParams.get("purpose"); // Optional query parameter to differentiate usage

        if (!courseId) {
            return NextResponse.json({ error: "Missing courseId parameter" }, { status: 400 });
        }

        await connectDB();

        // Handle different purposes
        if (purpose === "fetchClasses") {
            const classes = await Class.find({ course: courseId }).populate("course", "_id name");
            console.log("Fetched classes:", classes);
            if (!classes || classes.length === 0) {
                return NextResponse.json({ error: "No classes found for this course." }, { status: 404 });
            }
            return NextResponse.json({ message: "Classes fetched successfully!", classes });
        }

        // Default logic for other cases
        const classes = await Class.find({ course: courseId }).populate("course");
        console.log("Fetched classes:", classes);
        if (!classes || classes.length === 0) {
            return NextResponse.json({ error: "No classes found for this course." }, { status: 404 });
        }

        return NextResponse.json({ message: "Classes fetched successfully!", classes });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching classes:", error.message);
            return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
        }
        // console.error("Error fetching classes:", error);
        // return NextResponse.json({ error: "Server error", details: error.message || "Unknown error" }, { status: 500 });
    }
}