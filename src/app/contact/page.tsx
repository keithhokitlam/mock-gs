import NavBar from "../components/navbar";

type ContactLocale = "en" | "zh";

const CONTACT_COPY = {
  en: {
    title: "Contact",
    intro:
      "We'd love to hear from you! Whether it's a question, a partnership idea, or just some feedback—drop us a line. We're all ears.",
    methods: "Contact methods",
    general: "General inquiries:",
    support: "Technical support:",
    response:
      "We typically respond within 24–48 hours (business days). Can't wait to connect!",
  },
  zh: {
    title: "联系我们",
    intro:
      "我们很期待收到你的消息！无论是问题、合作想法，还是反馈，都欢迎写给我们。我们洗耳恭听。",
    methods: "联系方式",
    general: "一般咨询：",
    support: "技术支持：",
    response: "我们通常会在 24–48 小时内回复（工作日）。期待与你联系！",
  },
} as const;

function ContactPageContent({ locale = "en" }: { locale?: ContactLocale }) {
  const copy = CONTACT_COPY[locale];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
            {copy.title}
          </h1>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            {copy.intro}
          </p>

          <div className="mb-6 space-y-4 text-base leading-relaxed text-zinc-700">
            <p className="font-semibold text-zinc-900">{copy.methods}</p>
            <p>
              {copy.general}{" "}
              <a
                href="mailto:info@grocery-share.com"
                className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
              >
                info@grocery-share.com
              </a>
            </p>
            <p>
              {copy.support}{" "}
              <a
                href="mailto:support@grocery-share.com"
                className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
              >
                support@grocery-share.com
              </a>
            </p>
          </div>

          <p className="text-base leading-relaxed text-zinc-700">
            {copy.response}
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ContactPage() {
  return <ContactPageContent />;
}
