import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

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

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { 
          error: "Email service not configured. Please contact support.",
          details: "RESEND_API_KEY environment variable is missing"
        },
        { status: 500 }
      );
    }

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL || "GroceryShare <onboarding@resend.dev>";
    
    console.log("=== EMAIL SEND ATTEMPT ===");
    console.log("Sending verification email to:", email);
    console.log("From email:", fromEmail);
    console.log("Verification link:", verifyLink);
    console.log("Resend API Key present:", !!resendApiKey);
    
    try {
      const emailResult = await resend.emails.send({
        from: fromEmail,
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
      
      console.log("=== EMAIL SEND RESULT ===");
      console.log("Email result:", JSON.stringify(emailResult, null, 2));
      console.log("Email result data:", emailResult?.data);
      console.log("Email result error:", emailResult?.error);
      
      // Check for errors in the response
      if (emailResult?.error) {
        console.error("Resend returned an error:", JSON.stringify(emailResult.error, null, 2));
        throw new Error(emailResult.error.message || "Resend API returned an error");
      }
      
      if (!emailResult?.data?.id) {
        console.error("Email send returned unexpected result - no email ID:", emailResult);
        throw new Error("Email service returned unexpected response - no email ID");
      }
      
      console.log("✅ Email sent successfully with ID:", emailResult.data.id);
    } catch (emailError: any) {
      // Log detailed error
      console.error("=== EMAIL SEND FAILED ===");
      console.error("Failed to send verification email:", emailError);
      console.error("Error type:", typeof emailError);
      console.error("Error constructor:", emailError?.constructor?.name);
      console.error("Email error message:", emailError?.message);
      console.error("Email error name:", emailError?.name);
      console.error("Email error stack:", emailError?.stack);
      console.error("Full error object:", JSON.stringify(emailError, Object.getOwnPropertyNames(emailError), 2));
      
      // Check if it's a Resend API error
      if (emailError?.response) {
        console.error("Resend API error response:", JSON.stringify(emailError.response, null, 2));
      }
      
      // Check for Resend-specific error properties
      if (emailError?.statusCode) {
        console.error("Resend error status code:", emailError.statusCode);
      }
      if (emailError?.status) {
        console.error("Resend error status:", emailError.status);
      }
      
      // Return error so user knows email wasn't sent
      return NextResponse.json(
        { 
          error: "Account created but failed to send verification email. Please contact support.",
          details: emailError?.message || emailError?.name || "Email service error",
          verificationToken: verificationToken // Include token so user can verify manually if needed
        },
        { status: 500 }
      );
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
