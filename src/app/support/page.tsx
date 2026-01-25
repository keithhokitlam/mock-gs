import Image from "next/image";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <nav className="w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
        <div className="flex w-full items-center gap-4 px-2 py-0">
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
            <Link href="/support" className="font-beckman hover:opacity-80">
              Support
            </Link>
            <span className="font-beckman">FAQ</span>
          </div>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900">Support</h1>
          <p
            className="text-base leading-relaxed text-zinc-700"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            If you are experiencing any issues please contact{" "}
            <a
              href="mailto:support@grocery-share.com"
              className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
            >
              support@grocery-share.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
