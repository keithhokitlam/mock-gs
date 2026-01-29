import NavBar from "../components/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
            Contact
          </h1>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            Get in touch for general inquiries, partnership opportunities, or feedback about GroceryShare.
          </p>

          <div className="mb-6 space-y-4 text-base leading-relaxed text-zinc-700">
            <p className="font-semibold text-zinc-900">Contact methods</p>
            <p>
              <strong>General inquiries:</strong>{" "}
              <a
                href="mailto:info@grocery-share.com"
                className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
              >
                info@grocery-share.com
              </a>
            </p>
            <p>
              <strong>Technical support:</strong>{" "}
              <a
                href="mailto:support@grocery-share.com"
                className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
              >
                support@grocery-share.com
              </a>
            </p>
          </div>

          <p className="text-base leading-relaxed text-zinc-700">
            We typically respond within 24–48 hours (business days).
          </p>
        </div>
      </main>
    </div>
  );
}
