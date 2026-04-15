import Link from "next/link";

/** Site-wide legal links (footnote-style). Anchors match `/legal` sections. */
export default function SiteLegalFooter() {
  const linkClass =
    "text-[#2B6B4A] underline decoration-zinc-300 underline-offset-2 hover:no-underline";

  return (
    <footer
      className="mt-auto border-t border-zinc-200/80 bg-zinc-50 py-3 text-center text-[0.65rem] leading-relaxed text-zinc-500 sm:text-xs"
      aria-label="Legal"
    >
      <div className="mx-auto max-w-4xl px-3 sm:px-4">
        <p className="text-zinc-500">
          <Link href="/legal#privacy-policy" className={linkClass}>
            Privacy policy
          </Link>
          <span className="text-zinc-300" aria-hidden>
            ,{" "}
          </span>
          <Link href="/legal#terms-of-service" className={linkClass}>
            Terms of service
          </Link>
          <span className="text-zinc-300" aria-hidden>
            ,{" "}
          </span>
          <Link href="/legal#disclaimer-consumer" className={linkClass}>
            Disclaimer for the consumer section
          </Link>
          <span className="text-zinc-300" aria-hidden>
            , and{" "}
          </span>
          <Link href="/legal#disclaimer-commercial" className={linkClass}>
            Disclaimer for the commercial section
          </Link>
          <span className="text-zinc-400" aria-hidden>
            {" "}
            (if applicable).
          </span>
        </p>
      </div>
    </footer>
  );
}
