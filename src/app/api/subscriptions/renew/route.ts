import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";

/**
 * Renew an existing subscription (extends end date by 1 year)
 * POST /api/subscriptions/renew
 * Body: { subscription_id }
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
    const { subscription_id } = body;

    if (!subscription_id) {
      return NextResponse.json(
        { error: "subscription_id is required" },
        { status: 400 }
      );
    }

    // Get current subscription
    const { data: subscription, error: fetchError } = await supabaseServer
      .from("subscriptions")
      .select("*")
      .eq("id", subscription_id)
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Verify user owns this subscription (unless admin)
    if (subscription.user_id !== currentUser.id) {
      return NextResponse.json(
        { error: "Unauthorized to renew this subscription" },
        { status: 403 }
      );
    }

    // Calculate new end date (extend by 1 year from current end date)
    const currentEndDate = new Date(subscription.subscription_end_date);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    const newEndDateStr = newEndDate.toISOString().split("T")[0];
    const renewalDateStr = new Date().toISOString().split("T")[0];

    // Update subscription
    const { data: updatedSubscription, error: updateError } = await supabaseServer
      .from("subscriptions")
      .update({
        subscription_end_date: newEndDateStr,
        renewal_date: renewalDateStr,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error renewing subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to renew subscription", details: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Renewed subscription ${subscription_id} for ${subscription.email}`);

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    console.error("Renew subscription error:", error);
    return NextResponse.json(
      { error: "Failed to renew subscription", details: error.message },
      { status: 500 }
    );
  }
}
