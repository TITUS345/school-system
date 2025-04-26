import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import Class from "@/models/Class"; // Class model with students reference
import User from "@/models/User";  // User model where role is defined

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("class");
    console.log("Class name from query:", className);

    // Ensure the class parameter is provided
    if (!className) {
        return NextResponse.json({ error: "Class parameter is required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    try {
        // Find the class by name and populate its students
        const classObj = await Class.findOne({ name: className }).populate("students");

        // If the class is not found, return an error
        if (!classObj) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // Fetch students from the User model who have the 'Student' role
        const students = await User.find({
            _id: { $in: classObj.students }, // Filter users who are part of the class
            role: "Student", // Ensure we're only fetching students
        }).select("name email"); // You can adjust the fields as necessary

        // Return the list of students
        return NextResponse.json({
            message: "Students fetched successfully",
            students: students.map((student) => ({
                id: student._id.toString(),
                name: student.name,
                email: student.email, // Include more details as needed
            })),
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({ error: "An error occurred while fetching students" }, { status: 500 });
    }
}
