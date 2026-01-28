import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";

/**
 * Create a new subscription
 * POST /api/subscriptions/create
 * Body: { user_id?, email, subscription_start_date?, plan_type? }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { user_id, email, subscription_start_date, plan_type } = body;

    // Use current user's ID if not provided
    const userId = user_id || currentUser.id;
    const userEmail = email || currentUser.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Calculate dates
    const startDate = subscription_start_date 
      ? new Date(subscription_start_date)
      : new Date();
    
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year

    // Format dates as YYYY-MM-DD for database
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    // Create subscription
    const { data: subscription, error } = await supabaseServer
      .from("subscriptions")
      .insert({
        user_id: userId,
        email: userEmail,
        subscription_start_date: startDateStr,
        subscription_end_date: endDateStr,
        status: "active",
        plan_type: plan_type || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating subscription:", error);
      return NextResponse.json(
        { error: "Failed to create subscription", details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Created subscription for ${userEmail}`);

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error: any) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription", details: error.message },
      { status: 500 }
    );
  }
}
