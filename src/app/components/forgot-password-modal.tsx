"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const pathname = usePathname();
  const isZh = pathname === "/zh" || pathname?.startsWith("/zh/");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError(isZh ? "邮箱为必填项" : "Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (isZh ? "发送重置链接失败" : "Failed to send reset link"));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(isZh ? "发生错误，请再试一次。" : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600"
          aria-label={isZh ? "关闭" : "Close"}
        >
          ✕
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-zinc-900">
          {isZh ? "忘记密码" : "Forgot Password"}
        </h2>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600">
              {isZh
                ? "如果此邮箱对应账号已存在，密码重置链接已经发送。请查看你的邮箱。"
                : "If an account exists with this email, a password reset link has been sent. Please check your email."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {isZh ? "关闭" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="forgot-email"
              >
                {isZh ? "邮箱" : "Email"}
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
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
              disabled={loading}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50"
            >
              {loading ? (isZh ? "正在发送..." : "Sending...") : isZh ? "发送重置链接" : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
