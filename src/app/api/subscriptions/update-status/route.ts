import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";

/**
 * Update subscription status
 * POST /api/subscriptions/update-status
 * Body: { subscription_id, status }
 * Valid statuses: active, expired, cancelled, pending_renewal
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
    const { subscription_id, status } = body;

    if (!subscription_id) {
      return NextResponse.json(
        { error: "subscription_id is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["active", "expired", "cancelled", "pending_renewal"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
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
        { error: "Unauthorized to update this subscription" },
        { status: 403 }
      );
    }

    // Update subscription status
    const { data: updatedSubscription, error: updateError } = await supabaseServer
      .from("subscriptions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating subscription status:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription status", details: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Updated subscription ${subscription_id} status to ${status}`);

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    console.error("Update subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription status", details: error.message },
      { status: 500 }
    );
  }
}
