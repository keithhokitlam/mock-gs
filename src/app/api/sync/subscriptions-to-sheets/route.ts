import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { replaceSheetData } from "@/lib/google-sheets";

/**
 * Sync subscriptions from Supabase to Google Sheets
 * GET or POST /api/sync/subscriptions-to-sheets
 */
export async function GET(request: NextRequest) {
  return syncSubscriptions();
}

export async function POST(request: NextRequest) {
  return syncSubscriptions();
}

async function syncSubscriptions() {
  try {
    console.log("🔄 Starting subscription sync to Google Sheets...");

    // Fetch all subscriptions from Supabase
    const { data: subscriptions, error } = await supabaseServer
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions from database", details: error.message },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No subscriptions found to sync");
      return NextResponse.json({
        success: true,
        message: "No subscriptions to sync",
        count: 0,
      });
    }

    console.log(`Found ${subscriptions.length} subscriptions to sync`);

    // Format data for Google Sheets
    const rows = subscriptions.map((sub) => {
      // Calculate days remaining
      const endDate = new Date(sub.subscription_end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemainingStr = daysRemaining >= 0 ? daysRemaining.toString() : "Expired";

      return [
        sub.email || "", // User Email
        sub.subscription_start_date || "", // Subscription Start Date
        sub.subscription_end_date || "", // Subscription End Date
        sub.renewal_date || "", // Renewal Date
        sub.status || "", // Status
        sub.plan_type || "", // Plan Type
        daysRemainingStr, // Days Remaining (calculated)
        sub.created_at ? new Date(sub.created_at).toLocaleString() : "", // Created At
        sub.updated_at ? new Date(sub.updated_at).toLocaleString() : "", // Updated At
      ];
    });

    // Write to Google Sheets
    await replaceSheetData(rows);

    console.log(`✅ Successfully synced ${subscriptions.length} subscriptions to Google Sheets`);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${subscriptions.length} subscriptions to Google Sheets`,
      count: subscriptions.length,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        error: "Failed to sync subscriptions",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
