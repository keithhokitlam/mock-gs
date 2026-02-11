"use client";

import { useState } from "react";
import Link from "next/link";

// Gold grocery icon SVG (shopping basket with groceries)
const GoldGroceryIcon = () => (
  <svg
    className="w-12 h-12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGradientSignup" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    {/* Shopping basket */}
    <path
      d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="url(#goldGradientSignup)"
    />
    {/* Grocery items inside */}
    <circle cx="6" cy="9" r="1.5" fill="url(#goldGradientSignup)" opacity="0.8" />
    <circle cx="10" cy="9" r="1.5" fill="url(#goldGradientSignup)" opacity="0.8" />
    <circle cx="14" cy="9" r="1.5" fill="url(#goldGradientSignup)" opacity="0.8" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="w-3 h-3 shrink-0"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M10 6V9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3" />
    <path d="M7 1h4v4" />
    <path d="M11 1 5 7" />
  </svg>
);

type SignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All required fields must be filled in");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms of Use and Privacy Policy to create an account");
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          company: company || undefined,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setCompany("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeToTerms(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-8 text-zinc-400 hover:text-zinc-600"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-zinc-900">
          Join the GroceryShare family!
        </h2>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600">
              You&apos;re in! Check your email to verify your account—then
              you&apos;re all set to start exploring.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-700"
                  htmlFor="signup-firstname"
                >
                  First Name
                </label>
                <input
                  id="signup-firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-700"
                  htmlFor="signup-lastname"
                >
                  Last Name
                </label>
                <input
                  id="signup-lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="signup-company"
              >
                Company
              </label>
              <input
                id="signup-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="signup-email"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="signup-password"
              >
                Password
              </label>
              <p className="text-xs text-zinc-500">
                Password must be 6 or more characters
              </p>
              <div className="relative">
                <input
                  id="signup-password"
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

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-700"
                htmlFor="signup-confirm"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm"
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
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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

            {/* Subscription Plan Box */}
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              {/* Gold Icon */}
              <div className="flex items-center justify-center mb-3">
                <GoldGroceryIcon />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-2 text-center text-zinc-900">
                Standard Annual Subscription
              </h3>

              {/* Description */}
              <p className="text-zinc-600 mb-3 text-xs leading-relaxed text-center">
                Your digital food-savvy friend—full access to all category lists,
                quirky food facts, and kitchen inspiration!
              </p>

              {/* Duration */}
              <div className="text-center mb-3">
                <span className="text-xl font-bold text-zinc-900">
                  12 months of:
                </span>
              </div>

              {/* Features - same as /pricing */}
              <ul className="space-y-1.5 mb-3 text-sm text-zinc-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Full access to all food lists and tasty know-how</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>We&apos;ve got your back—priority support when you need us</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Auto-renewal so you never miss a beat (except Alipay)</span>
                </li>
              </ul>
            </div>

            <label className="flex gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-[#2B6B4A] focus:ring-[#2B6B4A]"
              />
              <span className="text-xs text-zinc-700 leading-relaxed">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2B6B4A] underline hover:text-[#1f4d35] inline-flex items-center gap-0.5"
                >
                  Terms of Use
                  <ExternalLinkIcon />
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2B6B4A] underline hover:text-[#1f4d35] inline-flex items-center gap-0.5"
                >
                  Privacy Policy
                  <ExternalLinkIcon />
                </Link>{" "}
                and declare that I have read the information that is required in
                accordance with{" "}
                <a
                  href="https://gdpr-info.eu/art-13-gdpr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2B6B4A] underline hover:text-[#1f4d35] inline-flex items-center gap-0.5"
                >
                  Article 13 of the GDPR
                  <ExternalLinkIcon />
                </a>
                .
              </span>
            </label>

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
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
