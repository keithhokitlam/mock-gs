"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ArrowUp = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

export default function FoodCategoryGoToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isFoodCategoryRoute = pathname === "/foodcategory";

  useEffect(() => {
    if (!isFoodCategoryRoute) return;
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFoodCategoryRoute]);

  if (!isFoodCategoryRoute || !visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-lg transition hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      aria-label="Go to top of page"
    >
      <ArrowUp />
      Go to Top
    </button>
  );
}
