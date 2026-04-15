export type ConsumerVsCommercial = "consumer" | "commercial";

type PlanContent = {
  title: string;
  description: string;
  features: string[];
  durationLabel?: string;
  trialBadgeLabel?: string;
};

export const SUBSCRIPTION_PLAN_CONTENT: Record<ConsumerVsCommercial, PlanContent> = {
  consumer: {
    title: "Free Consumer Subscription",
    description:
      "Your digital food-savvy friend—full access to all category lists, quirky food facts, and kitchen inspiration!",
    features: [
      "Full access to all food lists and tasty know-how",
      "We've got your back—priority support when you need us",
      "Auto-renewal so you never miss a beat (except Alipay)",
    ],
  },
  commercial: {
    title: "Standard Annual Subscription",
    description:
      "Your digital food-savvy friend—full access to all category lists, quirky food facts, and kitchen inspiration!",
    features: [
      "Full access to all food lists and tasty know-how",
      "We've got your back—priority support when you need us",
      "Auto-renewal so you never miss a beat (except Alipay)",
    ],
    durationLabel: "12 months of:",
    trialBadgeLabel: "LIMITED TIME FREE TRIAL",
  },
};
