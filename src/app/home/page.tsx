"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useMemo } from "react";
import SignupModal from "../components/signup-modal";
import ForgotPasswordModal from "../components/forgot-password-modal";
import NavBar from "../components/navbar";
import DoorSplash from "../door-splash";

type HomeLocale = "en" | "zh";

const HOME_COPY = {
  en: {
    subscriptionInactive:
      "Your account either:\n1) does not exist with the email provided and you must create a new account or\n2) your account has expired and you must sign up again to resume services",
    accessDenied: "Access denied. Please contact support.",
    loginGenericError: "An error occurred. Please try again.",
    loginFallbackError: "Incorrect email or password.",
    welcomeLine1: "Welcome to",
    welcomeLine2: "Grocery-Share.com!",
    intro: "Sign in to unlock your grocery adventures.",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Forgot password?",
    hidePassword: "Hide password",
    showPassword: "Show password",
    signingIn: "Signing in...",
    signIn: "Sign in",
    signupPrompt: "Don't have an account? Sign up",
    continuing: "By continuing, you agree to the",
    privacyPolicy: "privacy policy",
    termsOfService: "terms of service",
    consumerDisclaimer: "disclaimer for the consumer section",
    commercialDisclaimer: "disclaimer for the commercial section",
    ifApplicable: "(if applicable).",
    loading: "Loading...",
  },
  zh: {
    subscriptionInactive:
      "您的账户可能：\n1）尚未使用此电邮创建账户，请先注册；或\n2）账户已过期，请重新注册以恢复服务。",
    accessDenied: "无法访问。请联系支持团队。",
    loginGenericError: "发生错误，请再试一次。",
    loginFallbackError: "电邮或密码不正确。",
    welcomeLine1: "欢迎来到",
    welcomeLine2: "Grocery-Share.com！",
    intro: "登录后即可开启您的食品探索之旅。",
    email: "电邮",
    emailPlaceholder: "you@example.com",
    password: "密码",
    passwordPlaceholder: "••••••••",
    forgotPassword: "忘记密码？",
    hidePassword: "隐藏密码",
    showPassword: "显示密码",
    signingIn: "正在登录...",
    signIn: "登录",
    signupPrompt: "还没有账户？立即注册",
    continuing: "继续即表示您同意",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    consumerDisclaimer: "Essential Membership 免责声明",
    commercialDisclaimer: "Premium Membership 免责声明",
    ifApplicable: "（如适用）。",
    loading: "加载中...",
  },
} as const;

function LoginForm({ locale = "en" }: { locale?: HomeLocale }) {
  const copy = HOME_COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** Pre-select signup plan only when /home?account=essential|premium (legacy consumer|commercial also supported). */
  const defaultSelectedPlan = useMemo(() => {
    const a = searchParams.get("account");
    if (a === "essential" || a === "consumer") return "essential" as const;
    if (a === "premium" || a === "commercial") return "premium" as const;
    return null;
  }, [searchParams]);

  // Check for error messages in URL parameters (from redirects)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "subscription_inactive":
          setError(copy.subscriptionInactive);
          break;
        case "subscription_expired":
          setError(copy.subscriptionInactive);
          break;
        case "no_subscription":
          setError(copy.subscriptionInactive);
          break;
        default:
          setError(copy.accessDenied);
      }
    }
  }, [copy.accessDenied, copy.subscriptionInactive, searchParams]);

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
          credentials: "include",
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        // Ignore errors - session might not exist
        console.log("Logout error (ignored):", err);
      }
      // Set admin session cookie so MASTER TABLE link and ADMIN show on all pages
      try {
        await fetch("/api/auth/admin-session", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.log("Admin session error (ignored):", err);
      }
      setError("");
      setLoading(false);
      // Use window.location instead of router.push to ensure fresh page load
      window.location.href = "/foodcategory";
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
          ? `${data.error}\n\nDetails: ${data.details}${data.code ? ` (Code: ${data.code})` : ""}`
          : data.error || copy.loginFallbackError;
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Login successful — land on food category (consumer entry)
      router.push("/foodcategory");
    } catch (err) {
      setError(copy.loginGenericError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-md px-4 pt-1 pb-10">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-8 space-y-4 text-center">
            <div className="mx-auto flex justify-center w-[17.5rem]">
              <Image
                src="/logos/Grocery-Share Logo.png"
                alt="Grocery-Share"
                width={560}
                height={560}
                priority
                className="h-auto w-full"
              />
            </div>
            <h1 className="text-3xl font-semibold leading-tight">
              <span className="block">{copy.welcomeLine1}</span>
              <span className="block">{copy.welcomeLine2}</span>
            </h1>
            <p className="text-sm text-zinc-500">
              {copy.intro}
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700" htmlFor="username">
                {copy.email}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder={copy.emailPlaceholder}
                autoComplete="username"
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700" htmlFor="password">
                  {copy.password}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-[#2B6B4A] hover:underline"
                >
                  {copy.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={copy.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 pr-10 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  aria-label={showPassword ? copy.hidePassword : copy.showPassword}
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
              {loading ? copy.signingIn : copy.signIn}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="text-sm text-[#2B6B4A] hover:underline"
            >
              {copy.signupPrompt}
            </button>
          </div>
          <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500">
            {copy.continuing}{" "}
            <Link href="/legal#privacy-policy" className="text-[#2B6B4A] underline hover:no-underline">
              {copy.privacyPolicy}
            </Link>
            ,{" "}
            <Link href="/legal#terms-of-service" className="text-[#2B6B4A] underline hover:no-underline">
              {copy.termsOfService}
            </Link>
            ,{" "}
            <Link
              href="/legal#disclaimer-consumer"
              className="text-[#2B6B4A] underline hover:no-underline"
            >
              {copy.consumerDisclaimer}
            </Link>
            , and{" "}
            <Link
              href="/legal#disclaimer-commercial"
              className="text-[#2B6B4A] underline hover:no-underline"
            >
              {copy.commercialDisclaimer}
            </Link>{" "}
            {copy.ifApplicable}
          </p>
        </div>
      </main>
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        defaultSelectedPlan={defaultSelectedPlan}
        locale={locale}
      />
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}

export function HomeLoginPageContent({ locale = "en" }: { locale?: HomeLocale }) {
  const copy = HOME_COPY[locale];
  return (
    <>
      <DoorSplash />
      <Suspense
        fallback={
          <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-zinc-600">{copy.loading}</p>
            </div>
          </div>
        }
      >
        <LoginForm locale={locale} />
      </Suspense>
    </>
  );
}

export default function HomeLoginPage() {
  return <HomeLoginPageContent />;
}
