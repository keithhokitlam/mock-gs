import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const { data: user, error: insertError } = await supabaseServer
      .from("users")
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        email_verified: false,
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (insertError || !user) {
      console.error("Failed to create user:", insertError);
      return NextResponse.json(
        { 
          error: "Failed to create account",
          details: process.env.NODE_ENV === "development" ? insertError?.message : undefined
        },
        { status: 500 }
      );
    }

    // Send verification email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${appUrl}/verify-email?token=${verificationToken}`;

    try {
      await resend.emails.send({
        from: "GroceryShare <onboarding@resend.dev>", // Use your verified domain in production
        to: email,
        subject: "Verify your GroceryShare account",
        html: `
          <h1>Welcome to GroceryShare!</h1>
          <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
          <p><a href="${verifyLink}" style="background-color: #2B6B4A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verifyLink}</p>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (emailError) {
      // Log error but don't fail signup
      console.error("Failed to send verification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Account created. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
