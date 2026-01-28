import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";

export default async function SubscriptionsPage() {
  // Check authentication
  const user = await getCurrentUser();
  
  // Check if user is admin first
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@grocery-share.com";
  
  let isAdmin = false;
  if (!user) {
    // No session = admin/admin login was used (bypasses auth, session cleared)
    isAdmin = true;
  } else {
    // There's a user session - check if it's an admin
    const userEmailLower = user.email?.toLowerCase() || "";
    const adminEmailLower = ADMIN_EMAIL.toLowerCase();
    isAdmin = userEmailLower === adminEmailLower || 
              userEmailLower === "admin" ||
              userEmailLower === "admin@grocery-share.com";
  }

  // If not admin, check normal authentication and subscription
  if (!isAdmin && user) {
    // Normal user login - check email verification
    if (!user.email_verified) {
      redirect("/");
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
      // Don't block access if we can't check subscription - log error but allow
    } else if (subscriptions && subscriptions.length > 0) {
      const subscription = subscriptions[0];
      
      // Check if subscription is inactive or cancelled
      if (subscription.status === "inactive" || subscription.status === "cancelled") {
        redirect("/?error=subscription_inactive");
      }

      // Also check if subscription has expired (even if status hasn't been updated yet)
      if (subscription.subscription_end_date) {
        const endDate = new Date(subscription.subscription_end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (endDate < today && subscription.status !== "cancelled") {
          // Subscription has expired - mark as inactive and redirect
          await supabaseServer
            .from("subscriptions")
            .update({ status: "inactive" })
            .eq("id", subscription.id);
          
          redirect("/?error=subscription_expired");
        }
      }
    } else {
      // No subscription found - redirect to login
      redirect("/?error=no_subscription");
    }
  } else if (!isAdmin && !user) {
    // Not admin and not logged in - redirect to login
    redirect("/");
  }

  // Fetch all subscriptions from Supabase with check-in counts
  let { data: subscriptions, error } = await supabaseServer
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscriptions:", error);
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 p-4">
        <p className="text-red-600">Error loading subscriptions: {error.message}</p>
      </div>
    );
  }

  // Get check-in counts for each user
  const userIds = (subscriptions || []).map(sub => sub.user_id).filter(Boolean);
  let checkInCounts: Map<string, number> = new Map();
  
  if (userIds.length > 0) {
    try {
      const { data: checkIns, error: checkInError } = await supabaseServer
        .from("check_ins")
        .select("user_id")
        .in("user_id", userIds);
      
      if (!checkInError && checkIns) {
        checkIns.forEach(checkIn => {
          const userId = checkIn.user_id;
          checkInCounts.set(userId, (checkInCounts.get(userId) || 0) + 1);
        });
      }
    } catch (err) {
      console.error("Error fetching check-in counts:", err);
    }
  }

  // Format subscription data for display
  const subscriptionRows = (subscriptions || []).map((sub) => {
    const endDate = new Date(sub.subscription_end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemainingStr = daysRemaining >= 0 ? daysRemaining.toString() : "Expired";

    const userId = sub.user_id || sub.id || "";
    const checkInCount = checkInCounts.get(userId) || 0;

    return {
      userId,
      email: sub.email || "",
      startDate: sub.subscription_start_date || "",
      endDate: sub.subscription_end_date || "",
      renewalDate: sub.renewal_date || "",
      status: sub.status || "active",
      planType: sub.plan_type || "",
      daysRemaining: daysRemainingStr,
      checkIns: checkInCount.toString(),
      createdAt: sub.created_at ? new Date(sub.created_at).toLocaleString() : "",
      updatedAt: sub.updated_at ? new Date(sub.updated_at).toLocaleString() : "",
    };
  });

  const headers = [
    "User ID",
    "Email",
    "Start Date",
    "End Date",
    "Renewal Date",
    "Status",
    "Plan Type",
    "Days Remaining",
    "Check-Ins",
    "Created At",
    "Updated At",
  ];

  return (
    <div className="min-h-screen w-max min-w-full bg-zinc-50 text-zinc-900">
      <nav className="w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
        <div className="flex w-full items-center gap-4 px-2 py-0">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/logos/GS_logo_highres_2x.png"
              alt="GroceryShare"
              width={260}
              height={104}
              className="h-16 w-auto translate-y-[2px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-12 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            <span className="font-beckman">About</span>
            <Link href="/support" className="font-beckman hover:opacity-80">
              Support
            </Link>
            <Link href="/contact" className="font-beckman hover:opacity-80">
              Contact
            </Link>
            <span className="font-beckman">FAQ</span>
          </div>
        </div>
      </nav>

      <div className="w-full px-4 pt-4 pb-10 overflow-x-visible">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/mastertable"
            className="inline-block px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 text-sm font-semibold"
          >
            ← Back to Master Table
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

        {/* Table */}
        <div className="relative inline-block min-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-max text-left text-sm">
            <thead className="rounded-t-2xl bg-black text-xs uppercase tracking-wide text-white font-beckman">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-3 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {subscriptionRows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-8 text-center text-zinc-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptionRows.map((row, index) => (
                  <tr key={index} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 whitespace-nowrap">{row.userId}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.startDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.endDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.renewalDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.status === "active"
                            ? "bg-green-100 text-green-800"
                            : row.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.planType}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.daysRemaining}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.checkIns}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.createdAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.updatedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-zinc-600">
          Total subscriptions: {subscriptionRows.length}
        </div>
      </div>
    </div>
  );
}
