import { createClient } from "@supabase/supabase-js";

/** Service-role client for server-only privileged operations (storage writes, admin queries). Never import from client components. */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
