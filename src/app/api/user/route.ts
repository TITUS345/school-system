import { NextResponse } from "next/server";
import connectDB from '@/utils/db';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import mongoose from "mongoose"; // Ensure mongoose is imported
import User from "@/models/User"; // Import your user model

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, // JWT payload
            process.env.JWT_SECRET || "default-secret-key",
            { expiresIn: "2h" }
        );
        console.log("Generated Token:", token); // Debug log for generated token

        return NextResponse.json({ token, message: "Login successful" }, { status: 200 });
    } catch (error) {
        console.error("Login Error:", error); // Debug
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get("Authorization");
        console.log("Auth Header Received:", authHeader); // Debug log

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("Authorization header is missing or invalid"); // Debug log
            return NextResponse.json({ error: "Unauthorized - Missing or invalid token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token); // Debug log

        const secretKey = process.env.JWT_SECRET || "default-secret-key";
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey) as { id: string };
            console.log("Decoded Token Payload:", decoded); // Debug log
        } catch (err) {
            console.error("Token verification failed:", err); // Debug log
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            console.error("User not found in database"); // Debug log
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("Fetched User:", user); // Debug log
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error handling request:", error); // Debug log
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}