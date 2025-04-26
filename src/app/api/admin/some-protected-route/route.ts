import { authenticate } from "@/utils/authMiddleware";

export async function GET(req: Request) {
  // Restrict access to Admins only
  const authError = authenticate(req, ["Admin"]);
  if (authError) return authError;

  // Admin-only logic
  return new Response(JSON.stringify({ data: "Admin-only data" }), { status: 200 });
}
