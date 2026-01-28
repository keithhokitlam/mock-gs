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

      // Check if user has an active subscription
      const { data: subscriptions, error: subscriptionError } = await supabaseServer
        .from("subscriptions")
        .select("id, status, subscription_end_date")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (subscriptionError) {
        console.error("Error checking subscription:", subscriptionError);
        // Don't block login if we can't check subscription - log error but allow
      } else if (subscriptions && subscriptions.length > 0) {
        const subscription = subscriptions[0];
        
        // Check if subscription is inactive or cancelled
        if (subscription.status === "inactive" || subscription.status === "cancelled") {
          return NextResponse.json(
            {
              error: "Your account either:\n1) does not exist with the email provided and you must create a new account or\n2) your account has expired and you must sign up again to resume services",
            },
            { status: 403 }
          );
        }

        // Also check if subscription has expired (even if status hasn't been updated yet)
        if (subscription.subscription_end_date) {
          const endDate = new Date(subscription.subscription_end_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          
          if (endDate < today && subscription.status !== "cancelled") {
            // Subscription has expired - mark as inactive and deny login
            await supabaseServer
              .from("subscriptions")
              .update({ status: "inactive" })
              .eq("id", subscription.id);
            
            return NextResponse.json(
              {
                error: "Your account either:\n1) does not exist with the email provided and you must create a new account or\n2) your account has expired and you must sign up again to resume services",
              },
              { status: 403 }
            );
          }
        }
      } else {
        // No subscription found - deny login
        return NextResponse.json(
          {
            error: "Your account either:\n1) does not exist with the email provided and you must create a new account or\n2) your account has expired and you must sign up again to resume services",
          },
          { status: 403 }
        );
      }

      // Record check-in (login event)
      try {
        await supabaseServer
          .from("check_ins")
          .insert({
            user_id: user.id,
            email: user.email,
            checked_in_at: new Date().toISOString(),
          });
        console.log(`✅ Recorded check-in for user ${user.email}`);
      } catch (checkInError: any) {
        // Don't fail login if check-in recording fails - log error but continue
        console.error("Failed to record check-in:", checkInError);
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
