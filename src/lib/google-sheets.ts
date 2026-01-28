import { google } from "googleapis";

/**
 * Get authenticated Google Sheets client
 * Uses service account credentials from environment variable
 */
function getGoogleSheetsClient() {
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
  
  if (!credentialsJson) {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS environment variable is not set");
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch (error) {
    throw new Error("Failed to parse GOOGLE_SHEETS_CREDENTIALS. It must be valid JSON.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Get Google Sheet ID and name from environment variables
 */
function getSheetConfig() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Sheet1";

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID environment variable is not set");
  }

  return { sheetId, sheetName };
}

/**
 * Clear all data from the sheet (except header row)
 */
export async function clearSheetData() {
  const sheets = getGoogleSheetsClient();
  const { sheetId, sheetName } = getSheetConfig();

  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: `${sheetName}!A2:Z1000`, // Clear from row 2 onwards (keep header row)
    });
  } catch (error: any) {
    console.error("Error clearing sheet data:", error);
    throw new Error(`Failed to clear sheet: ${error.message}`);
  }
}

/**
 * Write data rows to Google Sheet
 * @param rows Array of arrays, where each inner array is a row of data
 */
export async function writeSheetData(rows: string[][]) {
  const sheets = getGoogleSheetsClient();
  const { sheetId, sheetName } = getSheetConfig();

  if (rows.length === 0) {
    console.log("No data to write to sheet");
    return;
  }

  try {
    // Write data starting from row 2 (row 1 is headers)
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A2`,
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    });

    console.log(`✅ Successfully wrote ${rows.length} rows to Google Sheet`);
  } catch (error: any) {
    console.error("Error writing to sheet:", error);
    throw new Error(`Failed to write to sheet: ${error.message}`);
  }
}

/**
 * Replace all data in the sheet (clears existing data and writes new data)
 * @param rows Array of arrays, where each inner array is a row of data
 */
export async function replaceSheetData(rows: string[][]) {
  await clearSheetData();
  await writeSheetData(rows);
}
