"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CommercialNoticeInner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const show = searchParams.get("need_commercial") === "1";

  useEffect(() => {
    if (!show || dismissed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDismissed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [show, dismissed]);

  if (!show || dismissed) return null;

  const close = () => setDismissed(true);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[1px]"
        aria-label="Close dialog backdrop"
        onClick={close}
      />
      <div
        className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#2B6B4A]/25 bg-[#e8f4ec] px-6 pb-7 pt-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="commercial-notice-title"
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 rounded-md border border-[#2B6B4A] bg-[#2B6B4A] px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-[#225a3d]"
          aria-label="Close"
        >
          X Close
        </button>
        <p
          id="commercial-notice-title"
          className="mt-10 text-center text-sm leading-relaxed text-zinc-800 sm:mt-11"
        >
          This requires a Standard Annual Subscription. You can{" "}
          <Link
            href="/pricing"
            className="font-semibold text-[#2B6B4A] underline hover:no-underline"
            onClick={close}
          >
            sign up here
          </Link>
          !
        </p>
      </div>
    </>
  );
}

export default function CommercialNoticeBanner() {
  return (
    <Suspense fallback={null}>
      <CommercialNoticeInner />
    </Suspense>
  );
}
