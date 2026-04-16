import { JWT } from "google-auth-library";
import { google } from "googleapis";
import { Readable } from "stream";

/** Default folder: share this folder with the service account email (Editor) from `GOOGLE_SHEETS_CREDENTIALS`. */
const DEFAULT_SIGNATURES_FOLDER_ID = "1NYrbiVC8fMhXftEIvsDLjwz9fb0307B8";

type ServiceAccountCreds = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

/** Parse JSON and fix `private_key` when env stores `\n` as two chars instead of real newlines (common on Vercel). */
function parseServiceAccountCredentials(json: string): ServiceAccountCreds {
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(json) as Record<string, unknown>;
  } catch {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS is not valid JSON");
  }
  const client_email = raw.client_email;
  const private_key = raw.private_key;
  if (typeof client_email !== "string" || typeof private_key !== "string") {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS must include client_email and private_key");
  }
  // Env / one-line JSON often stores PEM newlines as the two characters \ n — JWT requires real newlines.
  const key = private_key.replace(/\\n/g, "\n");
  return {
    client_email,
    private_key: key,
    project_id: typeof raw.project_id === "string" ? raw.project_id : undefined,
  };
}

/** Human-readable snippet from a Google API / Gaxios failure (safe to show in UI). */
export function getGoogleDriveErrorDetail(err: unknown): string {
  const g = err as {
    response?: { status?: number; data?: { error?: { message?: string; errors?: Array<{ message?: string }> } } };
    code?: number;
    message?: string;
  };
  const status = g.response?.status ?? g.code;
  const apiErr = g.response?.data?.error;
  const first = apiErr?.errors?.[0]?.message;
  const top = apiErr?.message;
  const parts = [status ? `HTTP ${status}` : null, first || top || g.message].filter(Boolean);
  const s = parts.join(" — ");
  return s.length > 400 ? `${s.slice(0, 397)}...` : s;
}

/** Drive file name: email as title + `.png` (only characters unsafe for Drive names are stripped). */
export function signatureDriveFilenameFromEmail(email: string): string {
  const e = email.trim().toLowerCase();
  const safe = e.replace(/[/\\:*?"<>|]+/g, "_").replace(/\s+/g, "_");
  if (!safe) return "signature-unknown.png";
  return safe.endsWith(".png") ? safe : `${safe}.png`;
}

function getDriveClient() {
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS is not set");
  }
  const creds = parseServiceAccountCredentials(credentialsJson);
  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return { drive: google.drive({ version: "v3", auth }), clientEmail: creds.client_email };
}

/**
 * Upload a PNG signature to Google Drive. File name = `{email}.png` (see {@link signatureDriveFilenameFromEmail}).
 * Folder must be shared with the service account as **Editor**; **Google Drive API** must be enabled for the GCP project.
 */
export async function uploadSignupSignaturePng(
  pngBuffer: Buffer,
  email: string
): Promise<{ fileId: string; name: string }> {
  const folderId =
    process.env.GOOGLE_DRIVE_SIGNATURES_FOLDER_ID || DEFAULT_SIGNATURES_FOLDER_ID;

  const { drive, clientEmail } = getDriveClient();

  try {
    await drive.files.get({
      fileId: folderId,
      fields: "id,name,mimeType",
    });
  } catch (e) {
    const d = getGoogleDriveErrorDetail(e);
    throw new Error(
      `Cannot open signatures folder (${folderId}). Share that folder in Google Drive with this address as Editor: ${clientEmail}. ${d}`
    );
  }

  const name = signatureDriveFilenameFromEmail(email);

  let res;
  try {
    res = await drive.files.create({
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
    });
  } catch (e) {
    const d = getGoogleDriveErrorDetail(e);
    throw new Error(
      `Drive upload failed (${name}). Folder shared with ${clientEmail}? Drive API enabled? ${d}`
    );
  }

  const fileId = res.data.id;
  if (!fileId) {
    throw new Error("Drive API returned no file id");
  }

  return { fileId, name: res.data.name || name };
}
