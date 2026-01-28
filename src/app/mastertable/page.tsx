import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ActionsBar from "./actions-bar";
import AdminTable, { type AdminColumn } from "./table";
import { getCurrentUser } from "@/lib/auth";
import SyncButton from "../components/sync-button";
import { supabaseServer } from "@/lib/supabase-server";
import NavBar from "../components/navbar";

const SHEET_ID = "1kx7wArkJ5VDSwNuKDKizUMp1exnxfub-aI6xszqCZxs";
const SHEET_GID = "0";

function parseCsv(data: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < data.length; i += 1) {
    const char = data[i];
    const nextChar = data[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      row.push(cell);
      if (row.length > 1 || row[0] !== "") {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.length > 1 || row[0] !== "") {
    rows.push(row);
  }
  return rows;
}

async function getSheetRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load the Google Sheet.");
  }

  const csv = await response.text();
  return parseCsv(csv);
}

type SearchParams = Record<string, string | string[] | undefined>;
type FilterValue = string | string[];

type AdminPageProps = {
  searchParams?: Promise<SearchParams>;
};

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

export default async function AdminPage({ searchParams }: AdminPageProps) {
  // Check authentication
  const user = await getCurrentUser();
  
  // Admin/admin login bypasses normal auth (no session created)
  // So if no user exists, allow access (admin/admin was used)
  // Otherwise, check normal authentication
  if (user) {
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
  }
  // If no user, assume admin/admin login was used (bypasses auth)

  // Check if user is admin
  // Admin/admin login bypasses auth and doesn't create a session
  // So if no user exists, it means admin/admin was used
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@grocery-share.com";
  
  // Determine if current user is admin
  // Admin/admin login bypasses auth and clears session, so user should be null
  // But if there's a stale session, check if email matches admin criteria
  let isAdmin = false;
  if (!user) {
    // No session = admin/admin login was used (bypasses auth, session cleared)
    isAdmin = true;
  } else {
    // There's a user session - check if it's an admin
    // Check against ADMIN_EMAIL env var, or if email is exactly "admin"
    const userEmailLower = user.email?.toLowerCase() || "";
    const adminEmailLower = ADMIN_EMAIL.toLowerCase();
    isAdmin = userEmailLower === adminEmailLower || 
              userEmailLower === "admin" ||
              userEmailLower === "admin@grocery-share.com";
  }
  

  const resolvedSearchParams = await Promise.resolve(searchParams);
  const rows = await getSheetRows();
  const headers = rows[0] || [];
  const dataRows = rows.slice(1);
  const statusIndex = headers.findIndex(
    (header) => header.trim().toLowerCase() === "status"
  );

  const columns: AdminColumn[] = headers
    .map((header, index) => ({ label: header || `Column ${index + 1}`, index }))
    .filter((column) => column.index !== statusIndex);

  const activeRows =
    statusIndex >= 0
      ? dataRows.filter((row) => (row[statusIndex] || "").trim() === "Active")
      : dataRows;

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

  const visibleRows = rowsToSort.map((row) =>
    row.filter((_, index) => index !== statusIndex)
  );
  const filterRows = activeRows.map((row) =>
    row.filter((_, index) => index !== statusIndex)
  );

  return (
    <div className="min-h-screen w-max min-w-full bg-zinc-50 text-zinc-900">
      <NavBar />
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center">
        <span
          className="text-8xl font-bold text-red-500/20"
          style={{ transform: "rotate(-45deg)" }}
        >
          TEST DATA ONLY
        </span>
      </div>
      <div className="w-full px-4 pt-4 pb-10 overflow-x-visible">
        {isAdmin && (
          <div className="p-4 bg-white rounded-lg shadow mb-4">
            <div className="flex gap-3 items-start">
              <SyncButton />
              <span className="text-black font-bold text-xl self-center">→</span>
              <Link
                href="/subscriptions"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold inline-block"
              >
                Subscriptions
              </Link>
            </div>
          </div>
        )}
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
        />
      </div>
    </div>
  );
}
