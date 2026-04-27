"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NavBar from "../components/navbar";

type VerifyEmailLocale = "en" | "zh";

const VERIFY_COPY = {
  en: {
    noToken: "No verification token provided",
    verificationFailed: "Verification failed",
    successMessage: "Email verified successfully!",
    generic: "An error occurred. Please try again.",
    verifying: "Verifying your email...",
    pleaseWait: "Please wait",
    successTitle: "Email verified successfully!",
    redirecting: "Redirecting to login...",
    goLogin: "Go to Login",
    loading: "Loading...",
  },
  zh: {
    noToken: "未提供邮箱验证令牌",
    verificationFailed: "验证失败",
    successMessage: "邮箱验证成功！",
    generic: "发生错误，请再试一次。",
    verifying: "正在验证你的邮箱...",
    pleaseWait: "请稍候",
    successTitle: "邮箱验证成功！",
    redirecting: "正在跳转到登录页...",
    goLogin: "前往登录",
    loading: "正在加载...",
  },
} as const;

function VerifyEmailForm({ locale = "en" }: { locale?: VerifyEmailLocale }) {
  const copy = VERIFY_COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(copy.noToken);
      return;
    }

    // Verify email
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || copy.verificationFailed);
        }
        return data;
      })
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message || copy.successMessage);
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/home");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || copy.verificationFailed);
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || copy.generic);
      });
  }, [copy.generic, copy.noToken, copy.successMessage, copy.verificationFailed, searchParams, router]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          {status === "loading" && (
            <div className="text-center">
              <p className="text-lg font-semibold">{copy.verifying}</p>
              <p className="mt-2 text-sm text-zinc-500">{copy.pleaseWait}</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">
                {copy.successTitle}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                {copy.redirecting}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-semibold text-red-600">
                {copy.verificationFailed}
              </p>
              <p className="text-sm text-zinc-700">{message}</p>
              <Link
                href={locale === "zh" ? "/zh/home" : "/home"}
                className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {copy.goLogin}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function VerifyEmailPageContent({ locale = "en" }: { locale?: VerifyEmailLocale }) {
  const pathname = usePathname();
  const actualLocale =
    locale === "zh" || pathname === "/zh" || pathname?.startsWith("/zh/") ? "zh" : "en";
  const copy = VERIFY_COPY[actualLocale];

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center">
        <p className="text-zinc-600">{copy.loading}</p>
      </div>
    }>
      <VerifyEmailForm locale={actualLocale} />
    </Suspense>
  );
}

export default function VerifyEmailPage() {
  return <VerifyEmailPageContent />;
}
