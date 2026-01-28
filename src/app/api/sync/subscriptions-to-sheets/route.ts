import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { readSheetData, writeSheetData, updateSheetRow, clearSheetData } from "@/lib/google-sheets";

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

    console.log(`Found ${subscriptions?.length || 0} subscriptions to sync`);

    // Read existing data from Google Sheets
    let existingRows: string[][] = [];
    try {
      existingRows = await readSheetData();
      console.log(`Found ${existingRows.length} existing rows in Google Sheet`);
    } catch (error: any) {
      console.log("No existing data in sheet (or error reading):", error.message);
      // Continue - this is fine if sheet is empty
    }

    // Create a map of subscription IDs from Supabase (using user_id as the identifier)
    const supabaseSubscriptionIds = new Set(
      (subscriptions || []).map((sub) => sub.user_id || sub.id).filter(Boolean)
    );

    // Process existing rows: mark as inactive if not in Supabase
    let inactiveCount = 0;
    const statusColumnIndex = 5; // Status is column F (index 5, 0-based): User ID=0, Email=1, Start=2, End=3, Renewal=4, Status=5
    const userIdColumnIndex = 0; // User ID is first column (index 0)
    const emailColumnIndex = 1; // Email is second column (index 1)

    // Also create a map of emails to user_ids for matching old format rows
    const emailToUserIdMap = new Map(
      (subscriptions || []).map((sub) => [sub.email?.toLowerCase(), sub.user_id || sub.id])
    );

    for (let i = 0; i < existingRows.length; i++) {
      const row = existingRows[i];
      if (row.length === 0) continue; // Skip empty rows

      // Try to get user_id from first column (new format)
      let rowUserId = row[userIdColumnIndex]?.trim();
      
      // If first column looks like an email (old format), try to match by email
      if (!rowUserId || rowUserId.includes("@")) {
        const rowEmail = rowUserId || row[emailColumnIndex]?.trim();
        if (rowEmail) {
          rowUserId = emailToUserIdMap.get(rowEmail.toLowerCase()) || null;
        }
      }
      
      // If this row's user_id is not in Supabase subscriptions, mark as inactive
      if (rowUserId && !supabaseSubscriptionIds.has(rowUserId)) {
        // Update status to inactive (preserve other data)
        // Need to ensure row has enough columns for new format
        const updatedRow = [...row];
        
        // If row is old format (email first), convert to new format (user_id first)
        if (updatedRow.length > 0 && updatedRow[0]?.includes("@")) {
          // Old format: Email, Start, End, Renewal, Status, Plan, Days, Created, Updated
          // New format: User ID, Email, Start, End, Renewal, Status, Plan, Days, Created, Updated
          const oldEmail = updatedRow[0];
          updatedRow.unshift(rowUserId); // Add user_id at the beginning
          updatedRow[1] = oldEmail; // Keep email in second position
        } else {
          // New format or already has user_id
          if (updatedRow.length <= userIdColumnIndex) {
            updatedRow[userIdColumnIndex] = rowUserId;
          }
        }
        
        // Ensure status column exists
        if (updatedRow.length <= statusColumnIndex) {
          while (updatedRow.length <= statusColumnIndex) {
            updatedRow.push("");
          }
        }
        updatedRow[statusColumnIndex] = "inactive";
        
        try {
          await updateSheetRow(i, updatedRow);
          inactiveCount++;
          console.log(`Marked subscription ${rowUserId} as inactive`);
        } catch (error: any) {
          console.error(`Failed to mark row ${i} as inactive:`, error);
        }
      }
    }

    // Format new/updated subscriptions for Google Sheets
    // Column order: User ID, Email, Start Date, End Date, Renewal Date, Status, Plan Type, Days Remaining, Created At, Updated At
    const newRows = (subscriptions || []).map((sub) => {
      // Calculate days remaining
      const endDate = new Date(sub.subscription_end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemainingStr = daysRemaining >= 0 ? daysRemaining.toString() : "Expired";

      return [
        sub.user_id || sub.id || "", // User ID (first column - used for matching)
        sub.email || "", // User Email
        sub.subscription_start_date || "", // Subscription Start Date
        sub.subscription_end_date || "", // Subscription End Date
        sub.renewal_date || "", // Renewal Date
        sub.status || "active", // Status
        sub.plan_type || "", // Plan Type
        daysRemainingStr, // Days Remaining (calculated)
        sub.created_at ? new Date(sub.created_at).toLocaleString() : "", // Created At
        sub.updated_at ? new Date(sub.updated_at).toLocaleString() : "", // Updated At
      ];
    });

    // Find rows that need to be updated vs added
    const rowsToUpdate: Array<{ rowIndex: number; data: string[] }> = [];
    const rowsToAdd: string[][] = [];

    for (const newRow of newRows) {
      const userId = newRow[0]; // User ID is first column
      const email = newRow[1]?.toLowerCase(); // Email is second column
      
      // Try to find existing row by user_id (new format) or email (old format)
      const existingRowIndex = existingRows.findIndex((row) => {
        if (row.length === 0) return false;
        // Check if first column matches user_id (new format)
        if (row[userIdColumnIndex]?.trim() === userId) return true;
        // Check if first column is email and matches (old format)
        if (row[userIdColumnIndex]?.includes("@") && row[userIdColumnIndex]?.toLowerCase() === email) return true;
        // Check if second column is email and matches (if row was already converted)
        if (row[emailColumnIndex]?.toLowerCase() === email) return true;
        return false;
      });

      if (existingRowIndex >= 0) {
        // Row exists - update it
        rowsToUpdate.push({ rowIndex: existingRowIndex, data: newRow });
      } else {
        // New row - add it
        rowsToAdd.push(newRow);
      }
    }

    // Update existing rows
    for (const { rowIndex, data } of rowsToUpdate) {
      try {
        await updateSheetRow(rowIndex, data);
        console.log(`Updated row ${rowIndex + 2} for user ${data[0]}`); // +2 because rowIndex is 0-based and we skip header
      } catch (error: any) {
        console.error(`Failed to update row ${rowIndex}:`, error);
      }
    }

    // Add new rows
    if (rowsToAdd.length > 0) {
      // Find the next empty row
      const nextRowIndex = existingRows.length;
      await writeSheetData(rowsToAdd, nextRowIndex);
      console.log(`Added ${rowsToAdd.length} new rows`);
    }

    const totalProcessed = (subscriptions?.length || 0) + inactiveCount;

    console.log(`✅ Sync complete: ${subscriptions?.length || 0} active, ${inactiveCount} marked inactive`);

    return NextResponse.json({
      success: true,
      message: `Synced ${subscriptions?.length || 0} active subscriptions, marked ${inactiveCount} as inactive`,
      count: subscriptions?.length || 0,
      inactiveCount,
      totalProcessed,
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
