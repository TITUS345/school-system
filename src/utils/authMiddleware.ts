import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, allowedRoles: string[]) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };

    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden: Insufficient role permissions" }, { status: 403 });
    }

    return null; // Authenticated successfully
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}