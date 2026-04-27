"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NavBar from "../components/navbar";

type ResetPasswordLocale = "en" | "zh";

const RESET_COPY = {
  en: {
    noToken: "No reset token provided",
    invalidToken: "Invalid reset token",
    required: "All fields are required",
    passwordMin: "Password must be at least 6 characters",
    mismatch: "Passwords do not match",
    failed: "Failed to reset password",
    generic: "An error occurred. Please try again.",
    title: "Reset Password",
    success: "Password reset successfully! Redirecting to login...",
    newPassword: "New Password",
    passwordHint: "Password must be 6 or more characters",
    confirmPassword: "Confirm Password",
    hide: "Hide password",
    show: "Show password",
    resetting: "Resetting...",
    submit: "Reset Password",
    loading: "Loading...",
  },
  zh: {
    noToken: "未提供重置令牌",
    invalidToken: "重置令牌无效",
    required: "请填写所有字段",
    passwordMin: "密码至少需要 6 个字符",
    mismatch: "两次输入的密码不一致",
    failed: "密码重置失败",
    generic: "发生错误，请再试一次。",
    title: "重置密码",
    success: "密码重置成功！正在跳转到登录页...",
    newPassword: "新密码",
    passwordHint: "密码至少需要 6 个字符",
    confirmPassword: "确认密码",
    hide: "隐藏密码",
    show: "显示密码",
    resetting: "正在重置...",
    submit: "重置密码",
    loading: "正在加载...",
  },
} as const;

function ResetPasswordForm({ locale = "en" }: { locale?: ResetPasswordLocale }) {
  const copy = RESET_COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError(copy.noToken);
    } else {
      setToken(tokenParam);
    }
  }, [copy.noToken, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token) {
      setError(copy.invalidToken);
      return;
    }

    if (!password || !confirmPassword) {
      setError(copy.required);
      return;
    }

    if (password.length < 6) {
      setError(copy.passwordMin);
      return;
    }

    if (password !== confirmPassword) {
      setError(copy.mismatch);
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
        setError(data.error || copy.failed);
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (err) {
      setError(copy.generic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
            {copy.title}
          </h1>

          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-green-600">
                {copy.success}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-700"
                  htmlFor="reset-password"
                >
                  {copy.newPassword}
                </label>
                <p className="text-xs text-zinc-500">
                  {copy.passwordHint}
                </p>
                <div className="relative">
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 pr-10 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                    aria-label={showPassword ? copy.hide : copy.show}
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

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-700"
                  htmlFor="reset-confirm"
                >
                  {copy.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    id="reset-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 pr-10 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                    aria-label={showConfirmPassword ? copy.hide : copy.show}
                  >
                    {showConfirmPassword ? (
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
                {loading ? copy.resetting : copy.submit}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function ResetPasswordPageContent({ locale = "en" }: { locale?: ResetPasswordLocale }) {
  const pathname = usePathname();
  const actualLocale =
    locale === "zh" || pathname === "/zh" || pathname?.startsWith("/zh/") ? "zh" : "en";
  const copy = RESET_COPY[actualLocale];

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center">
        <p className="text-zinc-600">{copy.loading}</p>
      </div>
    }>
      <ResetPasswordForm locale={actualLocale} />
    </Suspense>
  );
}

export default function ResetPasswordPage() {
  return <ResetPasswordPageContent />;
}
