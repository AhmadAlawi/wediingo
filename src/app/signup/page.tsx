"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/safe-next";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  if (done) {
    return (
      <AuthShell eyebrow="Almost there" title="Check your email">
        <p className="text-center text-neutral-500">
          Confirm your address to finish creating your account.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Get started" title="Create your account">
      <div className="flex flex-col gap-5">
        <button
          onClick={handleGoogleSignup}
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

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
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
              minLength={6}
              placeholder="At least 6 characters"
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
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-[#b76e79] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
