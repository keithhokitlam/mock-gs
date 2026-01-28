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

    // Fetch all subscriptions from Supabase with check-in counts
    let { data: subscriptions, error } = await supabaseServer
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    // Get check-in counts for each user
    const userIds = (subscriptions || []).map(sub => sub.user_id).filter(Boolean);
    let checkInCounts: Map<string, number> = new Map();
    
    if (userIds.length > 0) {
      try {
        // Count check-ins per user
        const { data: checkIns, error: checkInError } = await supabaseServer
          .from("check_ins")
          .select("user_id")
          .in("user_id", userIds);
        
        if (!checkInError && checkIns) {
          // Count check-ins per user_id
          checkIns.forEach(checkIn => {
            const userId = checkIn.user_id;
            checkInCounts.set(userId, (checkInCounts.get(userId) || 0) + 1);
          });
        }
      } catch (err) {
        console.error("Error fetching check-in counts:", err);
        // Continue without check-in counts if query fails
      }
    }

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions from database", details: error.message },
        { status: 500 }
      );
    }

    console.log(`Found ${subscriptions?.length || 0} subscriptions to sync`);

    // Check for expired subscriptions and update their status to "inactive"
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiredSubscriptions = (subscriptions || []).filter((sub) => {
      if (!sub.subscription_end_date) return false;
      const endDate = new Date(sub.subscription_end_date);
      endDate.setHours(0, 0, 0, 0);
      return endDate < today && sub.status !== "inactive" && sub.status !== "cancelled";
    });

    if (expiredSubscriptions.length > 0) {
      console.log(`Found ${expiredSubscriptions.length} expired subscriptions to mark as inactive`);
      
      // Update each expired subscription in Supabase
      for (const sub of expiredSubscriptions) {
        try {
          const { error: updateError } = await supabaseServer
            .from("subscriptions")
            .update({ status: "inactive" })
            .eq("id", sub.id);
          
          if (updateError) {
            console.error(`Failed to update subscription ${sub.id} to inactive:`, updateError);
          } else {
            console.log(`✅ Marked subscription ${sub.id} (user: ${sub.email}) as inactive (expired on ${sub.subscription_end_date})`);
            // Update the local subscription object so sync reflects the change
            sub.status = "inactive";
          }
        } catch (error: any) {
          console.error(`Error updating subscription ${sub.id}:`, error);
        }
      }
    }

    // Re-fetch subscriptions to get updated statuses
    const { data: updatedSubscriptions, error: refetchError } = await supabaseServer
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (refetchError) {
      console.error("Error re-fetching subscriptions after status update:", refetchError);
      // Continue with original subscriptions if refetch fails
    } else {
      subscriptions = updatedSubscriptions;
      console.log(`Re-fetched ${subscriptions?.length || 0} subscriptions after status updates`);
    }

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
    const statusColumnIndex = 5; // Status is column F (index 5, 0-based): User ID=0, Email=1, Start=2, End=3, Renewal=4, Status=5, Plan=6, Days=7, Check-Ins=8
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
    // Column order: User ID, Email, Start Date, End Date, Renewal Date, Status, Plan Type, Days Remaining, Check-Ins, Created At, Updated At
    const newRows = (subscriptions || []).map((sub) => {
      // Calculate days remaining
      const endDate = new Date(sub.subscription_end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemainingStr = daysRemaining >= 0 ? daysRemaining.toString() : "Expired";

      // Get check-in count for this user
      const userId = sub.user_id || sub.id || "";
      const checkInCount = checkInCounts.get(userId) || 0;

      return [
        userId, // User ID (first column - used for matching)
        sub.email || "", // User Email
        sub.subscription_start_date || "", // Subscription Start Date
        sub.subscription_end_date || "", // Subscription End Date
        sub.renewal_date || "", // Renewal Date
        sub.status || "active", // Status
        sub.plan_type || "", // Plan Type
        daysRemainingStr, // Days Remaining (calculated)
        checkInCount.toString(), // Check-Ins Count
        sub.created_at ? new Date(sub.created_at).toLocaleString() : "", // Created At
        sub.updated_at ? new Date(sub.updated_at).toLocaleString() : "", // Updated At
      ];
    });

    // Find rows that need to be updated vs added
    // Match by user_id + start_date + end_date to handle multiple subscriptions per user
    const rowsToUpdate: Array<{ rowIndex: number; data: string[] }> = [];
    const rowsToAdd: string[][] = [];

    for (const newRow of newRows) {
      const userId = newRow[0]; // User ID is first column
      const email = newRow[1]?.toLowerCase(); // Email is second column
      const startDate = newRow[2]; // Start Date is third column (index 2)
      const endDate = newRow[3]; // End Date is fourth column (index 3)
      
      // Try to find existing row by user_id + start_date + end_date (unique subscription identifier)
      // This allows multiple subscriptions per user to each have their own row
      const existingRowIndex = existingRows.findIndex((row) => {
        if (row.length === 0) return false;
        
        // Get values from existing row
        const rowUserId = row[userIdColumnIndex]?.trim();
        const rowEmail = row[emailColumnIndex]?.toLowerCase();
        const rowStartDate = row[2]?.trim(); // Start Date column
        const rowEndDate = row[3]?.trim(); // End Date column
        
        // Match by user_id + dates (most reliable)
        if (rowUserId === userId && rowStartDate === startDate && rowEndDate === endDate) {
          return true;
        }
        
        // Fallback: match by email + dates (for old format rows)
        if (rowEmail === email && rowStartDate === startDate && rowEndDate === endDate) {
          return true;
        }
        
        // Legacy fallback: match by user_id only (for backward compatibility)
        // Only if dates don't match, this handles old rows without proper date matching
        if (rowUserId === userId && (!rowStartDate || !rowEndDate || !startDate || !endDate)) {
          return true;
        }
        
        return false;
      });

      if (existingRowIndex >= 0) {
        // Row exists - update it
        rowsToUpdate.push({ rowIndex: existingRowIndex, data: newRow });
      } else {
        // New row - add it (this handles multiple subscriptions per user)
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
      // Calculate the next row number (1-based: row 1 = header, row 2 = first data row)
      // If no existing rows, start at row 2
      // If there are existing rows, start after the last row
      const existingRowCount = existingRows?.length || 0;
      const nextRowNumber = existingRowCount === 0 ? 2 : existingRowCount + 2;
      
      // Safety check - ensure we never use row 0 or 1
      if (nextRowNumber < 2) {
        console.error(`Invalid row number calculated: ${nextRowNumber}, using row 2 instead`);
        await writeSheetData(rowsToAdd, 2);
      } else {
        await writeSheetData(rowsToAdd, nextRowNumber);
      }
      console.log(`Added ${rowsToAdd.length} new rows starting at row ${nextRowNumber}`);
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
    console.error("=== SYNC ERROR ===");
    console.error("Sync error:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    
    // Provide more detailed error information
    let errorDetails = error?.message || "Unknown error";
    
    // Check for common Google Sheets API errors
    if (error?.message?.includes("Unable to parse range")) {
      errorDetails = "Invalid sheet name or range. Check GOOGLE_SHEET_NAME environment variable.";
    } else if (error?.message?.includes("The caller does not have permission")) {
      errorDetails = "Service account doesn't have permission. Make sure you shared the Google Sheet with the service account email.";
    } else if (error?.message?.includes("Requested entity was not found")) {
      errorDetails = "Google Sheet not found. Check GOOGLE_SHEET_ID environment variable.";
    } else if (error?.message?.includes("Invalid credentials")) {
      errorDetails = "Invalid Google Sheets credentials. Check GOOGLE_SHEETS_CREDENTIALS environment variable.";
    }
    
    return NextResponse.json(
      {
        error: "Failed to sync subscriptions",
        details: errorDetails,
        fullError: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
