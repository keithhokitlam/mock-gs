import Link from "next/link";
import NavBar from "../components/navbar";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1
            className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman"
          >
            Support
          </h1>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            We&apos;ve got your back! Got questions about your account,
            subscription, or access? We&apos;re here to help—and we love hearing
            from you.
          </p>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            If something&apos;s not quite right, reach out to{" "}
            <a
              href="mailto:support@grocery-share.com"
              className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
            >
              support@grocery-share.com
            </a>
          </p>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            We typically respond within 24–48 hours (business days).
          </p>

          <div className="text-base leading-relaxed text-zinc-700">
            <p className="mb-2 font-semibold text-zinc-900">Quick links</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <Link href="/faq" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  FAQ
                </Link>
                — Your go-to answers, served with a smile
              </li>
              <li>
                <Link href="/contact" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  Contact
                </Link>
                — We&apos;d love to hear from you
              </li>
              <li>
                <Link href="/" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  Forgot password?
                </Link>
                — Hit the Forgot Password button on the Sign In page
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
