import { JWT, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import type { drive_v3 } from "googleapis";
import { Readable } from "stream";

/**
 * Signatures folder (default). Override with GOOGLE_DRIVE_SIGNATURES_FOLDER_ID.
 *
 * ## Why signup might still fail with HTTP 403 “Service Accounts do not have storage quota”
 * Google does **not** give service accounts personal Drive space. Uploading into a folder that
 * lives in **someone’s “My Drive”** often fails even if you shared the folder with the service account.
 *
 * **Fix A (no code):** Move the folder onto a **Google Shared drive** (Workspace), add the service
 * account as **Content manager**, and keep using only `GOOGLE_SHEETS_CREDENTIALS`.
 *
 * **Fix B (this file):** Set the three OAuth env vars below. Uploads then run **as your Gmail user**,
 * so files use **your** Drive quota. Share the signatures folder with **that same Gmail** (Editor).
 *
 * OAuth env (Vercel → Settings → Environment Variables):
 * - `GOOGLE_DRIVE_CLIENT_ID` — OAuth “Desktop” or “Web” client ID from Google Cloud Console
 * - `GOOGLE_DRIVE_CLIENT_SECRET` — matching client secret
 * - `GOOGLE_DRIVE_REFRESH_TOKEN` — long-lived refresh token for scope `https://www.googleapis.com/auth/drive.file`
 *   (easiest: [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) → gear → use your own creds → Drive API v3 → authorize → Exchange for tokens → copy refresh_token)
 * - Optional: `GOOGLE_DRIVE_OAUTH_REDIRECT_URI` — must match the redirect URI used when you created the refresh token
 *   (Playground default: `https://developers.google.com/oauthplayground`)
 */
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

/** True when all three OAuth env vars are set (Vercel / server). */
export function isGoogleDriveOAuthConfigured(): boolean {
  const refresh = process.env.GOOGLE_DRIVE_REFRESH_TOKEN?.trim();
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.trim();
  return !!(refresh && clientId && clientSecret);
}

/** Google’s “service account has no Drive quota” response. */
export function isGoogleDriveServiceAccountStorageQuotaError(message: string): boolean {
  const t = message.toLowerCase();
  return (
    t.includes("service accounts do not have storage quota") ||
    (t.includes("403") && t.includes("storage quota") && t.includes("service account"))
  );
}

/**
 * User-facing signup error when Drive upload fails.
 * If OAuth is not configured and Google returned the SA quota error, explain Vercel env vars clearly.
 */
export function signupDriveFailureResponse(full: string, detail?: string): {
  error: string;
  details?: string;
} {
  const text = (full || detail || "").trim();
  if (!isGoogleDriveOAuthConfigured() && isGoogleDriveServiceAccountStorageQuotaError(text)) {
    return {
      error: [
        "Google blocked the signature upload because the live site is still using a “service account” for Drive—and Google does not give those accounts personal storage.",
        "",
        "Fix (recommended): In Vercel → your project → Settings → Environment Variables, add all three:",
        "• GOOGLE_DRIVE_CLIENT_ID",
        "• GOOGLE_DRIVE_CLIENT_SECRET",
        "• GOOGLE_DRIVE_REFRESH_TOKEN",
        "",
        "Use Google OAuth 2.0 Playground (click the gear, “Use your own OAuth credentials”, authorize Drive, exchange for tokens) to get the refresh token. Use the same Google account that owns—or has Editor on—your signatures folder.",
        "",
        "Then Redeploy the project so those variables load.",
        "",
        "Tip: Each variable can be scoped to Production or Preview in Vercel—turn on **Production** for all three, save, then redeploy (old deployments never pick up new env values).",
      ].join("\n"),
      // Full technical message stays in server logs (signup route); UI already explains the fix.
    };
  }
  return {
    error:
      "We couldn't save your signature right now. Please try again in a moment, or contact support if this keeps happening.",
    details: text || undefined,
  };
}

/** Drive file name: email as title + `.png` (only characters unsafe for Drive names are stripped). */
export function signatureDriveFilenameFromEmail(email: string): string {
  const e = email.trim().toLowerCase();
  const safe = e.replace(/[/\\:*?"<>|]+/g, "_").replace(/\s+/g, "_");
  if (!safe) return "signature-unknown.png";
  return safe.endsWith(".png") ? safe : `${safe}.png`;
}

type DriveContext = {
  drive: drive_v3.Drive;
  /** For error messages: who must have access to the folder */
  accessHint: string;
};

function createDriveContext(): DriveContext {
  const refresh = process.env.GOOGLE_DRIVE_REFRESH_TOKEN?.trim();
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.trim();

  const oauthPieces = [refresh, clientId, clientSecret].filter(Boolean).length;
  if (oauthPieces > 0 && oauthPieces < 3) {
    throw new Error(
      "Incomplete Google Drive OAuth: set ALL of GOOGLE_DRIVE_REFRESH_TOKEN, GOOGLE_DRIVE_CLIENT_ID, and GOOGLE_DRIVE_CLIENT_SECRET on Vercel (or remove partial entries). Then redeploy."
    );
  }

  if (refresh && clientId && clientSecret) {
    const redirectUri =
      process.env.GOOGLE_DRIVE_OAUTH_REDIRECT_URI?.trim() ||
      "https://developers.google.com/oauthplayground";
    const oauth2 = new OAuth2Client(clientId, clientSecret, redirectUri);
    oauth2.setCredentials({ refresh_token: refresh });
    const drive = google.drive({ version: "v3", auth: oauth2 });
    return {
      drive,
      accessHint:
        "the Google account used for GOOGLE_DRIVE_REFRESH_TOKEN (share the signatures folder with that account as Editor)",
    };
  }

  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS is not set (or set OAuth vars for Drive upload)");
  }
  const creds = parseServiceAccountCredentials(credentialsJson);
  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });
  return {
    drive,
    accessHint: `service account ${creds.client_email} — note: uploads to “My Drive” folders often fail (no SA quota); use a Shared drive or set GOOGLE_DRIVE_REFRESH_TOKEN + client id/secret instead`,
  };
}

const DRIVE_FILE_OPTS = { supportsAllDrives: true } as const;

/**
 * Upload a PNG signature to Google Drive. File name = `{email}.png`.
 *
 * Prefers **OAuth** (`GOOGLE_DRIVE_*` refresh token) when configured; otherwise uses the Sheets **service account**.
 */
export async function uploadSignupSignaturePng(
  pngBuffer: Buffer,
  email: string
): Promise<{ fileId: string; name: string }> {
  const folderId =
    process.env.GOOGLE_DRIVE_SIGNATURES_FOLDER_ID || DEFAULT_SIGNATURES_FOLDER_ID;

  console.log(
    "[signup-signature-drive] auth=%s folder=%s",
    isGoogleDriveOAuthConfigured() ? "oauth" : "service_account",
    folderId
  );

  const { drive, accessHint } = createDriveContext();

  try {
    await drive.files.get({
      fileId: folderId,
      fields: "id,name,mimeType",
      ...DRIVE_FILE_OPTS,
    });
  } catch (e) {
    const d = getGoogleDriveErrorDetail(e);
    throw new Error(
      `Cannot open signatures folder (${folderId}). Share that folder with ${accessHint}. ${d}`
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
      ...DRIVE_FILE_OPTS,
    });
  } catch (e) {
    const d = getGoogleDriveErrorDetail(e);
    throw new Error(`Drive upload failed (${name}). ${accessHint}. ${d}`);
  }

  const fileId = res.data.id;
  if (!fileId) {
    throw new Error("Drive API returned no file id");
  }

  return { fileId, name: res.data.name || name };
}
