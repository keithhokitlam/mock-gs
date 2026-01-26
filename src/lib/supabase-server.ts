import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create client - use placeholder during build if env vars not available
// In Vercel production, env vars are available during build for server code
let supabaseServerInstance: SupabaseClient;

if (!supabaseUrl || !supabaseServiceKey) {
  // Build-time fallback (shouldn't happen in Vercel with proper env vars)
  supabaseServerInstance = createClient(
    "https://placeholder.supabase.co",
    "placeholder-key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  ) as SupabaseClient;
} else {
  // Normal runtime/production - create real client
  supabaseServerInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseServer = supabaseServerInstance;
