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
 * @param startRow Starting row number (1-based, where 1 is header, 2 is first data row). Defaults to 2.
 */
export async function writeSheetData(rows: string[][], startRow: number = 2) {
  const sheets = getGoogleSheetsClient();
  const { sheetId, sheetName } = getSheetConfig();

  if (rows.length === 0) {
    console.log("No data to write to sheet");
    return;
  }

  // Validate startRow - must be at least 2 (row 1 is header)
  if (startRow < 2) {
    console.error(`Invalid startRow: ${startRow}, using row 2 instead`);
    startRow = 2;
  }

  try {
    // Write data starting from specified row (default row 2, which is after header)
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${startRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    });

    console.log(`✅ Successfully wrote ${rows.length} rows to Google Sheet starting at row ${startRow}`);
  } catch (error: any) {
    console.error("Error writing to sheet:", error);
    console.error(`Attempted to write to range: ${sheetName}!A${startRow}`);
    throw new Error(`Failed to write to sheet: ${error.message}`);
  }
}

/**
 * Read all data rows from the sheet (excluding header row)
 * @returns Array of arrays, where each inner array is a row of data
 */
export async function readSheetData(): Promise<string[][]> {
  const sheets = getGoogleSheetsClient();
  const { sheetId, sheetName } = getSheetConfig();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A2:Z1000`, // Read from row 2 onwards (skip header)
    });

    return (response.data.values || []) as string[][];
  } catch (error: any) {
    console.error("Error reading sheet data:", error);
    throw new Error(`Failed to read sheet: ${error.message}`);
  }
}

/**
 * Update a specific row in the sheet
 * @param rowIndex Row index (0-based for data rows, where 0 = first data row after header)
 * @param rowData Array of cell values for the row
 */
export async function updateSheetRow(rowIndex: number, rowData: string[]) {
  const sheets = getGoogleSheetsClient();
  const { sheetId, sheetName } = getSheetConfig();

  try {
    // rowIndex is 0-based (0 = first data row), but Google Sheets is 1-based
    // Row 1 is header, so rowIndex 0 = row 2 in the sheet
    const sheetRowNumber = rowIndex + 2;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${sheetRowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [rowData],
      },
    });
    
    console.log(`Updated row ${sheetRowNumber} in Google Sheet`);
  } catch (error: any) {
    console.error(`Error updating row ${rowIndex}:`, error);
    throw new Error(`Failed to update row: ${error.message}`);
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
