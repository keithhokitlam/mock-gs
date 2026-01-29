"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch current user email
    fetch("/api/auth/current-user")
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
            <span className="font-beckman">About</span>
            <Link href="/pricing" className="font-beckman hover:opacity-80">
              Pricing
            </Link>
            <Link href="/support" className="font-beckman hover:opacity-80">
              Support
            </Link>
            <Link href="/contact" className="font-beckman hover:opacity-80">
              Contact
            </Link>
            <span className="font-beckman">FAQ</span>
          </div>
        </div>
        {userEmail && (
          <div className="text-white font-beckman text-xs">
            {userEmail}
          </div>
        )}
      </div>
    </nav>
  );
}
