import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Clean up token (remove whitespace, handle URL encoding)
    try {
      token = decodeURIComponent(token).trim();
    } catch (e) {
      // Token might not be URL encoded, that's fine
      token = token.trim();
    }

    // Find user with this token
    const { data: users, error: queryError } = await supabaseServer
      .from("users")
      .select("id, email_verified, verification_token, email")
      .eq("verification_token", token);

    if (queryError) {
      console.error("Verification query error:", queryError.message);
      return NextResponse.json(
        { 
          error: "Database error. Please try again.",
          details: process.env.NODE_ENV === "development" ? queryError.message : undefined
        },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { 
          error: "Invalid or expired verification token. Please try signing up again."
        },
        { status: 400 }
      );
    }

    const user = users[0];

    if (user.email_verified) {
      return NextResponse.json({
        success: true,
        message: "Email already verified",
      });
    }

    // Update user to verified
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        email_verified: true,
        verification_token: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Verification update error:", updateError.message);
      return NextResponse.json(
        { 
          error: "Failed to verify email",
          details: process.env.NODE_ENV === "development" ? updateError.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Verification error:", error?.message || error);
    return NextResponse.json(
      { 
        error: "An error occurred. Please try again.",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
