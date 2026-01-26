import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const { data: user, error: findError } = await supabaseServer
      .from("users")
      .select("id, email, password_hash, email_verified")
      .eq("email", email.toLowerCase())
      .single();

    if (findError || !user) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.email_verified) {
      return NextResponse.json(
        {
          error: "Please verify your email before logging in. Check your inbox for the verification link.",
        },
        { status: 403 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
