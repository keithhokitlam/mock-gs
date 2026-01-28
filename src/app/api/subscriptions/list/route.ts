import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";

/**
 * List subscriptions
 * GET /api/subscriptions/list?user_id=... (optional, defaults to current user)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    // Use provided user_id or current user's id
    const targetUserId = userId || currentUser.id;

    // If requesting another user's subscriptions, verify permission (for now, only allow own)
    if (userId && userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Unauthorized to view other users' subscriptions" },
        { status: 403 }
      );
    }

    // Fetch subscriptions
    const { data: subscriptions, error } = await supabaseServer
      .from("subscriptions")
      .select("*")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions || [],
      count: subscriptions?.length || 0,
    });
  } catch (error: any) {
    console.error("List subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to list subscriptions", details: error.message },
      { status: 500 }
    );
  }
}
