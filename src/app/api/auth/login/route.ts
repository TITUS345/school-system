import connectDB from '@/utils/db';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment'; // Import Enrollment model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, password } = await req.json();

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ error: 'Invalid email or password!' }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return NextResponse.json({ error: 'Invalid email or password!' }, { status: 401 });
    }

    // Check enrollment status
    const enrollment = await Enrollment.findOne({ student: user._id });
    const enrolled = !!enrollment; // Convert to true/false based on whether enrollment exists

    // Generate Access and Refresh Tokens
    const generateTokens = (userId: string, role: string) => {
        const accessToken = jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    };

    const tokens = generateTokens(user._id, user.role);

    // Save Refresh Token in Database
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Return tokens, user info, and enrollment status to client
    return NextResponse.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        enrolled, // Include enrollment status
        message: 'Login successful!',
    });
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