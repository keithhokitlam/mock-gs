"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "./language-switcher";

type NavLocale = "en" | "zh";

const NAV_COPY = {
  en: {
    homeLabel: "Go to home",
    about: "About",
    pricing: "Pricing",
    fmcgIndustryPage: "FMCG Industry Page",
    foodCategory: "FOOD CATEGORY",
    recipes: "RECIPES",
    quizzes: "QUIZZES",
    support: "Support",
    contact: "Contact",
    faq: "FAQ",
    accountDetails: "Account Details",
    accountType: "Account Type:",
    admin: "Admin",
    essential: "Essential",
    premium: "Premium",
    subscriptionEnds: "Subscription ends:",
    free: "free",
    unlimited: "Unlimited",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    hide: "Hide",
    show: "Show",
    changing: "Changing...",
    cancel: "Cancel",
    cancelSubscription: "Cancel Subscription",
    cancellingSubscription: "Cancelling...",
    cancelSubscriptionConfirm:
      "Are you sure you want to cancel your subscription? Continuing will terminate your account. If it is a Premium (paid) account, the unused amount cannot be refunded. Reactivation will require signing up again.",
    keepSubscription: "Keep Subscription",
    confirmCancelSubscription: "Yes, Cancel Subscription",
    cancelSubscriptionSuccess:
      "Your subscription has been cancelled. You will be signed out now.",
    cancelSubscriptionFailed: "Failed to cancel subscription",
    signOut: "Sign out",
    allFieldsRequired: "All fields are required",
    passwordMin: "New password must be at least 6 characters",
    passwordMismatch: "New passwords do not match",
    passwordChanged: "Password changed successfully!",
    passwordChangeFailed: "Failed to change password",
    genericError: "An error occurred. Please try again.",
  },
  zh: {
    homeLabel: "返回首页",
    about: "关于我们",
    pricing: "价格方案",
    fmcgIndustryPage: "快消品行业页面",
    foodCategory: "食品分类",
    recipes: "食谱",
    quizzes: "趣味测验",
    support: "支持",
    contact: "联系我们",
    faq: "常见问题",
    accountDetails: "账户信息",
    accountType: "账户类型：",
    admin: "管理员",
    essential: "Essential 基础会员",
    premium: "Premium 高级会员",
    subscriptionEnds: "会员到期日：",
    free: "免费",
    unlimited: "不限期",
    changePassword: "修改密码",
    currentPassword: "当前密码",
    newPassword: "新密码",
    confirmNewPassword: "确认新密码",
    hide: "隐藏",
    show: "显示",
    changing: "正在修改...",
    cancel: "取消",
    cancelSubscription: "取消会员",
    cancellingSubscription: "正在取消...",
    cancelSubscriptionConfirm:
      "确定要取消会员吗？继续操作将终止你的账户。如果是 Premium（付费）账户，未使用金额无法退款。如需重新启用，需要重新注册。",
    keepSubscription: "保留会员",
    confirmCancelSubscription: "确认取消会员",
    cancelSubscriptionSuccess: "你的会员已取消。现在将退出登录。",
    cancelSubscriptionFailed: "取消会员失败",
    signOut: "退出登录",
    allFieldsRequired: "请填写所有字段",
    passwordMin: "新密码至少需要 6 个字符",
    passwordMismatch: "两次输入的新密码不一致",
    passwordChanged: "密码已成功修改！",
    passwordChangeFailed: "修改密码失败",
    genericError: "发生错误，请再试一次。",
  },
} as const;

