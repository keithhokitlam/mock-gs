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
    answer: "You can change your password in two ways:\n1) Click the 'Forgot Password' button on the sign-in page to receive a password reset link via email, or\n2) After logging into your account, click your email address in the top right corner of the browser, then select 'Change Password' from the dropdown menu.",
  },
  {
    question: "Once I purchase a subscription, can it be refunded?",
    answer: "Unfortunately, subscriptions cannot be refunded once purchased. Please note that subscriptions are set to auto-renew automatically (except for payments made through Alipay). To stop future auto-renewals, please follow these steps:\n1) Log into your account\n2) Click your email address in the top right corner of the browser\n3) Select 'Stop Auto-Renewal (non-Alipay only)' from the dropdown menu\n\nThis will prevent your subscription from automatically renewing for the next billing cycle.",
  },
  {
    question: "Why can't I log into my account?",
    answer: "There can be several explanations:\na) You were sent an email verification link that has not been clicked yet (please also check your junk or spam folder).\nb) Your subscription has expired and you would need to sign up again to resume access.\nc) Your password is incorrect (click the 'Forgot Password' button on the Sign In page to reset it).",
  },
  {
    question: "I didn't receive my email verification link. What should I do?",
    answer: "a) Check your spam or junk folder—verification emails are sometimes filtered there.\nb) If you still cannot find it, contact us at support@grocery-share.com and we will assist you.",
  },
  {
    question: "What happens if my subscription expires?",
    answer: "If you stopped auto-renewal and your subscription has expired, you will lose access to GroceryShare features. You will need to sign up again to regain access.",
  },
  {
    question: "How long does my subscription last?",
    answer: "Each subscription lasts 12 months. Subscriptions automatically renew at the end of the period when paid by credit card. Payments made through Alipay do not auto-renew and require manual renewal.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, Mastercard, American Express, and Alipay.",
  },
  {
    question: "What happens if I stop the auto-renewal process?",
    answer: "You will continue to have access to GroceryShare features until the current subscription period ends. No renewal will be triggered after the subscription end date.",
  },
  {
    question: "What do I get with my subscription?",
    answer: "",
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
