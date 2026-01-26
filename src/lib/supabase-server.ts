import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseServerInstance: SupabaseClient | null = null;

function getSupabaseServer(): SupabaseClient {
  if (supabaseServerInstance) {
    return supabaseServerInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Only check during runtime, not during build
  if (typeof window === "undefined" && process.env.NODE_ENV !== "test") {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase server environment variables");
    }
  }

  // During build, create a dummy client to avoid errors
  if (!supabaseUrl || !supabaseServiceKey) {
    // Return a minimal client that won't be used during build
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
    return supabaseServerInstance;
  }

  supabaseServerInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseServerInstance;
}

// Export as a getter to avoid build-time errors
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseServer()[prop as keyof SupabaseClient];
  },
});
