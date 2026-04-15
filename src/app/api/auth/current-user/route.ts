import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";

const ADMIN_COOKIE_NAME = "grocery-share-admin";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (user) {
      /** Latest subscription row — YYYY-MM-DD or null (indefinite). */
      let subscriptionEndDate: string | null = null;
      const { data: subs, error: subErr } = await supabaseServer
        .from("subscriptions")
        .select("subscription_end_date")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!subErr && subs?.[0]) {
        const end = subs[0].subscription_end_date;
        subscriptionEndDate =
          typeof end === "string" && end.trim() !== "" ? end.trim() : null;
      }

      return NextResponse.json(
        {
          email: user.email,
          accountType:
            user.consumer_vs_commercial === "consumer" ? "consumer" : "commercial",
          subscriptionEndDate,
        },
        { status: 200 }
      );
    }

    // No normal session - check for admin session cookie (admin/admin login)
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (adminCookie?.value === "1") {
      return NextResponse.json({ email: "ADMIN", accountType: "admin" }, { status: 200 });
    }

    return NextResponse.json({ email: null, accountType: null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ email: null, accountType: null }, { status: 200 });
  }
}
