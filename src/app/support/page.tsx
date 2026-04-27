import Link from "next/link";
import NavBar from "../components/navbar";

type SupportLocale = "en" | "zh";

const SUPPORT_COPY = {
  en: {
    title: "Support",
    intro:
      "We've got your back! Got questions about your account, subscription, or access? We're here to help—and we love hearing from you.",
    emailIntro: "If something's not quite right, reach out to",
    response: "We typically respond within 24–48 hours (business days).",
    quickLinks: "Quick links",
    faqText: "Your go-to answers, served with a smile",
    contactText: "We'd love to hear from you",
    forgotPassword: "Forgot password?",
    forgotText: "Hit the Forgot Password button on the Sign In page",
  },
  zh: {
    title: "支持",
    intro:
      "我们在这里支持你！如果你对账号、会员或访问权限有疑问，我们很乐意帮忙，也很期待听到你的声音。",
    emailIntro: "如果有哪里不太顺利，请联系",
    response: "我们通常会在 24–48 小时内回复（工作日）。",
    quickLinks: "快捷链接",
    faqText: "常见问题答案，轻松查找",
    contactText: "我们很期待收到你的消息",
    forgotPassword: "忘记密码？",
    forgotText: "请在登录页点击“忘记密码”按钮",
  },
} as const;

function SupportPageContent({ locale = "en" }: { locale?: SupportLocale }) {
  const copy = SUPPORT_COPY[locale];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1
            className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman"
          >
            {copy.title}
          </h1>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            {copy.intro}
          </p>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            {copy.emailIntro}{" "}
            <a
              href="mailto:support@grocery-share.com"
              className="text-[#2B6B4A] underline hover:text-[#1f4d35]"
            >
              support@grocery-share.com
            </a>
          </p>

          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            {copy.response}
          </p>

          <div className="text-base leading-relaxed text-zinc-700">
            <p className="mb-2 font-semibold text-zinc-900">{copy.quickLinks}</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <Link href={locale === "zh" ? "/zh/faq" : "/faq"} className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  FAQ
                </Link>
                — {copy.faqText}
              </li>
              <li>
                <Link href={locale === "zh" ? "/zh/contact" : "/contact"} className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  {locale === "zh" ? "联系我们" : "Contact"}
                </Link>
                — {copy.contactText}
              </li>
              <li>
                <Link href={locale === "zh" ? "/zh/home" : "/"} className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  {copy.forgotPassword}
                </Link>
                — {copy.forgotText}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SupportPage() {
  return <SupportPageContent />;
}
