"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/safe-next";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  return (
    <AuthShell eyebrow="Welcome back" title="Log in to Wediingo">
      <div className="flex flex-col gap-5">
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:shadow disabled:opacity-50"
        >
          <GoogleIcon />
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <div className="h-px flex-1 bg-neutral-200" />
          or continue with email
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-500">Email</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/20"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-500">Password</span>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/20"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-xl bg-[#b76e79] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#8a5a5f] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          No account?{" "}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-[#b76e79] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
