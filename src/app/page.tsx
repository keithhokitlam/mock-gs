"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    if (username === "admin" && password === "admin") {
      setError("");
      router.push("/mastertable");
      return;
    }

    setError("Incorrect username or password.");
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
            <span className="font-beckman">Support</span>
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
            <label className="text-sm font-medium text-zinc-700" htmlFor="password">
              Password
            </label>
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
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-500">
          By continuing, you agree to the terms and privacy policy.
        </p>
        </div>
      </main>
    </div>
  );
}
