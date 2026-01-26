import { cookies } from "next/headers";
import { supabaseServer } from "./supabase-server";

const SESSION_COOKIE_NAME = "grocery-share-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const userId = await getSession();
  if (!userId) return null;

  const { data, error } = await supabaseServer
    .from("users")
    .select("id, email, email_verified")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data;
}
