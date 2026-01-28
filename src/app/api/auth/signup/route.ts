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

    // Automatically create a subscription for the new user (1 year from today)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
    
    const { error: subscriptionError } = await supabaseServer
      .from("subscriptions")
      .insert({
        user_id: user.id,
        email: user.email,
        subscription_start_date: startDate.toISOString().split("T")[0],
        subscription_end_date: endDate.toISOString().split("T")[0],
        status: "active",
      });

    if (subscriptionError) {
      console.error("Failed to create subscription for new user:", subscriptionError);
      // Don't fail the signup if subscription creation fails - user account is still created
      // They can create subscription manually later
    } else {
      console.log(`✅ Created subscription for user ${user.email}`);
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
    // Use test domain if custom domain not verified, otherwise use custom
    let fromEmail = process.env.RESEND_FROM_EMAIL || "GroceryShare <onboarding@resend.dev>";
    
    // If custom domain is set but might not be verified, try it first, then fallback
    const useCustomDomain = fromEmail.includes("@grocery-share.com");
    
    console.log("=== EMAIL SEND ATTEMPT ===");
    console.log("Sending verification email to:", email);
    console.log("From email:", fromEmail);
    console.log("Using custom domain:", useCustomDomain);
    console.log("Verification link:", verifyLink);
    console.log("Resend API Key present:", !!resendApiKey);
    
    let emailResult;
    
    try {
      // Try sending with configured email (might be custom domain)
      emailResult = await resend.emails.send({
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
        // Check if it's a domain verification error - fallback to test domain
        const isDomainError = emailResult.error.statusCode === 403 && 
                             emailResult.error.message?.includes("domain is not verified");
        
        if (isDomainError && useCustomDomain) {
          console.warn("Custom domain not verified, falling back to test domain");
          fromEmail = "GroceryShare <onboarding@resend.dev>";
          
          // Retry with test domain
          emailResult = await resend.emails.send({
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
          
          console.log("=== RETRY WITH TEST DOMAIN ===");
          console.log("Email result:", JSON.stringify(emailResult, null, 2));
          
          // Check retry result
          if (emailResult?.error) {
            console.error("Retry with test domain also failed:", emailResult.error);
            throw new Error(emailResult.error.message || "Resend API returned an error");
          }
        } else {
          // Not a domain error or not using custom domain, throw error
          throw new Error(emailResult.error.message || "Resend API returned an error");
        }
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
      console.error("Error message:", emailError?.message);
      console.error("Error type:", typeof emailError);
      console.error("Full error:", JSON.stringify(emailError, null, 2));
      
      // Check if error message contains domain verification error
      const errorMessage = emailError?.message || "";
      const isDomainErrorInException = errorMessage.includes("domain is not verified");
      
      // If it's a domain error and we haven't tried test domain yet, retry
      if (isDomainErrorInException && useCustomDomain) {
        console.warn("Caught domain verification exception, retrying with test domain");
        try {
          fromEmail = "GroceryShare <onboarding@resend.dev>";
          const retryResult = await resend.emails.send({
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
          
          console.log("=== RETRY WITH TEST DOMAIN (from exception) ===");
          console.log("Retry result:", JSON.stringify(retryResult, null, 2));
          
          if (retryResult?.error) {
            throw new Error(retryResult.error.message || "Resend API returned an error");
          }
          
          if (!retryResult?.data?.id) {
            throw new Error("Email service returned unexpected response - no email ID");
          }
          
          console.log("✅ Email sent successfully with ID (retry):", retryResult.data.id);
          // Success! Continue to return success response
        } catch (retryError: any) {
          console.error("Retry with test domain also failed:", retryError);
          // Return error if retry also fails
          return NextResponse.json(
            { 
              error: "Account created but failed to send verification email. Please contact support.",
              details: retryError?.message || "Email service error",
              verificationToken: verificationToken
            },
            { status: 500 }
          );
        }
      } else {
        // Not a domain error or already tried, return error
        return NextResponse.json(
          { 
            error: "Account created but failed to send verification email. Please contact support.",
            details: emailError?.message || "Email service error",
            verificationToken: verificationToken
          },
          { status: 500 }
        );
      }
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
