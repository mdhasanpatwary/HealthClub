import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClientInstance: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client if NEXT_PUBLIC_SUPABASE_URL
 * and NEXT_PUBLIC_SUPABASE_ANON_KEY are configured in the environment.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    return supabaseClientInstance;
  } catch {
    return null;
  }
}

/**
 * Checks if Supabase client credentials are fully available.
 */
export function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
