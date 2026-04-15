import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import NavBar from "../components/navbar";

// Gold grocery icon SVG (shopping basket with groceries)
const GoldGroceryIcon = () => (
  <svg
    className="w-16 h-16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGradientGrocery" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    {/* Shopping basket */}
    <path
      d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="url(#goldGradientGrocery)"
    />
    {/* Grocery items inside */}
    <circle cx="6" cy="9" r="1.5" fill="url(#goldGradientGrocery)" opacity="0.8" />
    <circle cx="10" cy="9" r="1.5" fill="url(#goldGradientGrocery)" opacity="0.8" />
    <circle cx="14" cy="9" r="1.5" fill="url(#goldGradientGrocery)" opacity="0.8" />
  </svg>
);

/** Document + magnifying glass — research / discovery vibe (consumer tier) */
const GoldResearchIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="goldGradientResearch" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <path
      d="M4 3h9l3 3v14a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 20V4.5A1.5 1.5 0 014 3z"
      stroke="url(#goldGradientResearch)"
      strokeWidth="1.35"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M13 3v3h3" stroke="url(#goldGradientResearch)" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    <line x1="6" y1="9.5" x2="12" y2="9.5" stroke="url(#goldGradientResearch)" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="6" y1="12" x2="11" y2="12" stroke="url(#goldGradientResearch)" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="6" y1="14.5" x2="10" y2="14.5" stroke="url(#goldGradientResearch)" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="16.5" cy="16.5" r="3.25" stroke="url(#goldGradientResearch)" strokeWidth="1.35" fill="none" />
    <path
      d="M18.8 18.8L21.5 21.5"
      stroke="url(#goldGradientResearch)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

type SubscriptionPlan = {
  id: string;
  plan_type: string;
  category?: string;
  title: string;
  description: string;
  price?: number;
  duration_months: number;
};

export default async function PricingPage() {
  // Fetch all yearly subscriptions (1 year = 12 months)
  // For now, we'll fetch from subscriptions table and group by plan_type
  // You can later add a dedicated plans/pricing table if needed
  const { data: subscriptions, error } = await supabaseServer
    .from("subscriptions")
    .select("plan_type")
    .eq("status", "active")
    .not("plan_type", "is", null);

  // Get unique plan types (these will be our categories)
  const uniquePlanTypes = Array.from(
    new Set((subscriptions || []).map((sub) => sub.plan_type).filter(Boolean))
  );

  // For demonstration, create sample plans grouped by category
  // In production, you'd fetch from a dedicated plans/pricing table
  const plansByCategory: Record<string, SubscriptionPlan[]> = {};

  uniquePlanTypes.forEach((planType) => {
    if (!planType) return;
    // Use plan_type as category, or create default categories
    const category = planType;
    if (!plansByCategory[category]) {
      plansByCategory[category] = [];
    }
    
    plansByCategory[category].push({
      id: `plan-${category}`,
      plan_type: planType,
      category: category,
      title: `${planType} Subscription`,
      description: `Your digital food-savvy friend in your pocket—full access to all GroceryShare category lists, quirky food facts, and kitchen inspiration.`,
      duration_months: 12,
    });
  });

  // If no plans found, show default plan
  if (Object.keys(plansByCategory).length === 0) {
    plansByCategory["default"] = [
      {
        id: "plan-standard",
        plan_type: "standard",
        category: "default",
        title: "Standard Annual Subscription",
        description: "Our standard annual subscription plan with full access to all GroceryShare category lists.",
        duration_months: 12,
      },
    ];
  }

  // Get the first plan from the first category (only show one plan)
  const firstCategory = Object.keys(plansByCategory)[0];
  const displayPlan = plansByCategory[firstCategory]?.[0] || null;

  if (!displayPlan) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <NavBar />
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
          <p className="text-center text-zinc-600">No subscription plans available.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-beckman">PRICING</h1>
        </div>

        {/* Free consumer + paid plan */}
        <div className="flex flex-col items-center gap-8 max-w-md w-full mx-auto">
          {/* Free Consumer Subscription — greyed out until launch (Food Category–only tier) */}
          <div
            className="w-full rounded-lg border border-dashed border-zinc-300 bg-zinc-100 p-6 shadow-none"
            aria-disabled="true"
          >
            <div className="flex items-center justify-center mb-4 opacity-45 grayscale">
              <GoldResearchIcon />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center text-zinc-500">Free Consumer Subscription</h3>
            <p className="text-zinc-500 mb-4 text-sm leading-relaxed">
              Your digital food-savvy friend—full access to all category lists,
              quirky food facts, and kitchen inspiration!
            </p>
            <ul className="space-y-2 mb-6 text-sm text-zinc-500">
              <li className="flex items-start">
                <span className="text-zinc-400 mr-2">✓</span>
                <span>Full access to all food lists and tasty know-how</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-2">✓</span>
                <span>We&apos;ve got your back—priority support when you need us</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-2">✓</span>
                <span>Auto-renewal so you never miss a beat (except Alipay)</span>
              </li>
            </ul>
            <span
              className="block w-full cursor-not-allowed rounded bg-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-500"
              title="Not available yet"
            >
              Sign Up Here!
            </span>
          </div>

          {/* Standard / paid annual plan */}
          <div className="w-full bg-white rounded-lg border border-zinc-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <GoldGroceryIcon />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Standard Annual Subscription</h3>
            <p className="text-zinc-600 mb-4 text-sm leading-relaxed">
              Your digital food-savvy friend—full access to all category lists,
              quirky food facts, and kitchen inspiration!
            </p>
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-zinc-900">12 months of:</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-zinc-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Full access to all food lists and tasty know-how</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>We&apos;ve got your back—priority support when you need us</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Auto-renewal so you never miss a beat (except Alipay)</span>
              </li>
            </ul>
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-[0.15em] text-[#2B6B4A]">
              TEMPORARY FREE TRIAL
            </p>
            <Link
              href="/home?account=commercial"
              className="block w-full text-center px-4 py-2 bg-[#2B6B4A] text-white rounded hover:bg-[#225a3d] transition-colors font-semibold"
            >
              Sign Up Here!
            </Link>
          </div>
        </div>

        {/* Auto-renewal Notice */}
        <div className="flex justify-center mt-8">
          <div className="max-w-md w-full">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> All subscriptions will automatically renew at the subscription end date, 
                with the exception of payments made through Alipay. Alipay subscriptions require manual renewal.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-zinc-600">
          <p>
            Questions? We&apos;d love to chat—{" "}
            <Link href="/contact" className="text-[#2B6B4A] underline hover:no-underline">
              reach out anytime
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
