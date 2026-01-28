import NavBar from "../components/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1
            className="mb-6 text-3xl font-semibold text-zinc-900"
            style={{ fontFamily: '"Beckman Free", Arial, Helvetica, sans-serif' }}
          >
            Contact
          </h1>
          <p
            className="text-base leading-relaxed text-zinc-700"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            For general inquiries, please contact{" "}
            <a
              href="mailto:info@grocery-share.com"
              className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
            >
              info@grocery-share.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
