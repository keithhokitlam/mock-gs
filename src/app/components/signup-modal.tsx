"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SignupSignaturePad, {
  type SignupSignaturePadHandle,
} from "./signup-signature-pad";
import {
  SUBSCRIPTION_PLAN_CONTENT,
  type ConsumerVsCommercial,
} from "./subscription-plan-content";

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

/** Document + magnifying glass — research / discovery vibe (consumer tier) */
const GoldResearchIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="goldGradientResearchSignup" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <path
      d="M4 3h9l3 3v14a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 20V4.5A1.5 1.5 0 014 3z"
      stroke="url(#goldGradientResearchSignup)"
      strokeWidth="1.35"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M13 3v3h3" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    <line x1="6" y1="9.5" x2="12" y2="9.5" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="6" y1="12" x2="11" y2="12" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="6" y1="14.5" x2="10" y2="14.5" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="16.5" cy="16.5" r="3.25" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.35" fill="none" />
    <path d="M18.8 18.8L21.5 21.5" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CONSUMER_SIGNUP_ENABLED = true;

type SignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** When the modal opens, pre-select this plan (pricing buttons, /home?account=). Null = user chooses. */
  defaultSelectedPlan?: ConsumerVsCommercial | null;
};

export default function SignupModal({
  isOpen,
  onClose,
  defaultSelectedPlan = null,
}: SignupModalProps) {
  const consumerPlan = SUBSCRIPTION_PLAN_CONTENT.consumer;
  const commercialPlan = SUBSCRIPTION_PLAN_CONTENT.commercial;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const signaturePadRef = useRef<SignupSignaturePadHandle>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ConsumerVsCommercial | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedPlan(defaultSelectedPlan ?? null);
  }, [isOpen, defaultSelectedPlan]);

  const canSubmit = useMemo(() => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      return false;
    }
    if (password.length < 6 || password !== confirmPassword) return false;
    if (!selectedPlan || !hasSignature) return false;
    return true;
  }, [firstName, lastName, email, password, confirmPassword, selectedPlan, hasSignature]);

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

    const signatureDataUrl = signaturePadRef.current?.toDataURL();
    if (!signatureDataUrl) {
      setError("Please draw your signature in the box below to continue.");
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

    if (!selectedPlan) {
      setError("Please select Free Consumer Subscription or Standard Annual Subscription");
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
          consumer_vs_commercial: selectedPlan,
          signaturePngBase64: signatureDataUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const base = data.error || "Failed to create account";
        const detail =
          typeof data.details === "string" && data.details.trim() !== ""
            ? `\n\n${data.details.trim()}`
            : "";
        setError(`${base}${detail}`);
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
      setHasSignature(false);
      signaturePadRef.current?.clear();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-10"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md border border-[#2B6B4A] bg-[#2B6B4A] px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-[#225a3d]"
          aria-label="Close"
        >
          X Close
        </button>

        <h2
          id="signup-modal-title"
          className="mb-6 pr-28 text-xl font-semibold whitespace-nowrap text-zinc-900"
        >
          Join the Grocery-Share family!
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
                  <span className="text-red-600" aria-hidden>
                    *
                  </span>{" "}
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
                  <span className="text-red-600" aria-hidden>
                    *
                  </span>{" "}
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
                <span className="text-red-600" aria-hidden>
                  *
                </span>{" "}
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
                <span className="text-red-600" aria-hidden>
                  *
                </span>{" "}
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
                <span className="text-red-600" aria-hidden>
                  *
                </span>{" "}
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

            <div className="mt-4 space-y-3" role="group" aria-labelledby="signup-plan-heading">
              <p id="signup-plan-heading" className="text-sm font-medium text-zinc-700">
                <span className="text-red-600" aria-hidden>
                  *
                </span>{" "}
                Choose a subscription
              </p>
              {CONSUMER_SIGNUP_ENABLED ? (
                <button
                  type="button"
                  onClick={() => setSelectedPlan("consumer")}
                  className={`group relative block w-full rounded-lg border p-4 text-left shadow-sm transition-colors ${
                    selectedPlan === "consumer"
                      ? "border-[#2B6B4A] bg-[#2B6B4A]"
                      : "border-zinc-200 bg-white hover:border-[#2B6B4A] hover:bg-[#2B6B4A]"
                  }`}
                >
                  {selectedPlan === "consumer" && (
                    <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-5xl font-black tracking-[0.2em] text-white/35 [transform:rotate(-24deg)]">
                      SELECTED
                    </span>
                  )}
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center justify-center">
                      <GoldResearchIcon />
                    </div>
                    <h3 className={`mb-2 text-center text-base font-bold ${selectedPlan === "consumer" ? "text-white" : "text-zinc-900 group-hover:text-white"}`}>
                      {consumerPlan.title}
                    </h3>
                    <p className={`mb-3 text-center text-xs leading-relaxed ${selectedPlan === "consumer" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                      {consumerPlan.description}
                    </p>
                    <ul className={`space-y-1.5 text-sm ${selectedPlan === "consumer" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                      {consumerPlan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className={`mr-2 ${selectedPlan === "consumer" ? "text-white" : "text-green-500 group-hover:text-white"}`}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-100 p-4 shadow-none" aria-disabled="true">
                  <div className="mb-3 flex items-center justify-center opacity-45 grayscale">
                    <GoldResearchIcon />
                  </div>
                  <h3 className="mb-2 text-center text-base font-bold text-zinc-500">
                    {consumerPlan.title}
                  </h3>
                  <p className="mb-3 text-center text-xs leading-relaxed text-zinc-500">
                    {consumerPlan.description}
                  </p>
                  <ul className="space-y-1.5 text-sm text-zinc-500">
                    {consumerPlan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className="mr-2 text-zinc-400">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedPlan("commercial")}
                className={`group relative block w-full rounded-lg border p-4 text-left shadow-sm transition-colors ${
                  selectedPlan === "commercial"
                    ? "border-[#2B6B4A] bg-[#2B6B4A]"
                    : "border-zinc-200 bg-white hover:border-[#2B6B4A] hover:bg-[#2B6B4A]"
                }`}
              >
                {selectedPlan === "commercial" && (
                  <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-5xl font-black tracking-[0.2em] text-white/35 [transform:rotate(-24deg)]">
                    SELECTED
                  </span>
                )}
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-center">
                    <GoldGroceryIcon />
                  </div>
                  <h3 className={`mb-2 text-center text-base font-bold ${selectedPlan === "commercial" ? "text-white" : "text-zinc-900 group-hover:text-white"}`}>
                    {commercialPlan.title}
                  </h3>
                  <p className={`mb-4 text-center text-xs leading-relaxed ${selectedPlan === "commercial" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                    {commercialPlan.description}
                  </p>
                  <div className="mb-4 text-center">
                    <span
                      className={`text-lg font-bold ${selectedPlan === "commercial" ? "text-white" : "text-zinc-900 group-hover:text-white"} ${commercialPlan.durationLabelStrikethrough ? `line-through decoration-2 ${selectedPlan === "commercial" ? "decoration-white/70" : "decoration-zinc-400 group-hover:decoration-white/70"}` : ""}`}
                    >
                      {commercialPlan.durationLabel}
                    </span>
                  </div>
                  <ul className={`mb-4 space-y-2 text-sm ${selectedPlan === "commercial" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                    {commercialPlan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className={`mr-2 ${selectedPlan === "commercial" ? "text-white" : "text-green-500 group-hover:text-white"}`}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-center">
                    <span
                      className={`inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] transition-colors ${
                        selectedPlan === "commercial"
                          ? "bg-yellow-300 text-[#1f4d35]"
                          : "bg-yellow-200 text-[#2B6B4A] group-hover:bg-yellow-300 group-hover:text-[#1f4d35]"
                      } animate-pulse shadow-[0_0_20px_rgba(253,224,71,0.95)]`}
                    >
                      {commercialPlan.trialBadgeLabel}
                    </span>
                  </p>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs leading-relaxed text-zinc-700">
                I will digitally sign to confirm that I have read and agree to the{" "}
                <Link
                  href="/legal#privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  privacy policy
                </Link>
                ,{" "}
                <Link
                  href="/legal#terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  terms of service
                </Link>
                ,{" "}
                <Link
                  href="/legal#disclaimer-consumer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  disclaimer for the consumer section
                </Link>
                , and{" "}
                <Link
                  href="/legal#disclaimer-commercial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  disclaimer for the commercial section
                </Link>{" "}
                (if applicable).
              </p>
              <SignupSignaturePad
                ref={signaturePadRef}
                onHasDrawingChange={setHasSignature}
              />
            </div>

            {error && (
              <p className="whitespace-pre-line text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-zinc-100 disabled:hover:bg-zinc-400"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
