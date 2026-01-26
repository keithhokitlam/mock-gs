import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
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
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const { data: user, error: findError } = await supabaseServer
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .single();

    // Don't reveal if email exists (security best practice)
    if (findError || !user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    // Save reset token
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: expiresAt.toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update reset token:", updateError.message);
      return NextResponse.json(
        { 
          error: "Failed to generate reset token",
          details: process.env.NODE_ENV === "development" ? updateError.message : undefined
        },
        { status: 500 }
      );
    }

    // Send reset email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL || "GroceryShare <onboarding@resend.dev>",
        to: email,
        subject: "Reset your GroceryShare password",
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <p><a href="${resetLink}" style="background-color: #2B6B4A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
