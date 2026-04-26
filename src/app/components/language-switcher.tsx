"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function withQuery(path: string, query: string) {
  return query ? `${path}?${query}` : path;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const isChinese = pathname === "/zh" || pathname.startsWith("/zh/");

  const englishPath = isChinese ? pathname.replace(/^\/zh(?=\/|$)/, "") || "/" : pathname;
  const chinesePath = isChinese ? pathname : `/zh${pathname === "/" ? "/home" : pathname}`;

  return (
    <div className="fixed right-4 top-3 z-[300] rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 shadow-sm backdrop-blur">
      <Link
        href={withQuery(englishPath, query)}
        className={isChinese ? "hover:text-[#2B6B4A]" : "text-[#2B6B4A]"}
      >
        English
      </Link>
      <span className="mx-2 text-zinc-400">|</span>
      <Link
        href={withQuery(chinesePath, query)}
        className={isChinese ? "text-[#2B6B4A]" : "hover:text-[#2B6B4A]"}
      >
        Chinese
      </Link>
    </div>
  );
}
