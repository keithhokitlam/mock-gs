"use client";

import { useState } from "react";
import NavBar from "../components/navbar";

type FAQItem = {
  question: string;
  answer: string;
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
    answer: "Full access to all GroceryShare category lists—your digital food-savvy friend! Think part encyclopedia, part comedy show, and 100% your cheerleader in eating well. Learning about food should be as fun as eating it!",
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
                  <div className="pb-4 pl-0">
                    <p className="text-base leading-relaxed text-zinc-700 whitespace-pre-line">
                      {faq.answer}
                    </p>
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
