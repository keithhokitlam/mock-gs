"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getSubscriptionPlanContent,
  type MembershipTier,
  type SubscriptionContentLocale,
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

/** Document + magnifying glass — research / discovery vibe (essential tier) */
const GoldResearchIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="goldGradientResearchSignup" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="14" height="16" rx="2" fill="url(#goldGradientResearchSignup)" opacity="0.2" />
    <path d="M6 2.8h8.5L18 6.3V19a2 2 0 01-2 2H6a2 2 0 01-2-2V4.8a2 2 0 012-2z" fill="url(#goldGradientResearchSignup)" opacity="0.12" />
    <path d="M6 2.8h8.5L18 6.3V19a2 2 0 01-2 2H6a2 2 0 01-2-2V4.8a2 2 0 012-2z" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.35" strokeLinejoin="round" />
    <path d="M14.5 2.8v3.5H18" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.25" strokeLinejoin="round" />
    <rect x="6.4" y="8" width="5.4" height="6.8" rx="0.8" fill="url(#goldGradientResearchSignup)" opacity="0.85" />
    <rect x="12.6" y="10.2" width="2.4" height="4.6" rx="0.6" fill="url(#goldGradientResearchSignup)" opacity="0.65" />
    <rect x="15.7" y="7.8" width="2.2" height="7" rx="0.6" fill="url(#goldGradientResearchSignup)" opacity="0.45" />
    <path d="M6.4 17h7.3" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.15" strokeLinecap="round" />
    <circle cx="16.6" cy="16.8" r="3.1" fill="#fff7d6" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.4" />
    <path d="M18.8 19l2.2 2.2" stroke="url(#goldGradientResearchSignup)" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const CONSUMER_SIGNUP_ENABLED = true;

const SIGNUP_COPY = {
  en: {
    close: "X Close",
    title: "Join the Grocery-Share family!",
    success:
      "You're in! Check your email to verify your account—then you're all set to start exploring.",
    firstName: "First Name",
    firstNamePlaceholder: "First name",
    lastName: "Last Name",
    lastNamePlaceholder: "Last name",
    company: "Company",
    email: "Email",
    password: "Password",
    passwordHint: "Password must be 6 or more characters",
    confirmPassword: "Confirm Password",
    chooseSubscription: "Choose a subscription",
    selected: "SELECTED",
    legalIntro: "Please review and agree to the",
    privacy: "privacy policy",
    terms: "terms of service",
    consumerDisclaimer: "disclaimer for the consumer section",
    commercialDisclaimer: "disclaimer for the commercial section",
    ifApplicable: "(if applicable).",
    legalCheckbox:
      "I have read and agree to the Privacy Policy, Terms of Service, Consumer Disclaimer, and Commercial Disclaimer, if applicable.",
    incomplete: "All required fields have not been filled.",
    creating: "Creating account...",
    submit: "Sign up",
    closeButton: "Close",
    errors: {
      required: "All required fields must be filled in",
      passwordMin: "Password must be at least 6 characters",
      passwordMismatch: "Passwords do not match",
      plan: "Please select Essential Membership or Premium Membership",
      legal: "Please agree to the legal terms before continuing.",
      createFailed: "Failed to create account",
      generic: "An error occurred. Please try again.",
    },
  },
  zh: {
    close: "X 关闭",
    title: "加入 Grocery-Share 大家庭！",
    success: "注册成功！请查看邮箱并验证账号，然后就可以开始探索啦。",
    firstName: "名字",
    firstNamePlaceholder: "名字",
    lastName: "姓氏",
    lastNamePlaceholder: "姓氏",
    company: "公司",
    email: "邮箱",
    password: "密码",
    passwordHint: "密码至少需要 6 个字符",
    confirmPassword: "确认密码",
    chooseSubscription: "选择会员方案",
    selected: "已选择",
    legalIntro: "请查看并同意",
    privacy: "隐私政策",
    terms: "服务条款",
    consumerDisclaimer: "消费者专区免责声明",
    commercialDisclaimer: "商业专区免责声明",
    ifApplicable: "（如适用）。",
    legalCheckbox: "我已阅读并同意隐私政策、服务条款、消费者专区免责声明以及商业专区免责声明（如适用）。",
    incomplete: "所有必填项尚未填写。",
    creating: "正在创建账号...",
    submit: "注册",
    closeButton: "关闭",
    errors: {
      required: "请填写所有必填项",
      passwordMin: "密码至少需要 6 个字符",
      passwordMismatch: "两次输入的密码不一致",
      plan: "请选择 Essential 基础会员或 Premium 高级会员",
      legal: "请先同意法律条款后再继续。",
      createFailed: "创建账号失败",
      generic: "发生错误，请再试一次。",
    },
  },
} as const;

type SignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** When the modal opens, pre-select this plan (pricing buttons, /home?account=). Null = user chooses. */
  defaultSelectedPlan?: MembershipTier | null;
  locale?: SubscriptionContentLocale;
};

export default function SignupModal({
  isOpen,
  onClose,
  defaultSelectedPlan = null,
  locale = "en",
}: SignupModalProps) {
  const copy = SIGNUP_COPY[locale];
  const planContent = getSubscriptionPlanContent(locale);
  const essentialPlan = planContent.essential;
  const premiumPlan = planContent.premium;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipTier | null>(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedPlan(defaultSelectedPlan ?? null);
  }, [isOpen, defaultSelectedPlan]);

  const canSubmit = useMemo(() => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      return false;
    }
    if (password.length < 6 || password !== confirmPassword) return false;
    if (!selectedPlan || !acceptedLegal) return false;
    return true;
  }, [firstName, lastName, email, password, confirmPassword, selectedPlan, acceptedLegal]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError(copy.errors.required);
      return;
    }

    if (password.length < 6) {
      setError(copy.errors.passwordMin);
      return;
    }

    if (password !== confirmPassword) {
      setError(copy.errors.passwordMismatch);
      return;
    }

    if (!selectedPlan) {
      setError(copy.errors.plan);
      return;
    }

    if (!acceptedLegal) {
      setError(copy.errors.legal);
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
          essential_vs_premium: selectedPlan,
          acceptedLegal,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const base = data.error || copy.errors.createFailed;
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
      setAcceptedLegal(false);
    } catch {
      setError(copy.errors.generic);
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
          {copy.close}
        </button>

        <h2
          id="signup-modal-title"
          className="mb-6 pr-28 text-xl font-semibold whitespace-nowrap text-zinc-900"
        >
          {copy.title}
        </h2>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600">
              {copy.success}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {copy.closeButton}
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
                  {copy.firstName}
                </label>
                <input
                  id="signup-firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={copy.firstNamePlaceholder}
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
                  {copy.lastName}
                </label>
                <input
                  id="signup-lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={copy.lastNamePlaceholder}
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
                {copy.company}
              </label>
              <input
                id="signup-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={copy.company}
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
                {copy.email}
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
                {copy.password}
              </label>
              <p className="text-xs text-zinc-500">
                {copy.passwordHint}
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
                {copy.confirmPassword}
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
                {copy.chooseSubscription}
              </p>
              {CONSUMER_SIGNUP_ENABLED ? (
                <button
                  type="button"
                  onClick={() => setSelectedPlan("essential")}
                  className={`group relative block w-full rounded-lg border p-4 text-left shadow-sm transition-colors ${
                    selectedPlan === "essential"
                      ? "border-[#2B6B4A] bg-[#2B6B4A]"
                      : "border-zinc-200 bg-white hover:border-[#2B6B4A] hover:bg-[#2B6B4A]"
                  }`}
                >
                  {selectedPlan === "essential" && (
                    <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-5xl font-black tracking-[0.2em] text-white/35 [transform:rotate(-24deg)]">
                      {copy.selected}
                    </span>
                  )}
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center justify-center">
                      <GoldResearchIcon />
                    </div>
                    <h3 className={`mb-2 text-center text-base font-bold ${selectedPlan === "essential" ? "text-white" : "text-zinc-900 group-hover:text-white"}`}>
                      {essentialPlan.title}
                    </h3>
                    <p className={`mb-3 text-center text-xs leading-relaxed ${selectedPlan === "essential" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                      {essentialPlan.description}
                    </p>
                    <ul className={`space-y-1.5 text-sm ${selectedPlan === "essential" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                      {essentialPlan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className={`mr-2 ${selectedPlan === "essential" ? "text-white" : "text-green-500 group-hover:text-white"}`}>✓</span>
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
                    {essentialPlan.title}
                  </h3>
                  <p className="mb-3 text-center text-xs leading-relaxed text-zinc-500">
                    {essentialPlan.description}
                  </p>
                  <ul className="space-y-1.5 text-sm text-zinc-500">
                    {essentialPlan.features.map((feature) => (
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
                onClick={() => setSelectedPlan("premium")}
                className={`group relative block w-full rounded-lg border p-4 text-left shadow-sm transition-colors ${
                  selectedPlan === "premium"
                    ? "border-[#2B6B4A] bg-[#2B6B4A]"
                    : "border-zinc-200 bg-white hover:border-[#2B6B4A] hover:bg-[#2B6B4A]"
                }`}
              >
                {selectedPlan === "premium" && (
                  <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-5xl font-black tracking-[0.2em] text-white/35 [transform:rotate(-24deg)]">
                    {copy.selected}
                  </span>
                )}
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-center">
                    <GoldGroceryIcon />
                  </div>
                  <h3 className={`mb-2 text-center text-base font-bold ${selectedPlan === "premium" ? "text-white" : "text-zinc-900 group-hover:text-white"}`}>
                    {premiumPlan.title}
                  </h3>
                  <p className={`mb-4 text-center text-xs leading-relaxed ${selectedPlan === "premium" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                    {premiumPlan.description}
                  </p>
                  <div className="mb-4 text-center">
                    <span
                      className={`text-lg font-bold ${selectedPlan === "premium" ? "text-white" : "text-zinc-900 group-hover:text-white"} ${premiumPlan.durationLabelStrikethrough ? `line-through decoration-2 ${selectedPlan === "premium" ? "decoration-white/70" : "decoration-zinc-400 group-hover:decoration-white/70"}` : ""}`}
                    >
                      {premiumPlan.durationLabel}
                    </span>
                  </div>
                  <ul className={`mb-4 space-y-2 text-sm ${selectedPlan === "premium" ? "text-white" : "text-zinc-600 group-hover:text-white/90"}`}>
                    {premiumPlan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className={`mr-2 ${selectedPlan === "premium" ? "text-white" : "text-green-500 group-hover:text-white"}`}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-center">
                    <span
                      className={`inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] transition-colors ${
                        selectedPlan === "premium"
                          ? "bg-yellow-300 text-[#1f4d35]"
                          : "bg-yellow-200 text-[#2B6B4A] group-hover:bg-yellow-300 group-hover:text-[#1f4d35]"
                      } animate-pulse shadow-[0_0_20px_rgba(253,224,71,0.95)]`}
                    >
                      {premiumPlan.trialBadgeLabel}
                    </span>
                  </p>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs leading-relaxed text-zinc-700">
                {copy.legalIntro}{" "}
                <Link
                  href="/legal#privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  {copy.privacy}
                </Link>
                ,{" "}
                <Link
                  href="/legal#terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  {copy.terms}
                </Link>
                ,{" "}
                <Link
                  href="/legal#disclaimer-consumer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  {copy.consumerDisclaimer}
                </Link>
                , and{" "}
                <Link
                  href="/legal#disclaimer-commercial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2B6B4A] underline hover:no-underline"
                >
                  {copy.commercialDisclaimer}
                </Link>{" "}
                {copy.ifApplicable}
              </p>
              <label
                htmlFor="signup-legal-acceptance"
                className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700"
              >
                <input
                  id="signup-legal-acceptance"
                  type="checkbox"
                  checked={acceptedLegal}
                  onChange={(e) => setAcceptedLegal(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-[#2B6B4A]"
                />
                <span>
                  <span className="text-red-600" aria-hidden>
                    *
                  </span>{" "}
                  {copy.legalCheckbox}
                </span>
              </label>
            </div>

            {error && (
              <p className="whitespace-pre-line text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {!loading && !canSubmit && (
              <p className="text-sm font-medium text-red-600" role="alert">
                {copy.incomplete}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-zinc-100 disabled:hover:bg-zinc-400"
            >
              {loading ? copy.creating : copy.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
