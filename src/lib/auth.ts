import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/** Resolves the current Supabase session to our User row (creating it on first sight). Server-only. */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser || !authUser.email) return null;

  return prisma.user.upsert({
    where: { id: authUser.id },
    update: { email: authUser.email },
    create: {
      id: authUser.id,
      email: authUser.email,
      name: (authUser.user_metadata?.full_name as string | undefined) ?? null,
    },
  });
}
