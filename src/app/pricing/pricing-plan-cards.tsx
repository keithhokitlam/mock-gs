"use client";

import { useState } from "react";
import SignupModal from "../components/signup-modal";
import {
  SUBSCRIPTION_PLAN_CONTENT,
  type ConsumerVsCommercial,
} from "../components/subscription-plan-content";

// Gold grocery icon SVG (shopping basket with groceries)
const GoldGroceryIcon = () => (
  <svg
    className="w-16 h-16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGradientGroceryPricing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <path
      d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="url(#goldGradientGroceryPricing)"
    />
    <circle cx="6" cy="9" r="1.5" fill="url(#goldGradientGroceryPricing)" opacity="0.8" />
    <circle cx="10" cy="9" r="1.5" fill="url(#goldGradientGroceryPricing)" opacity="0.8" />
    <circle cx="14" cy="9" r="1.5" fill="url(#goldGradientGroceryPricing)" opacity="0.8" />
  </svg>
);

/** Document + magnifying glass — research / discovery vibe (consumer tier) */
const GoldResearchIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="goldGradientResearchPricing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <path
      d="M4 3h9l3 3v14a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 20V4.5A1.5 1.5 0 014 3z"
      stroke="url(#goldGradientResearchPricing)"
      strokeWidth="1.35"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M13 3v3h3" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    <line x1="6" y1="9.5" x2="12" y2="9.5" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="6" y1="12" x2="11" y2="12" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="6" y1="14.5" x2="10" y2="14.5" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="16.5" cy="16.5" r="3.25" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.35" fill="none" />
    <path
      d="M18.8 18.8L21.5 21.5"
      stroke="url(#goldGradientResearchPricing)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function PricingPlanCards() {
  const [signupOpen, setSignupOpen] = useState(false);
  const [defaultSelectedPlan, setDefaultSelectedPlan] = useState<ConsumerVsCommercial | null>(null);
  const consumerPlan = SUBSCRIPTION_PLAN_CONTENT.consumer;
  const commercialPlan = SUBSCRIPTION_PLAN_CONTENT.commercial;

  const openSignup = (plan: ConsumerVsCommercial) => {
    setDefaultSelectedPlan(plan);
    setSignupOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-8 max-w-md w-full mx-auto">
        <div className="w-full bg-white rounded-lg border border-zinc-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <GoldResearchIcon />
          </div>
          <h3 className="text-xl font-bold mb-3 text-center">{consumerPlan.title}</h3>
          <p className="text-zinc-600 mb-4 text-sm leading-relaxed">
            {consumerPlan.description}
          </p>
          <ul className="space-y-2 mb-6 text-sm text-zinc-600">
            {consumerPlan.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openSignup("consumer")}
            className="block w-full text-center px-4 py-2 bg-[#2B6B4A] text-white rounded hover:bg-[#225a3d] transition-colors font-semibold"
          >
            Sign Up Here!
          </button>
        </div>

        <div className="w-full bg-white rounded-lg border border-zinc-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <GoldGroceryIcon />
          </div>
          <h3 className="mb-2 text-center text-base font-bold">{commercialPlan.title}</h3>
          <p className="mb-4 text-center text-xs leading-relaxed text-zinc-600">
            {commercialPlan.description}
          </p>
          <div className="text-center mb-4">
            <span className="text-lg font-bold text-zinc-900">{commercialPlan.durationLabel}</span>
          </div>
          <ul className="mb-4 space-y-2 text-sm text-zinc-600">
            {commercialPlan.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mb-4 text-center">
            <span className="inline-block rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#2B6B4A] transition-colors animate-pulse shadow-[0_0_20px_rgba(253,224,71,0.95)]">
              {commercialPlan.trialBadgeLabel}
            </span>
          </p>
          <button
            type="button"
            onClick={() => openSignup("commercial")}
            className="block w-full text-center px-4 py-2 bg-[#2B6B4A] text-white rounded hover:bg-[#225a3d] transition-colors font-semibold"
          >
            Sign Up Here!
          </button>
        </div>
      </div>

      <SignupModal
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        defaultSelectedPlan={defaultSelectedPlan}
      />
    </>
  );
}
