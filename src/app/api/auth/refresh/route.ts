import jwt from "jsonwebtoken";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { refreshToken } = await req.json(); // Get the refresh token from the request body

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string };

    // Find the user associated with the token
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    // Generate new access and refresh tokens
    const generateTokens = (userId: string, role: string) => {
      const accessToken = jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
        expiresIn: "15m", // Short-lived access token
      });

      const newRefreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: "7d", // Long-lived refresh token
      });

      return { accessToken, refreshToken: newRefreshToken };
    };

    const tokens = generateTokens(user._id, user.role);

    // Update the user's refresh token in the database
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Send the new tokens to the client
    return NextResponse.json(tokens);
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}