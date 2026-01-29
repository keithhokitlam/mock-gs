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
            We&apos;re here to help with account, subscription, and access issues.
          </p>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            If you are experiencing any issues please contact{" "}
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
                — Common questions and answers
              </li>
              <li>
                <Link href="/contact" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  Contact
                </Link>
                — General inquiries
              </li>
              <li>
                <Link href="/" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  Forgot password?
                </Link>
                — Use the Forgot Password button on the Sign In page
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
