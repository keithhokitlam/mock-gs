"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ArrowUp = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

function getScrollY(): number {
  if (typeof window === "undefined") return 0;
  const el = document.scrollingElement ?? document.documentElement;
  return window.scrollY ?? el.scrollTop ?? document.body.scrollTop ?? 0;
}

/** Same long-form food category experience as /foodcategory */
const FOOD_CATEGORY_PATHS = new Set(["/foodcategory", "/consumer"]);

export default function FoodCategoryGoToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const showOnThisRoute = pathname != null && FOOD_CATEGORY_PATHS.has(pathname);

  const updateVisible = useCallback(() => {
    if (!showOnThisRoute) return;
    setVisible(getScrollY() > 80);
  }, [showOnThisRoute]);

  useEffect(() => {
    if (!showOnThisRoute) {
      setVisible(false);
      return;
    }

    updateVisible();

    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("scroll", updateVisible, opts);
    window.addEventListener("resize", updateVisible, opts);

    const t = window.setTimeout(updateVisible, 100);
    const raf = window.requestAnimationFrame(updateVisible);

    return () => {
      window.clearTimeout(t);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateVisible, opts);
      window.removeEventListener("resize", updateVisible, opts);
    };
  }, [showOnThisRoute, updateVisible]);

  if (!showOnThisRoute || !visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const el = document.scrollingElement ?? document.documentElement;
        el.scrollTo({ top: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-lg transition hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      aria-label="Go to top of page"
    >
      <ArrowUp />
      Go to Top
    </button>
  );
}
