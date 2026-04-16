import { google } from "googleapis";
import { Readable } from "stream";

/** Default folder: share this folder with the service account email (Editor) from `GOOGLE_SHEETS_CREDENTIALS`. */
const DEFAULT_SIGNATURES_FOLDER_ID = "1NYrbiVC8fMhXftEIvsDLjwz9fb0307B8";

/** Drive file name: email as title + `.png` (only characters unsafe for Drive names are stripped). */
export function signatureDriveFilenameFromEmail(email: string): string {
  const e = email.trim().toLowerCase();
  const safe = e.replace(/[/\\:*?"<>|]+/g, "_").replace(/\s+/g, "_");
  if (!safe) return "signature-unknown.png";
  return safe.endsWith(".png") ? safe : `${safe}.png`;
}

/**
 * Upload a PNG signature to Google Drive (same service account as Sheets).
 * The file name is the signer email + `.png`. Folder must be shared with that service account as Editor.
 * Uses full Drive scope so uploads to a shared folder work reliably (narrow `drive.file` often 403s here).
 */
export async function uploadSignupSignaturePng(
  pngBuffer: Buffer,
  email: string
): Promise<{ fileId: string; name: string }> {
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS is not set");
  }

  const folderId =
    process.env.GOOGLE_DRIVE_SIGNATURES_FOLDER_ID || DEFAULT_SIGNATURES_FOLDER_ID;

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(credentialsJson) as Record<string, unknown>;
  } catch {
    throw new Error("Failed to parse GOOGLE_SHEETS_CREDENTIALS");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const drive = google.drive({ version: "v3", auth });
  const name = signatureDriveFilenameFromEmail(email);

  const res = await drive.files.create({
    requestBody: {
      name,
      parents: [folderId],
      mimeType: "image/png",
    },
    media: {
      mimeType: "image/png",
      body: Readable.from(pngBuffer),
    },
    fields: "id,name",
    supportsAllDrives: true,
  });

  const fileId = res.data.id;
  if (!fileId) {
    throw new Error("Drive API returned no file id");
  }

  return { fileId, name: res.data.name || name };
}
