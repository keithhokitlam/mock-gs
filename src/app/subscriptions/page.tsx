import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";
import ActionsBar from "../mastertable/actions-bar";
import AdminTable, { type AdminColumn } from "../mastertable/table";
import NavBar from "../components/navbar";

type FilterValue = string | string[];

function parseFilterValue(value: string): FilterValue {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string");
    }
  } catch {
    // fall through to raw string
  }
  return value;
}

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
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
      // If subscription_end_date is null, subscription is indefinite/active forever
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
      // If subscription_end_date is null, subscription is active indefinitely - allow access
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

  // Get check-in counts and dates for each user
  const userIds = (subscriptions || []).map(sub => sub.user_id).filter(Boolean);
  let checkInCounts: Map<string, number> = new Map();
  
  if (userIds.length > 0) {
    try {
      const { data: checkIns, error: checkInError } = await supabaseServer
        .from("check_ins")
        .select("user_id, checked_in_at")
        .in("user_id", userIds)
        .order("checked_in_at", { ascending: true });
      
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
    // Define today once for use in both days remaining and monthly average calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If subscription_end_date is null, subscription is indefinite - show "Unlimited"
    let daysRemainingStr = "Unlimited";
    if (sub.subscription_end_date) {
      const endDate = new Date(sub.subscription_end_date);
      endDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      daysRemainingStr = daysRemaining >= 0 ? daysRemaining.toString() : "Expired";
    }

    const userId = sub.user_id || sub.id || "";
    const status = sub.status || "active";
    
    // If status is inactive, set Check-Ins and Monthly Avg Check-Ins to empty
    let checkInCount = 0;
    let monthlyAvgCheckIns = "";
    
    if (status !== "inactive" && status !== "cancelled") {
      checkInCount = checkInCounts.get(userId) || 0;

      // Calculate monthly average check-ins
      if (checkInCount > 0 && sub.subscription_start_date) {
        const startDate = new Date(sub.subscription_start_date);
        startDate.setHours(0, 0, 0, 0);
        const monthsSinceStart = Math.max(
          1, // At least 1 month to avoid division by zero
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44) // Average days per month
        );
        const avgPerMonth = checkInCount / monthsSinceStart;
        monthlyAvgCheckIns = avgPerMonth.toFixed(1); // Round to 1 decimal place
      } else {
        monthlyAvgCheckIns = "0";
      }
    }

    return [
      userId,
      sub.email || "",
      sub.subscription_start_date || "",
      sub.subscription_end_date || "",
      sub.renewal_date || "",
      status,
      sub.plan_type || "",
      daysRemainingStr,
      checkInCount > 0 ? checkInCount.toString() : "",
      monthlyAvgCheckIns,
      sub.created_at ? new Date(sub.created_at).toLocaleString() : "",
      sub.updated_at ? new Date(sub.updated_at).toLocaleString() : "",
    ];
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
    "Monthly Avg Check-Ins",
    "Created At",
    "Updated At",
  ];

  const resolvedSearchParams = await Promise.resolve(searchParams);
  const statusIndex = headers.findIndex(
    (header) => header.trim().toLowerCase() === "status"
  );

  // Include status column in display (don't filter it out)
  const columns: AdminColumn[] = headers
    .map((header, index) => ({ label: header || `Column ${index + 1}`, index }));

  const activeRows = subscriptionRows;

  const columnFilters: Record<number, FilterValue> = {};
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (!key.startsWith("f_")) return;
    const index = Number(key.replace("f_", ""));
    if (Number.isNaN(index)) return;
    if (index === statusIndex) return;
    if (Array.isArray(value)) return;
    if (typeof value !== "string") return;
    columnFilters[index] = parseFilterValue(value);
  });

  const filteredRows = activeRows.filter((row) =>
    Object.entries(columnFilters).every(([indexValue, filterValue]) => {
      const index = Number(indexValue);
      const cell = normalizeText((row[index] || "").toString());
      if (Array.isArray(filterValue)) {
        return filterValue
          .map((value) => normalizeText(value))
          .includes(cell);
      }
      return cell.includes(normalizeText(filterValue));
    })
  );

  const sortIndexRaw = resolvedSearchParams?.sort;
  const sortIndex = Number(
    Array.isArray(sortIndexRaw) ? sortIndexRaw[0] : sortIndexRaw
  );
  const sortDirectionRaw = resolvedSearchParams?.dir;
  const sortDirection = Array.isArray(sortDirectionRaw)
    ? sortDirectionRaw[0]
    : sortDirectionRaw;

  const sortableIndices = new Set(columns.map((column) => column.index));
  const rowsToSort = [...filteredRows];
  if (!Number.isNaN(sortIndex) && sortableIndices.has(sortIndex)) {
    rowsToSort.sort((left, right) => {
      const leftValue = (left[sortIndex] || "").toString().toLowerCase();
      const rightValue = (right[sortIndex] || "").toString().toLowerCase();
      if (leftValue < rightValue) return sortDirection === "desc" ? 1 : -1;
      if (leftValue > rightValue) return sortDirection === "desc" ? -1 : 1;
      return 0;
    });
  }

  // Include all columns including status
  const visibleRows = rowsToSort;
  const filterRows = activeRows;

  return (
    <div className="min-h-screen w-max min-w-full bg-zinc-50 text-zinc-900">
      <NavBar />

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

        <ActionsBar
          columns={columns.map((column) => column.label)}
          rows={visibleRows}
        />
        <AdminTable
          columns={columns}
          rows={visibleRows}
          filterRows={filterRows}
          activeFilters={columnFilters}
          sortIndex={Number.isNaN(sortIndex) ? null : sortIndex}
          sortDirection={sortDirection === "desc" ? "desc" : "asc"}
          headerClassName="rounded-t-2xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-xs uppercase tracking-wide text-white font-beckman"
        />

        {/* Summary */}
        <div className="mt-4 text-sm text-zinc-600">
          Total subscriptions: {subscriptionRows.length}
        </div>
      </div>
    </div>
  );
}
