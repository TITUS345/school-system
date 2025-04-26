import User from "@/models/User";
import connectDB from "@/utils/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Ensure DB connection
    await connectDB();

    const { resetToken, newPassword } = await req.json();
    console.log("Received reset token and new password:", { resetToken, newPassword });

    // Validate input
    if (!resetToken || !newPassword) {
      return NextResponse.json({ error: "Missing reset token or new password." }, { status: 400 });
    }

    if (newPassword.length < 5) {
      return NextResponse.json({ error: "Password must be at least 5 characters long." }, { status: 400 });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10); // Use a higher salt round for better security
    await user.save();

    // Prevent token reuse
    await User.updateOne({ _id: user._id }, { $unset: { resetToken: "", resetTokenExpiry: "" } });

    return NextResponse.json({ success: true, message: "Password reset successful!" });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error resetting password:", error);
      return NextResponse.json({ error: "An error occurred while resetting the password.", details: error.message }, { status: 500 });
    }

  }
}