import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const { data: users, error: findError } = await supabaseServer
      .from("users")
      .select("id, reset_token_expires, reset_token")
      .eq("reset_token", token);

    if (findError) {
      console.error("Reset password query error:", findError.message);
      return NextResponse.json(
        { 
          error: "Database error",
          details: process.env.NODE_ENV === "development" ? findError.message : undefined
        },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const user = users[0];

    // Check if token expired
    if (user.reset_token_expires) {
      const expiresAt = new Date(user.reset_token_expires);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: "Reset token has expired. Please request a new one." },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update password:", updateError.message);
      return NextResponse.json(
        { 
          error: "Failed to reset password",
          details: process.env.NODE_ENV === "development" ? updateError.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error?.message || error);
    return NextResponse.json(
      { 
        error: "An error occurred. Please try again.",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
