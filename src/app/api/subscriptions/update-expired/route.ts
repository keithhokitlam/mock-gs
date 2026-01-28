import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * Automatically update expired subscriptions to "inactive" status
 * GET or POST /api/subscriptions/update-expired
 * 
 * Checks all subscriptions where subscription_end_date is in the past
 * and status is not already "inactive" or "cancelled", then updates them.
 * 
 * Can be called manually or via cron job.
 */
export async function GET(request: NextRequest) {
  return updateExpiredSubscriptions();
}

export async function POST(request: NextRequest) {
  return updateExpiredSubscriptions();
}

async function updateExpiredSubscriptions() {
  try {
    console.log("🔄 Checking for expired subscriptions...");

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all subscriptions that are not already inactive or cancelled
    const { data: activeSubscriptions, error: fetchError } = await supabaseServer
      .from("subscriptions")
      .select("*")
      .in("status", ["active", "expired", "pending_renewal"])
      .order("subscription_end_date", { ascending: true });

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", details: fetchError.message },
        { status: 500 }
      );
    }

    if (!activeSubscriptions || activeSubscriptions.length === 0) {
      console.log("No active subscriptions to check");
      return NextResponse.json({
        success: true,
        message: "No active subscriptions to check",
        updated: 0,
      });
    }

    // Find expired subscriptions
    const expiredSubscriptions = activeSubscriptions.filter((sub) => {
      if (!sub.subscription_end_date) return false;
      const endDate = new Date(sub.subscription_end_date);
      endDate.setHours(0, 0, 0, 0);
      return endDate < today;
    });

    if (expiredSubscriptions.length === 0) {
      console.log("✅ No expired subscriptions found");
      return NextResponse.json({
        success: true,
        message: "No expired subscriptions found",
        checked: activeSubscriptions.length,
        updated: 0,
      });
    }

    console.log(`Found ${expiredSubscriptions.length} expired subscription(s) to update`);

    // Update each expired subscription
    let updatedCount = 0;
    const errors: Array<{ id: string; error: string }> = [];

    for (const sub of expiredSubscriptions) {
      try {
        const { error: updateError } = await supabaseServer
          .from("subscriptions")
          .update({ 
            status: "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("id", sub.id);

        if (updateError) {
          console.error(`Failed to update subscription ${sub.id}:`, updateError);
          errors.push({ id: sub.id, error: updateError.message });
        } else {
          updatedCount++;
          console.log(`✅ Marked subscription ${sub.id} (user: ${sub.email || sub.user_id}) as inactive (expired on ${sub.subscription_end_date})`);
        }
      } catch (error: any) {
        console.error(`Error updating subscription ${sub.id}:`, error);
        errors.push({ id: sub.id, error: error.message });
      }
    }

    const message = `Updated ${updatedCount} expired subscription(s) to inactive status`;
    console.log(`✅ ${message}`);

    return NextResponse.json({
      success: true,
      message,
      checked: activeSubscriptions.length,
      expired: expiredSubscriptions.length,
      updated: updatedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Update expired subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to update expired subscriptions", details: error.message },
      { status: 500 }
    );
  }
}
