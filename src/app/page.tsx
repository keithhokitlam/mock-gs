"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import DoorSplash from "./door-splash";
import SignupModal from "./components/signup-modal";
import ForgotPasswordModal from "./components/forgot-password-modal";
import NavBar from "./components/navbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for error messages in URL parameters (from redirects)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "subscription_inactive":
          setError("Your account either:\n1) does not exist with the email provided and you must create a new account or\n2) your account has expired and you must sign up again to resume services");
          break;
        case "subscription_expired":
          setError("Your account either:\n1) does not exist with the email provided and you must create a new account or\n2) your account has expired and you must sign up again to resume services");
          break;
        case "no_subscription":
          setError("Your account either:\n1) does not exist with the email provided and you must create a new account or\n2) your account has expired and you must sign up again to resume services");
          break;
        default:
          setError("Access denied. Please contact support.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    // Fallback to admin/admin for testing
    if (email === "admin" && password === "admin") {
      // Clear any existing session first (so admin/admin works even if another user was logged in)
      try {
        await fetch("/api/auth/logout", { 
          method: "POST",
          credentials: "include" 
        });
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        // Ignore errors - session might not exist
        console.log("Logout error (ignored):", err);
      }
      // Set admin session cookie so MASTER TABLE link and ADMIN show on all pages
      try {
        await fetch("/api/auth/admin-session", { 
          method: "POST",
          credentials: "include" 
        });
      } catch (err) {
        console.log("Admin session error (ignored):", err);
      }
      setError("");
      setLoading(false);
      // Use window.location instead of router.push to ensure fresh page load
      window.location.href = "/mastertable";
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
        // Show detailed error if available (for debugging)
        console.log("Login error response:", data);
        const errorMessage = data.details 
          ? `${data.error}\n\nDetails: ${data.details}${data.code ? ` (Code: ${data.code})` : ''}` 
          : data.error || "Incorrect email or password.";
        setError(errorMessage);
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
      <NavBar />
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
          <h1 className="text-3xl font-semibold">Welcome back!</h1>
          <p className="text-sm text-zinc-500">
            Sign in to unlock your grocery lists and food adventures.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="username">
              Email
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
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 pr-10 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error ? (
            <p className="text-sm text-red-600 whitespace-pre-line" role="alert">
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
