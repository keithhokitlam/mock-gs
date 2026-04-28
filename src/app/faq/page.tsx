"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import NavBar from "../components/navbar";

type FAQItem = {
  question: string;
  answer: ReactNode;
};

type FAQLocale = "en" | "zh";

const FAQ_COPY = {
  en: { title: "FAQ" },
  zh: { title: "常见问题" },
} as const;

const faqDataByLocale: Record<FAQLocale, FAQItem[]> = {
  en: [
  {
    question: "How do I change my password?",
    answer: "Easy! Two ways:\n1) Click the 'Forgot Password' button on the sign-in page to receive a password reset link via email, or\n2) After logging in, click your email in the top right corner, then select 'Change Password' from the dropdown. We've got you covered!",
  },
  {
    question: "Once I purchase a subscription, can it be refunded?",
    answer: "Unfortunately, we can't offer refunds once a subscription is purchased. If you no longer wish to continue, you can cancel your subscription from your account menu.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "To cancel your subscription:\n1) Log in to your account\n2) Click your email address in the top-right corner\n3) Select 'Cancel Subscription' from the dropdown menu\n4) Review the confirmation message and confirm only if you want to proceed\n\nCancelling will terminate your Essential or Premium account. If you want to use Grocery-Share again later, you'll need to sign up for a new subscription.",
  },
  {
    question: "Why can't I log into my account?",
    answer: "A few things to check:\na) An email verification link was sent—have you clicked it? (Peek in spam/junk too!)\nb) If your subscription expired, you'll need to sign up again.\nc) Wrong password? No worries—hit 'Forgot Password' on the Sign In page to reset.",
  },
  {
    question: "I didn't receive my email verification link. What should I do?",
    answer: "First, check your spam or junk folder—verification emails sometimes end up there. Still nada? Reach out to support@grocery-share.com and we'll sort it out pronto!",
  },
  {
    question: "What happens if my subscription expires?",
    answer: "You'll lose access when it expires—but don't worry! You can sign up again anytime to jump back in. We'd love to have you back!",
  },
  {
    question: "How long does my subscription last?",
    answer: "Each subscription is 12 months of delicious access. Paid by card? It'll auto-renew at the end. Alipay? We'll need you to renew manually when the time comes.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We take Visa, Mastercard, American Express, and Alipay. Pick what works for you!",
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "Your subscription will be terminated, and access to paid Grocery-Share features will end. To return later, you can sign up again with a new subscription.",
  },
  {
    question: "What do I get with my subscription?",
    answer: "Full access to all Grocery-Share category lists—your digital food-savvy friend! Think part encyclopedia, part comedy show, and 100% your cheerleader in eating well. Learning about food should be as fun as eating it!",
  },
  {
    question:
      "Where can I find privacy policy, terms of service, disclaimer for the consumer section, and disclaimer for the commercial section?",
    answer: (
      <div className="space-y-4">
        <p>
          You&apos;ll find all of them on our{" "}
          <Link href="/legal" className="font-semibold text-[#2B6B4A] underline hover:no-underline">
            Legal
          </Link>{" "}
          page—the same wording we use across sign-up and the site. Prefer a PDF? Grab the{" "}
          <Link
            href="/legal/Legal%20Perspectives%2020260415.docx.pdf"
            className="font-semibold text-[#2B6B4A] underline hover:no-underline"
          >
            Legal Perspectives (PDF)
          </Link>{" "}
          from that page anytime.
        </p>
        <p className="font-medium text-zinc-800">Jump to a specific section:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-zinc-400">
          <li>
            <Link
              href="/legal#privacy-policy"
              className="font-semibold text-[#2B6B4A] underline hover:no-underline"
            >
              Privacy policy
            </Link>
          </li>
          <li>
            <Link
              href="/legal#terms-of-service"
              className="font-semibold text-[#2B6B4A] underline hover:no-underline"
            >
              Terms of service
            </Link>
          </li>
          <li>
            <Link
              href="/legal#disclaimer-consumer"
              className="font-semibold text-[#2B6B4A] underline hover:no-underline"
            >
              Disclaimer for the consumer section
            </Link>
          </li>
          <li>
            <Link
              href="/legal#disclaimer-commercial"
              className="font-semibold text-[#2B6B4A] underline hover:no-underline"
            >
              Disclaimer for the commercial section
            </Link>{" "}
            <span className="text-zinc-600">(when you use commercial features)</span>
          </li>
        </ul>
      </div>
    ),
  },
  ],
  zh: [
    {
      question: "如何修改密码？",
      answer:
        "很简单！有两种方式：\n1) 在登录页点击“忘记密码”按钮，通过邮箱接收重置链接；或\n2) 登录后点击右上角的邮箱，在下拉菜单中选择“修改密码”。我们帮你安排好！",
    },
    {
      question: "购买会员后可以退款吗？",
      answer:
        "很抱歉，会员购买后无法退款。如果你不想继续使用，可以在账户菜单中取消会员。",
    },
    {
      question: "如何取消会员？",
      answer:
        "取消会员步骤：\n1) 登录你的账户\n2) 点击右上角的邮箱地址\n3) 在下拉菜单中选择“取消会员”\n4) 阅读确认提示，并仅在确定要继续时确认\n\n取消后，你的 Essential 或 Premium 账户将被终止。如果之后想继续使用 Grocery-Share，需要重新注册新的会员。",
    },
    {
      question: "为什么我无法登录账号？",
      answer:
        "可以先检查这几件事：\na) 邮箱验证链接是否已经点击？也请看看垃圾邮件箱。\nb) 如果会员已过期，需要重新注册才能继续使用。\nc) 密码不对？别担心，请在登录页点击“忘记密码”来重置。",
    },
    {
      question: "没有收到邮箱验证链接怎么办？",
      answer:
        "请先检查垃圾邮件或广告邮件文件夹，验证邮件有时会跑到那里。还是没有？请联系 support@grocery-share.com，我们会尽快帮你处理！",
    },
    {
      question: "会员过期后会怎样？",
      answer:
        "会员过期后将无法继续访问，但不用担心！你可以随时重新注册，回来继续探索。我们很欢迎你回来！",
    },
    {
      question: "会员有效期多久？",
      answer:
        "每个会员方案提供 12 个月访问权限。使用银行卡支付会在到期时自动续费；Alipay 支付则需要到期后手动续费。",
    },
    {
      question: "支持哪些付款方式？",
      answer: "我们支持 Visa、Mastercard、American Express 和 Alipay。选择最适合你的方式即可！",
    },
    {
      question: "取消会员后会怎样？",
      answer:
        "你的会员将被终止，并且无法继续访问付费的 Grocery-Share 功能。如需之后继续使用，可以重新注册新的会员。",
    },
    {
      question: "会员包含哪些内容？",
      answer:
        "你可以完整访问 Grocery-Share 分类清单：你的数字化美食智友！它一半是百科全书，一半是喜剧秀，100% 是健康饮食啦啦队。学习食物知识应该和享用美食一样有趣！",
    },
    {
      question: "在哪里可以找到隐私政策、服务条款、消费者专区免责声明和商业专区免责声明？",
      answer: (
        <div className="space-y-4">
          <p>
            这些内容都可以在我们的{" "}
            <Link href="/zh/legal" className="font-semibold text-[#2B6B4A] underline hover:no-underline">
              法律条款
            </Link>{" "}
            页面找到，和注册及网站其他位置使用的内容一致。如需 PDF，也可以随时下载{" "}
            <Link
              href="/legal/Legal%20Perspectives%2020260415.docx.pdf"
              className="font-semibold text-[#2B6B4A] underline hover:no-underline"
            >
              Legal Perspectives (PDF)
            </Link>
            。
          </p>
          <p className="font-medium text-zinc-800">快速跳转：</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-zinc-400">
            <li>
              <Link href="/zh/legal#legal-zh-cn" className="font-semibold text-[#2B6B4A] underline hover:no-underline">
                简体中文法律条款
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ],
};

function FAQPageContent({ locale = "en" }: { locale?: FAQLocale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqData = faqDataByLocale[locale];
  const copy = FAQ_COPY[locale];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-center text-3xl font-semibold text-zinc-900 font-beckman">
            {copy.title}
          </h1>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border-b border-zinc-200 last:border-b-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-4 text-left flex items-center justify-between hover:text-[#2B6B4A] transition-colors"
                >
                  <span className="text-lg font-semibold text-zinc-900">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-5 w-5 text-zinc-500 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="pb-4 pl-0 text-base leading-relaxed text-zinc-700">
                    {typeof faq.answer === "string" ? (
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    ) : (
                      faq.answer
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FAQPage() {
  return <FAQPageContent />;
}
