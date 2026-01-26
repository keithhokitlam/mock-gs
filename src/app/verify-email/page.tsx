"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    // Verify email
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }
        return data;
      })
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "An error occurred. Please try again.");
      });
  }, [searchParams, router]);

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
          {status === "loading" && (
            <div className="text-center">
              <p className="text-lg font-semibold">Verifying your email...</p>
              <p className="mt-2 text-sm text-zinc-500">Please wait</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">
                Email verified successfully!
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Redirecting to login...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-semibold text-red-600">
                Verification failed
              </p>
              <p className="text-sm text-zinc-700">{message}</p>
              <Link
                href="/"
                className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
