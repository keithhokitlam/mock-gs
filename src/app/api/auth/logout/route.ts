import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/auth";

const ADMIN_COOKIE_NAME = "grocery-share-admin";

/**
 * Logout endpoint - clears the session and admin session
 * POST /api/auth/logout
 */
export async function POST() {
  await deleteSession();
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
