import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import NavBar from "../components/navbar";
import PricingPlanCards from "./pricing-plan-cards";
import type { SubscriptionContentLocale } from "../components/subscription-plan-content";

type SubscriptionPlan = {
  id: string;
  plan_type: string;
  category?: string;
  title: string;
  description: string;
  price?: number;
  duration_months: number;
};

const PRICING_COPY = {
  en: {
    fallbackTitle: "Premium Membership",
    fallbackDescription:
      "Our standard annual subscription plan with full access to all Grocery-Share category lists.",
    noPlans: "No subscription plans available.",
    heading: "PRICING",
    noteLabel: "Note:",
    note:
      "All subscriptions will automatically renew at the subscription end date, with the exception of payments made through Alipay. Alipay subscriptions require manual renewal.",
    questions: "Questions? We'd love to chat—",
    contact: "reach out anytime",
  },
  zh: {
    fallbackTitle: "Premium 高级会员",
    fallbackDescription:
      "标准年度会员方案，可完整访问所有 Grocery-Share 分类清单。",
    noPlans: "暂无可用会员方案。",
    heading: "价格方案",
    noteLabel: "提示：",
    note:
      "所有会员都会在到期日自动续费；通过 Alipay 支付的会员除外，Alipay 会员需要手动续费。",
    questions: "有问题？我们很乐意聊聊——",
    contact: "随时联系我们",
  },
} as const;

async function PricingPageContent({
  locale = "en",
}: {
  locale?: SubscriptionContentLocale;
}) {
  const copy = PRICING_COPY[locale];
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
      description: `Your digital food-savvy friend in your pocket—full access to all Grocery-Share category lists, quirky food facts, and kitchen inspiration.`,
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
        title: copy.fallbackTitle,
        description: copy.fallbackDescription,
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
          <p className="text-center text-zinc-600">{copy.noPlans}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-beckman">{copy.heading}</h1>
        </div>

        <PricingPlanCards locale={locale} />

        {/* Auto-renewal Notice */}
        <div className="flex justify-center mt-8">
          <div className="max-w-md w-full">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>{copy.noteLabel}</strong> {copy.note}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-zinc-600">
          <p>
            {copy.questions}{" "}
            <Link href={locale === "zh" ? "/zh/contact" : "/contact"} className="text-[#2B6B4A] underline hover:no-underline">
              {copy.contact}
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

export default async function PricingPage() {
  return <PricingPageContent />;
}
