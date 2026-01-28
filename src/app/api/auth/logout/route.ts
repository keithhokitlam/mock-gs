import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

/**
 * Logout endpoint - clears the session
 * POST /api/auth/logout
 */
export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
