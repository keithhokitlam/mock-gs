"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function CommercialNoticeInner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const show = searchParams.get("need_commercial") === "1";

  if (!show || dismissed) return null;

  return (
    <div className="mx-auto w-full max-w-[67rem] px-4 pt-4">
      <div
        className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        role="status"
      >
        <p>
          This requires Commercial subscription. You can{" "}
          <Link href="/pricing" className="font-semibold text-[#2B6B4A] underline hover:no-underline">
            sign up here
          </Link>
          !
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-xs font-semibold uppercase tracking-wide text-amber-900/80 hover:text-amber-950"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function CommercialNoticeBanner() {
  return (
    <Suspense fallback={null}>
      <CommercialNoticeInner />
    </Suspense>
  );
}