/** `subscriptionEndDate` from API: YYYY-MM-DD or null (no end date). */
function formatSubscriptionEndDate(
  isoDate: string | null,
  locale: NavLocale,
  unlimitedLabel: string
): string {
  if (!isoDate) return unlimitedLabel;
  const [y, m, d] = isoDate.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return isoDate;
  const local = new Date(y, m - 1, d);
  return local.toLocaleDateString(locale === "zh" ? "zh-CN" : undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<"essential" | "premium" | "admin" | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCancelSubscriptionConfirm, setShowCancelSubscriptionConfirm] = useState(false);
  const [cancelSubscriptionError, setCancelSubscriptionError] = useState("");
  const [cancelSubscriptionLoading, setCancelSubscriptionLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [navMode, setNavMode] = useState<"commercial" | "consumer">("consumer");
  const locale: NavLocale = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
  const copy = NAV_COPY[locale];

  /** Login landing (/ and /home share the same page as /home) */
  const isLoginHomePath = pathname === "/home" || pathname === "/" || pathname === "/zh/home";

  const isPublicInfoPage =
    pathname === "/about" ||
    pathname === "/pricing" ||
    pathname === "/support" ||
    pathname === "/contact" ||
    pathname === "/faq" ||
    pathname === "/legal" ||
    pathname === "/zh/home";

  /** Hide FMCG Industry Page + FOOD CATEGORY on login, and on info pages when logged out */
  const hideNavDestinations =
    isLoginHomePath || (!userEmail && isPublicInfoPage);

  /** Signed-in accounts: show FMCG Industry Page and Food Category to all membership types. */
  const showFoodCategoryNav =
    (!!userEmail &&
      (accountType === "essential" ||
        accountType === "premium" ||
        accountType === "admin")) ||
    !hideNavDestinations;

  const showFmcgIndustryNav =
    !!userEmail &&
    (accountType === "essential" ||
      accountType === "premium" ||
      accountType === "admin");

  const isExplicitCommercial =
    pathname === "/" ||
    pathname === "/home" ||
    pathname === "/commercialhome" ||
    pathname === "/pricing" ||
    pathname === "/subscriptions" ||
    pathname.startsWith("/subscriptions/");
  const isExplicitConsumer = pathname === "/consumer";
  const isSharedPage = !isExplicitCommercial && !isExplicitConsumer;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isExplicitCommercial) {
      sessionStorage.setItem("navMode", "commercial");
      setNavMode("commercial");
    } else if (isExplicitConsumer) {
      sessionStorage.setItem("navMode", "consumer");
      setNavMode("consumer");
    } else if (isSharedPage) {
      const stored = sessionStorage.getItem("navMode");
      setNavMode(stored === "commercial" ? "commercial" : "consumer");
    }
  }, [pathname, isExplicitCommercial, isExplicitConsumer, isSharedPage]);

  useEffect(() => {
    // Fetch current user email (credentials include so session cookie is sent on all pages)
    fetch("/api/auth/current-user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setUserEmail(data.email);
          setAccountType(data.accountType ?? null);
          setSubscriptionId(typeof data.subscriptionId === "string" ? data.subscriptionId : null);
          setSubscriptionStatus(
            typeof data.subscriptionStatus === "string" ? data.subscriptionStatus : null
          );
          const end =
            typeof data.subscriptionEndDate === "string"
              ? data.subscriptionEndDate
              : null;
          setSubscriptionEndDate(end);
        } else {
          // If no user email and we're on an admin page, it's likely admin/admin
          const isAdminPage =
            pathname === "/mastertable" ||
            pathname === "/fmcgindustrypage" ||
            pathname === "/subscriptions";
          setUserEmail(isAdminPage ? "ADMIN" : null);
          setAccountType(isAdminPage ? "admin" : null);
          setSubscriptionId(null);
          setSubscriptionStatus(null);
          setSubscriptionEndDate(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching user email:", err);
        // On error, check if we're on admin page
        const isAdminPage =
          pathname === "/mastertable" ||
          pathname === "/fmcgindustrypage" ||
          pathname === "/subscriptions";
        setUserEmail(isAdminPage ? "ADMIN" : null);
        setAccountType(isAdminPage ? "admin" : null);
        setSubscriptionId(null);
        setSubscriptionStatus(null);
        setSubscriptionEndDate(null);
      });
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // Still clear UI if the request fails
    }
    setUserEmail(null);
    setAccountType(null);
    setSubscriptionId(null);
    setSubscriptionStatus(null);
    setSubscriptionEndDate(null);
    setShowDropdown(false);
    setShowChangePassword(false);
    setShowCancelSubscriptionConfirm(false);
    router.push("/home");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(copy.allFieldsRequired);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(copy.passwordMin);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(copy.passwordMismatch);
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || copy.passwordChangeFailed);
        setPasswordLoading(false);
        return;
      }

      setPasswordSuccess(copy.passwordChanged);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordLoading(false);
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess("");
      }, 2000);
    } catch {
      setPasswordError(copy.genericError);
      setPasswordLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelSubscriptionError("");

    if (!subscriptionId) {
      setCancelSubscriptionError(copy.cancelSubscriptionFailed);
      return;
    }

    setCancelSubscriptionLoading(true);

    try {
      const response = await fetch("/api/subscriptions/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subscription_id: subscriptionId,
          status: "cancelled",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || copy.cancelSubscriptionFailed);
      }

      alert(copy.cancelSubscriptionSuccess);
      await handleSignOut();
    } catch (err) {
      setCancelSubscriptionError(
        err instanceof Error ? err.message : copy.cancelSubscriptionFailed
      );
    } finally {
      setCancelSubscriptionLoading(false);
    }
  };

  const isAdmin = userEmail === "ADMIN";
  const isCommercialPage = isExplicitCommercial || (isSharedPage && navMode === "commercial");
  const isConsumerPage = !isCommercialPage;

  /** Logged-out: consumer vs commercial landing; signed-in: always use full Food Category page. */
  const foodCategoryHref = userEmail
    ? locale === "zh"
      ? "/zh/foodcategory"
      : "/foodcategory"
    : isConsumerPage
      ? locale === "zh"
        ? "/zh/consumer"
        : "/consumer"
      : locale === "zh"
        ? "/zh/foodcategory"
        : "/foodcategory";

  return (
    <nav className="w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
      <div className="flex w-full items-center justify-between gap-4 px-2 py-0">
        <div className="flex items-center gap-4">
          <Link href={locale === "zh" ? "/zh/home" : "/"} aria-label={copy.homeLabel}>
            <Image
              src="/logos/Grocery-Share Logo.png"
              alt="Grocery-Share"
              width={48}
              height={48}
              className="h-12 w-auto translate-y-[2px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-12 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            <Link href={locale === "zh" ? "/zh/about" : "/about"} className="font-beckman hover:opacity-80">
              {copy.about}
            </Link>
            {isCommercialPage && (
              <Link href={locale === "zh" ? "/zh/pricing" : "/pricing"} className="font-beckman hover:opacity-80">
                {copy.pricing}
              </Link>
            )}
            {showFmcgIndustryNav && (
              <Link href={locale === "zh" ? "/zh/fmcgindustrypage" : "/fmcgindustrypage"} className="font-beckman hover:opacity-80">
                {copy.fmcgIndustryPage}
              </Link>
            )}
            {showFoodCategoryNav && (
              <Link href={foodCategoryHref} className="font-beckman hover:opacity-80">
                {copy.foodCategory}
              </Link>
            )}
            {isConsumerPage && (
              <>
                <span className="font-beckman cursor-default">{copy.recipes}</span>
                <span className="font-beckman cursor-default">{copy.quizzes}</span>
              </>
            )}
            <Link href={locale === "zh" ? "/zh/support" : "/support"} className="font-beckman hover:opacity-80">
              {copy.support}
            </Link>
            <Link href={locale === "zh" ? "/zh/contact" : "/contact"} className="font-beckman hover:opacity-80">
              {copy.contact}
            </Link>
            <Link href={locale === "zh" ? "/zh/faq" : "/faq"} className="font-beckman hover:opacity-80">
              {copy.faq}
            </Link>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Suspense fallback={null}>
            <LanguageSwitcher className="whitespace-nowrap rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 shadow-sm backdrop-blur" />
          </Suspense>
          {userEmail && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="cursor-pointer whitespace-nowrap text-xs text-white hover:opacity-80 font-beckman"
              >
                {userEmail}
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-zinc-200 p-4 z-50">
                <div className="space-y-4">
                  {/* Account Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">{copy.accountDetails}</h3>
                    <p className="text-sm text-zinc-600">{isAdmin ? "ADMIN" : userEmail}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {copy.accountType}{" "}
                      {accountType === "essential"
                        ? copy.essential
                        : accountType === "admin"
                        ? copy.admin
                        : copy.premium}
                    </p>
                    {!isAdmin && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {copy.subscriptionEnds}{" "}
                        <span className="font-medium text-zinc-700">
                          {accountType === "essential"
                            ? copy.free
                            : formatSubscriptionEndDate(subscriptionEndDate, locale, copy.unlimited)}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Change Password */}
                  {!isAdmin && (
                    <>
                      {!showChangePassword ? (
                        <button
                          onClick={() => setShowChangePassword(true)}
                          className="w-full text-left text-sm text-[#2B6B4A] hover:underline"
                        >
                          {copy.changePassword}
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-zinc-900">{copy.changePassword}</h4>
                          <form onSubmit={handleChangePassword} className="space-y-3">
                            <div>
                              <label className="text-xs text-zinc-700 mb-1 block">{copy.currentPassword}</label>
                              <div className="relative">
                                <input
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  className="w-full rounded border border-zinc-300 px-3 py-2 text-sm pr-10"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500"
                                >
                                  {showCurrentPassword ? copy.hide : copy.show}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-700 mb-1 block">{copy.newPassword}</label>
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="w-full rounded border border-zinc-300 px-3 py-2 text-sm pr-10"
                                  required
                                  minLength={6}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500"
                                >
                                  {showNewPassword ? copy.hide : copy.show}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-700 mb-1 block">{copy.confirmNewPassword}</label>
                              <div className="relative">
                                <input
                                  type={showConfirmPassword ? "text" : "password"}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="w-full rounded border border-zinc-300 px-3 py-2 text-sm pr-10"
                                  required
                                  minLength={6}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500"
                                >
                                  {showConfirmPassword ? copy.hide : copy.show}
                                </button>
                              </div>
                            </div>
                            {passwordError && (
                              <p className="text-xs text-red-600">{passwordError}</p>
                            )}
                            {passwordSuccess && (
                              <p className="text-xs text-green-600">{passwordSuccess}</p>
                            )}
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex-1 rounded bg-[#2B6B4A] px-3 py-2 text-sm text-white hover:bg-[#225a3d] disabled:opacity-50"
                              >
                                {passwordLoading ? copy.changing : copy.changePassword}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowChangePassword(false);
                                  setPasswordError("");
                                  setPasswordSuccess("");
                                  setCurrentPassword("");
                                  setNewPassword("");
                                  setConfirmPassword("");
                                }}
                                className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                              >
                                {copy.cancel}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  )}

                  {!isAdmin && subscriptionStatus !== "cancelled" && (
                    <div className="space-y-2">
                      {!showCancelSubscriptionConfirm ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCancelSubscriptionError("");
                            setShowCancelSubscriptionConfirm(true);
                          }}
                          className="w-full text-left text-sm text-[#2B6B4A] hover:underline"
                        >
                          {copy.cancelSubscription}
                        </button>
                      ) : (
                        <div className="rounded border border-red-200 bg-red-50 p-3">
                          <p className="text-sm text-red-800">
                            {copy.cancelSubscriptionConfirm}
                          </p>
                          {cancelSubscriptionError && (
                            <p className="mt-2 text-xs text-red-700">
                              {cancelSubscriptionError}
                            </p>
                          )}
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCancelSubscriptionConfirm(false);
                                setCancelSubscriptionError("");
                              }}
                              disabled={cancelSubscriptionLoading}
                              className="rounded border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-white disabled:opacity-50"
                            >
                              {copy.keepSubscription}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleCancelSubscription()}
                              disabled={cancelSubscriptionLoading}
                              className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              {cancelSubscriptionLoading
                                ? copy.cancellingSubscription
                                : copy.confirmCancelSubscription}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-zinc-200 pt-3">
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="w-full text-left text-sm font-semibold text-red-600 hover:underline"
                    >
                      {copy.signOut}
                    </button>
                  </div>
                </div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
