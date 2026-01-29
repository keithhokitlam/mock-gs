import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "grocery-share-admin";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * POST - Set admin session cookie (used when admin/admin logs in).
 * GET is not used; current-user checks this cookie.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });
  return NextResponse.json({ success: true });
}
