"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("No reset token provided");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
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
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
            Reset Password
          </h1>

          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-green-600">
                Password reset successfully! Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-700"
                  htmlFor="reset-password"
                >
                  New Password
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-700"
                  htmlFor="reset-confirm"
                >
                  Confirm Password
                </label>
                <input
                  id="reset-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
