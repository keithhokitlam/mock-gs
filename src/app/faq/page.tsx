"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import NavBar from "../components/navbar";

type FAQItem = {
  question: string;
  answer: ReactNode;
};

const faqData: FAQItem[] = [
  {
    question: "How do I change my password?",
    answer: "Easy! Two ways:\n1) Click the 'Forgot Password' button on the sign-in page to receive a password reset link via email, or\n2) After logging in, click your email in the top right corner, then select 'Change Password' from the dropdown. We've got you covered!",
  },
  {
    question: "Once I purchase a subscription, can it be refunded?",
    answer: "Unfortunately, we can't offer refunds once a subscription is purchased. Heads up: subscriptions auto-renew (except Alipay). To stop future renewals:\n1) Log in\n2) Click your email in the top right\n3) Select 'Stop Auto-Renewal (non-Alipay only)' from the dropdown\n\nThat'll prevent the next billing cycle from triggering.",
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
    question: "What happens if I stop the auto-renewal process?",
    answer: "No stress—you'll keep full access until your current period ends. After that date, no renewal will happen. You're in control!",
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
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-center text-3xl font-semibold text-zinc-900 font-beckman">
            FAQ
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
