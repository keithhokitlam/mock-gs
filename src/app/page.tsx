"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DoorSplash from "./door-splash";
import SignupModal from "./components/signup-modal";
import ForgotPasswordModal from "./components/forgot-password-modal";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    // Fallback to admin/admin for testing
    if (email === "admin" && password === "admin") {
      setError("");
      setLoading(false);
      router.push("/mastertable");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Incorrect email or password.");
        setLoading(false);
        return;
      }

      // Login successful, redirect to mastertable
      router.push("/mastertable");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <DoorSplash />
      <nav className="w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
        <div className="flex w-full items-center gap-4 px-2 py-0">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/logos/GS_logo_highres_2x.png"
              alt="GroceryShare"
            width={260}
            height={104}
            className="h-16 w-auto translate-y-[2px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-12 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            <span className="font-beckman">About</span>
            <Link href="/support" className="font-beckman hover:opacity-80">
              Support
            </Link>
            <Link href="/contact" className="font-beckman hover:opacity-80">
              Contact
            </Link>
            <span className="font-beckman">FAQ</span>
          </div>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-md px-4 pt-1 pb-10">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="-mt-16 mb-8 space-y-0 text-center">
          <div className="mx-auto w-[25rem] -mb-10 translate-x-[-26px]">
            <Image
              src="/logos/GroceryShare_logo_stacked_1024.png"
              alt="GroceryShare"
              width={800}
              height={800}
              priority
              className="h-auto w-full"
            />
          </div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm text-zinc-500">
            Sign in to continue to your subscription account.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="username">
              Username or email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="you@example.com"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-[#2B6B4A] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowSignup(true)}
            className="text-sm text-[#2B6B4A] hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-zinc-500">
          By continuing, you agree to the terms and privacy policy.
        </p>
        </div>
      </main>
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
