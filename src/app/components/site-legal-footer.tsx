"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Site-wide legal links (footnote-style). Anchors match `/legal` sections. */
export default function SiteLegalFooter() {
  const pathname = usePathname();
  const isZh = pathname === "/zh" || pathname?.startsWith("/zh/");
  const linkClass =
    "text-[#2B6B4A] underline decoration-zinc-300 underline-offset-2 hover:no-underline";
  const legalHref = isZh ? "/zh/legal#legal-zh-cn" : "/legal";

  return (
    <footer
      className="mt-auto border-t border-zinc-200/80 bg-zinc-50 py-3 text-center text-[0.65rem] leading-relaxed text-zinc-500 sm:text-xs"
      aria-label={isZh ? "法律条款" : "Legal"}
    >
      <div className="mx-auto max-w-4xl px-3 sm:px-4">
        <p className="text-zinc-500">
          <Link href={isZh ? legalHref : "/legal#privacy-policy"} className={linkClass}>
            {isZh ? "隐私政策" : "Privacy policy"}
          </Link>
          <span className="text-zinc-300" aria-hidden>
            ,{" "}
          </span>
          <Link href={isZh ? legalHref : "/legal#terms-of-service"} className={linkClass}>
            {isZh ? "服务条款" : "Terms of service"}
          </Link>
          <span className="text-zinc-300" aria-hidden>
            ,{" "}
          </span>
          <Link href={isZh ? legalHref : "/legal#disclaimer-consumer"} className={linkClass}>
            {isZh ? "消费者专区免责声明" : "Disclaimer for the consumer section"}
          </Link>
          <span className="text-zinc-300" aria-hidden>
            {isZh ? "，以及 " : ", and "}
          </span>
          <Link href={isZh ? legalHref : "/legal#disclaimer-commercial"} className={linkClass}>
            {isZh ? "商业专区免责声明" : "Disclaimer for the commercial section"}
          </Link>
          <span className="text-zinc-400" aria-hidden>
            {" "}
            {isZh ? "（如适用）。" : "(if applicable)."}
          </span>
        </p>
      </div>
    </footer>
  );
}
