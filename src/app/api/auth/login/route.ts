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
    
    if (!supabaseUrl || !hasServiceKey) {
      return NextResponse.json(
        { 
          error: "Database error. Please try again.",
          details: "Supabase environment variables are not configured",
          code: "MISSING_ENV_VARS"
        },
        { status: 500 }
      );
    }

    // Find user
    let users, findError;
    try {
      const result = await supabaseServer
        .from("users")
        .select("id, email, password_hash, email_verified")
        .eq("email", email.toLowerCase())
        .limit(1);
      
      users = result.data;
      findError = result.error;
    } catch (supabaseError: any) {
      console.error("Supabase client error:", supabaseError);
      return NextResponse.json(
        { 
          error: "Database error. Please try again.",
          details: supabaseError?.message || "Failed to connect to database",
          code: "SUPABASE_CLIENT_ERROR"
        },
        { status: 500 }
      );
    }

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
          details: findError.message || findError.details || "Unknown database error",
          code: findError.code || "UNKNOWN"
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
  } catch (error: any) {
    console.error("Login error:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "An error occurred. Please try again.",
        details: error?.message || "Unknown error",
        code: "GENERAL_ERROR"
      },
      { status: 500 }
    );
  }
}
