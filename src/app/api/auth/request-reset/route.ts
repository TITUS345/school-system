

import connectDB from "@/utils/db";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();
    console.log("Received email:", email);

    if (!email) {
      return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
    }

    const user = await User.findOne({ email }).exec();
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(10).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600 * 1000; // 1-hour expiry
    await user.save();

    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json({ success: true, message: "Password reset token sent!" });
  } catch (error: unknown) {
    if (error instanceof Error) {

      console.error("Error handling password reset request:", error);
      return NextResponse.json({ error: "Server error", details: error.message || "Unknown error" }, { status: 500 });
    }
  }
}

// export async function GET(req: Request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");

//     if (!email) {
//       return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
//     }

//     const user = await User.findOne({ email }).exec();
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "User found", user });

//   } catch (error: any) {
//     console.error("Error fetching user:", error);
//     return NextResponse.json({ error: "Server error", details: error.message || "Unknown error" }, { status: 500 });
//   }
// }
