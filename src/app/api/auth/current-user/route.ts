import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";

const ADMIN_COOKIE_NAME = "grocery-share-admin";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (user) {
      return NextResponse.json({ email: user.email }, { status: 200 });
    }

    // No normal session - check for admin session cookie (admin/admin login)
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (adminCookie?.value === "1") {
      return NextResponse.json({ email: "ADMIN" }, { status: 200 });
    }

    return NextResponse.json({ email: null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ email: null }, { status: 200 });
  }
}
