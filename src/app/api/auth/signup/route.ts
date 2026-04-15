import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { uploadSignupSignaturePng } from "@/lib/google-drive";
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

function parseConsumerVsCommercial(value: unknown): "consumer" | "commercial" {
  if (value === "consumer") return "consumer";
  if (value === "commercial") return "commercial";
  return "commercial";
}

function decodeSignaturePngBase64(
  raw: unknown
): { ok: true; buffer: Buffer } | { ok: false; message: string } {
  if (typeof raw !== "string" || raw.trim() === "") {
    return { ok: false, message: "A digital signature is required to sign up." };
  }
  const trimmed = raw.trim();
  const payload = trimmed.includes(",") ? trimmed.slice(trimmed.indexOf(",") + 1) : trimmed;
  let buffer: Buffer;
  try {
    buffer = Buffer.from(payload, "base64");
  } catch {
    return { ok: false, message: "Invalid signature data." };
  }
  if (buffer.length < 1200) {
    return { ok: false, message: "Please draw your signature in the signature box." };
  }
  return { ok: true, buffer };
}

/** PostgREST: column missing from schema cache (migration not applied yet). */
function isUnknownUserColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "PGRST204") return true;
  const m = error.message ?? "";
  return m.includes("schema cache") && m.includes("column");
}

