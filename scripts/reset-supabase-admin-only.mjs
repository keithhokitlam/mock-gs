/**
 * DESTRUCTIVE: Deletes all rows in check_ins, subscriptions, and users,
 * then inserts a single verified user email "admin" / password "admin"
 * with an active subscription (required by /api/auth/login).
 *
 * Requires in .env.local (or env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run: node --env-file=.env.local scripts/reset-supabase-admin-only.mjs
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Delete all rows (filter matches every real row) */
async function deleteAll(table, column = "id") {
  const sentinel = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  const { error, count } = await supabase.from(table).delete().neq(column, sentinel);
  if (error) {
    console.error(`delete ${table}:`, error.message);
    throw error;
  }
  return count;
}

async function main() {
  console.log("Resetting Supabase public tables to admin-only…");

  await deleteAll("check_ins");
  console.log("  cleared check_ins");

  await deleteAll("subscriptions");
  console.log("  cleared subscriptions");

  await deleteAll("users");
  console.log("  cleared users");

  const passwordHash = bcrypt.hashSync("admin", 10);
  const { data: user, error: userErr } = await supabase
    .from("users")
    .insert({
      email: "admin",
      password_hash: passwordHash,
      email_verified: true,
      verification_token: null,
      consumer_vs_commercial: "premium",
    })
    .select("id, email")
    .single();

  if (userErr || !user) {
    console.error("insert users:", userErr?.message);
    process.exit(1);
  }
  console.log("  inserted user:", user.email, user.id);

  const start = new Date();
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  const { error: subErr } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    email: user.email,
    subscription_start_date: start.toISOString().split("T")[0],
    subscription_end_date: end.toISOString().split("T")[0],
    status: "active",
    plan_type: "standard",
  });

  if (subErr) {
    console.error("insert subscriptions:", subErr.message);
    process.exit(1);
  }
  console.log("  inserted active subscription for admin");

  console.log("\nDone. Sign in with email: admin  password: admin");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
