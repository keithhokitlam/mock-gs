"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch current user email (credentials include so session cookie is sent on all pages)
    fetch("/api/auth/current-user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setUserEmail(data.email);
        } else {
          // If no user email and we're on an admin page, it's likely admin/admin
          const isAdminPage = pathname === "/mastertable" || pathname === "/subscriptions";
          setUserEmail(isAdminPage ? "ADMIN" : null);
        }
      })
      .catch((err) => {
        console.error("Error fetching user email:", err);
        // On error, check if we're on admin page
        const isAdminPage = pathname === "/mastertable" || pathname === "/subscriptions";
        setUserEmail(isAdminPage ? "ADMIN" : null);
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
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
        setPasswordError(data.error || "Failed to change password");
        setPasswordLoading(false);
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordLoading(false);
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (err) {
      setPasswordError("An error occurred. Please try again.");
      setPasswordLoading(false);
    }
  };

  const isAdmin = userEmail === "ADMIN";
  const isCommercialPage =
    pathname === "/commercialhome" ||
    pathname === "/mastertable" ||
    pathname.startsWith("/mastertable/") ||
    pathname === "/subscriptions" ||
    pathname.startsWith("/subscriptions/");
  const isConsumerPage = !isCommercialPage;

  return (
    <nav className="w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
      <div className="flex w-full items-center justify-between gap-4 px-2 py-0">
        <div className="flex items-center gap-4">
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
            <Link href="/about" className="font-beckman hover:opacity-80">
              About
            </Link>
            {isCommercialPage && (
              <Link href="/pricing" className="font-beckman hover:opacity-80">
                Pricing
              </Link>
            )}
            {userEmail && isCommercialPage && (
              <Link href="/mastertable" className="font-beckman hover:opacity-80">
                MASTER TABLE
              </Link>
            )}
            <Link href="/foodcategory" className="font-beckman hover:opacity-80">
              FOOD CATEGORY
            </Link>
            {isConsumerPage && (
              <>
                <span className="font-beckman cursor-default">RECIPES</span>
                <span className="font-beckman cursor-default">QUIZZES</span>
              </>
            )}
            <Link href="/support" className="font-beckman hover:opacity-80">
              Support
            </Link>
            <Link href="/contact" className="font-beckman hover:opacity-80">
              Contact
            </Link>
            <Link href="/faq" className="font-beckman hover:opacity-80">
              FAQ
            </Link>
          </div>
        </div>
        {userEmail && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-white font-beckman text-xs hover:opacity-80 cursor-pointer"
            >
              {userEmail}
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-zinc-200 p-4 z-50">
                <div className="space-y-4">
                  {/* Account Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Account Details</h3>
                    <p className="text-sm text-zinc-600">{isAdmin ? "ADMIN" : userEmail}</p>
                  </div>

                  {/* Change Password */}
                  {!isAdmin && (
                    <>
                      {!showChangePassword ? (
                        <button
                          onClick={() => setShowChangePassword(true)}
                          className="w-full text-left text-sm text-[#2B6B4A] hover:underline"
                        >
                          Change Password
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-zinc-900">Change Password</h4>
                          <form onSubmit={handleChangePassword} className="space-y-3">
                            <div>
                              <label className="text-xs text-zinc-700 mb-1 block">Current Password</label>
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
                                  {showCurrentPassword ? "Hide" : "Show"}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-700 mb-1 block">New Password</label>
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
                                  {showNewPassword ? "Hide" : "Show"}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-700 mb-1 block">Confirm New Password</label>
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
                                  {showConfirmPassword ? "Hide" : "Show"}
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
                                {passwordLoading ? "Changing..." : "Change Password"}
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
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  )}

                  {/* Stop Auto-Renewal (non-Alipay only) */}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        // Placeholder - will be implemented with Stripe integration
                        alert("Stop Auto-Renewal feature will be available after Stripe integration");
                      }}
                      className="w-full text-left text-sm text-[#2B6B4A] hover:underline"
                    >
                      Stop Auto-Renewal (non-Alipay only)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
