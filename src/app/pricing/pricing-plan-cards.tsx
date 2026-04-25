"use client";

import { useState } from "react";
import SignupModal from "../components/signup-modal";
import {
  SUBSCRIPTION_PLAN_CONTENT,
  type MembershipTier,
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

/** Document + magnifying glass — research / discovery vibe (essential tier) */
const GoldResearchIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="goldGradientResearchPricing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="14" height="16" rx="2" fill="url(#goldGradientResearchPricing)" opacity="0.2" />
    <path d="M6 2.8h8.5L18 6.3V19a2 2 0 01-2 2H6a2 2 0 01-2-2V4.8a2 2 0 012-2z" fill="url(#goldGradientResearchPricing)" opacity="0.12" />
    <path d="M6 2.8h8.5L18 6.3V19a2 2 0 01-2 2H6a2 2 0 01-2-2V4.8a2 2 0 012-2z" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.35" strokeLinejoin="round" />
    <path d="M14.5 2.8v3.5H18" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.25" strokeLinejoin="round" />
    <rect x="6.4" y="8" width="5.4" height="6.8" rx="0.8" fill="url(#goldGradientResearchPricing)" opacity="0.85" />
    <rect x="12.6" y="10.2" width="2.4" height="4.6" rx="0.6" fill="url(#goldGradientResearchPricing)" opacity="0.65" />
    <rect x="15.7" y="7.8" width="2.2" height="7" rx="0.6" fill="url(#goldGradientResearchPricing)" opacity="0.45" />
    <path d="M6.4 17h7.3" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.15" strokeLinecap="round" />
    <circle cx="16.6" cy="16.8" r="3.1" fill="#fff7d6" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.4" />
    <path d="M18.8 19l2.2 2.2" stroke="url(#goldGradientResearchPricing)" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export default function PricingPlanCards() {
  const [signupOpen, setSignupOpen] = useState(false);
  const [defaultSelectedPlan, setDefaultSelectedPlan] = useState<MembershipTier | null>(null);
  const essentialPlan = SUBSCRIPTION_PLAN_CONTENT.essential;
  const premiumPlan = SUBSCRIPTION_PLAN_CONTENT.premium;

  const openSignup = (plan: MembershipTier) => {
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
          <h3 className="text-xl font-bold mb-3 text-center">{essentialPlan.title}</h3>
          <p className="text-zinc-600 mb-4 text-xs leading-relaxed">
            {essentialPlan.description}
          </p>
          <ul className="space-y-2 mb-6 text-sm text-zinc-600">
            {essentialPlan.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openSignup("essential")}
            className="block w-full text-center px-4 py-2 bg-[#2B6B4A] text-white rounded hover:bg-[#225a3d] transition-colors font-semibold"
          >
            Sign Up Here!
          </button>
        </div>

        <div className="w-full bg-white rounded-lg border border-zinc-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <GoldGroceryIcon />
          </div>
          <h3 className="mb-3 text-center text-xl font-bold">{premiumPlan.title}</h3>
          <p className="mb-4 text-center text-xs leading-relaxed text-zinc-600">
            {premiumPlan.description}
          </p>
          <div className="text-center mb-4">
            <span
              className={`text-lg font-bold text-zinc-900 ${premiumPlan.durationLabelStrikethrough ? "line-through decoration-2 decoration-zinc-400" : ""}`}
            >
              {premiumPlan.durationLabel}
            </span>
          </div>
          <ul className="mb-4 space-y-2 text-sm text-zinc-600">
            {premiumPlan.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mb-4 text-center">
            <span className="inline-block rounded-full bg-yellow-200 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#2B6B4A] transition-colors animate-pulse shadow-[0_0_20px_rgba(253,224,71,0.95)]">
              {premiumPlan.trialBadgeLabel}
            </span>
          </p>
          <button
            type="button"
            onClick={() => openSignup("premium")}
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
