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

    // Verify Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log("Supabase URL configured:", !!supabaseUrl);
    console.log("Service key configured:", hasServiceKey);

    // Find user
    try {
      const { data: users, error: findError } = await supabaseServer
        .from("users")
        .select("id, email, password_hash, email_verified")
        .eq("email", email.toLowerCase())
        .limit(1);

      if (findError) {
        console.error("Supabase query error:", JSON.stringify(findError, null, 2));
        console.error("Error code:", findError.code);
        console.error("Error message:", findError.message);
        console.error("Error details:", findError.details);
        console.error("Error hint:", findError.hint);
        
        // Return more detailed error in production for debugging
        return NextResponse.json(
          { 
            error: "Database error. Please try again.",
            details: findError.message || "Unknown database error",
            code: findError.code
          },
          { status: 500 }
        );
      }

      const user = users && users.length > 0 ? users[0] : null;

      if (!user) {
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
    } catch (dbError: any) {
      console.error("Database operation error:", dbError);
      throw dbError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error("Login error:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "An error occurred. Please try again.",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