/** Snapshot for subscriptions / denormalized profile (nullable text). */
function profileSnapshotForRelatedTables(
  firstName: unknown,
  lastName: unknown,
  company: unknown,
  userRow: Record<string, unknown> | null | undefined
): { first_name: string | null; last_name: string | null; company: string | null } {
  const pick = (fromBody: unknown, fromRow: unknown): string | null => {
    if (fromBody != null && String(fromBody).trim() !== "") return String(fromBody).trim();
    if (fromRow != null && String(fromRow).trim() !== "") return String(fromRow).trim();
    return null;
  };
  return {
    first_name: pick(firstName, userRow?.first_name),
    last_name: pick(lastName, userRow?.last_name),
    company: pick(company, userRow?.company),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, company } = body;
    const consumerVsCommercial = parseConsumerVsCommercial(body.consumer_vs_commercial);

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
    const { data: existingUser, error: existingLookupError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existingLookupError) {
      console.error("Signup: lookup user by email failed:", existingLookupError);
      return NextResponse.json(
        { error: "Database error. Please try again." },
        { status: 500 }
      );
    }

    let user;
    let isExistingUser = false;

    if (existingUser) {
      const { data: activeSubscriptions } = await supabaseServer
        .from("subscriptions")
        .select("id")
        .eq("user_id", existingUser.id)
        .eq("status", "active");

      if (activeSubscriptions && activeSubscriptions.length > 0) {
        return NextResponse.json(
          {
            error: "An account with this email already exists and has an active subscription. Please use the Forgot Password button on the Sign In page to access your account.",
          },
          { status: 409 }
        );
      }
    }

    const sigDecoded = decodeSignaturePngBase64(body.signaturePngBase64);
    if (!sigDecoded.ok) {
      return NextResponse.json({ error: sigDecoded.message }, { status: 400 });
    }

    try {
      await uploadSignupSignaturePng(sigDecoded.buffer, String(email).toLowerCase());
    } catch (driveErr: unknown) {
      console.error("Signup: Google Drive signature upload failed:", driveErr);
      const message = driveErr instanceof Error ? driveErr.message : String(driveErr);
      return NextResponse.json(
        {
          error:
            "We couldn't save your signature right now. Please try again in a moment, or contact support if this keeps happening.",
          details: process.env.NODE_ENV === "development" ? message : undefined,
        },
        { status: 503 }
      );
    }

    if (existingUser) {
      isExistingUser = true;
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Update password for existing user (and profile fields if columns exist)
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const userUpdate: Record<string, unknown> = {
        password_hash: passwordHash,
        email_verified: false, // Require re-verification for security
        verification_token: verificationToken,
      };
      if (firstName) userUpdate.first_name = firstName;
      if (lastName) userUpdate.last_name = lastName;
      if (company) userUpdate.company = company;
      userUpdate.consumer_vs_commercial = consumerVsCommercial;

      let { data: updatedUser, error: updateError } = await supabaseServer
        .from("users")
        .update(userUpdate)
        .eq("id", existingUser.id)
        .select()
        .single();

      if ((updateError || !updatedUser) && updateError && isUnknownUserColumnError(updateError)) {
        console.warn(
          "Signup: retrying user update without profile columns — run supabase/migrations/20260415120000_add_users_profile_columns.sql"
        );
        const minimalUpdate: Record<string, unknown> = {
          password_hash: passwordHash,
          email_verified: false,
          verification_token: verificationToken,
          consumer_vs_commercial: consumerVsCommercial,
        };
        ({ data: updatedUser, error: updateError } = await supabaseServer
          .from("users")
          .update(minimalUpdate)
          .eq("id", existingUser.id)
          .select()
          .single());
      }

      if (updateError || !updatedUser) {
        console.error("Failed to update existing user:", updateError);
        return NextResponse.json(
          { error: "Failed to update account. Please try again." },
          { status: 500 }
        );
      }

      user = updatedUser;
    } else {
      // New user - create account
      const passwordHash = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Create user (first_name, last_name, company require matching columns in users table)
      const userInsert: Record<string, unknown> = {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        email_verified: false,
        verification_token: verificationToken,
      };
      if (firstName) userInsert.first_name = firstName;
      if (lastName) userInsert.last_name = lastName;
      if (company) userInsert.company = company;
      userInsert.consumer_vs_commercial = consumerVsCommercial;

      let { data: newUser, error: insertError } = await supabaseServer
        .from("users")
        .insert(userInsert)
        .select()
        .single();

      if ((insertError || !newUser) && insertError && isUnknownUserColumnError(insertError)) {
        console.warn(
          "Signup: retrying user insert without profile columns — run supabase/migrations/20260415120000_add_users_profile_columns.sql"
        );
        const minimalInsert: Record<string, unknown> = {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          email_verified: false,
          verification_token: verificationToken,
          consumer_vs_commercial: consumerVsCommercial,
        };
        ({ data: newUser, error: insertError } = await supabaseServer
          .from("users")
          .insert(minimalInsert)
          .select()
          .single());
      }

      if (insertError || !newUser) {
        console.error("Failed to create user:", insertError);
        return NextResponse.json(
          {
            error: "Failed to create account",
            details: process.env.NODE_ENV === "development" ? insertError?.message : undefined,
          },
          { status: 500 }
        );
      }

      user = newUser;
    }

    // Get verification token (already set above for both cases)
    const verificationToken = user.verification_token!;

    // Automatically create a NEW subscription (1 year from today)
    // This allows tracking multiple subscriptions per user
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
    
    const profileSnap = profileSnapshotForRelatedTables(
      firstName,
      lastName,
      company,
      user as Record<string, unknown>
    );

    const { error: subscriptionError } = await supabaseServer
      .from("subscriptions")
      .insert({
        user_id: user.id,
        email: user.email,
        subscription_start_date: startDate.toISOString().split("T")[0],
        subscription_end_date: endDate.toISOString().split("T")[0],
        status: "active",
        first_name: profileSnap.first_name,
        last_name: profileSnap.last_name,
        company: profileSnap.company,
      });

    if (subscriptionError) {
      console.error("Failed to create subscription:", subscriptionError);
      // Don't fail the signup if subscription creation fails - user account is still created/updated
      // They can create subscription manually later
    } else {
      console.log(`✅ Created ${isExistingUser ? 'new' : 'initial'} subscription for user ${user.email}`);
    }

    // Send verification email (for both new and existing users)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${appUrl}/verify-email?token=${verificationToken}`;
    
    const emailSubject = isExistingUser 
      ? "Verify your Grocery-Share account - Subscription Renewed"
      : "Verify your Grocery-Share account";
    
    const emailMessage = isExistingUser
      ? `<h1>Welcome back to Grocery-Share!</h1>
         <p>Your subscription has been renewed. Please verify your email address by clicking the link below:</p>`
      : `<h1>Welcome to Grocery-Share!</h1>
         <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>`;

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
    let fromEmail = process.env.RESEND_FROM_EMAIL || "Grocery-Share <onboarding@resend.dev>";
    
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
        subject: emailSubject,
        html: `
          ${emailMessage}
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
          fromEmail = "Grocery-Share <onboarding@resend.dev>";
          
          // Retry with test domain
          emailResult = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: emailSubject,
            html: `
              ${emailMessage}
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
          fromEmail = "Grocery-Share <onboarding@resend.dev>";
          const retryResult = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: emailSubject,
            html: `
              ${emailMessage}
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
      message: isExistingUser 
        ? "Account updated and new subscription created. Please check your email to verify your account."
        : "Account created. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
