export type MembershipTier = "essential" | "premium";

type PlanContent = {
  title: string;
  description: string;
  features: string[];
  durationLabel?: string;
  /** When true, duration line shows with strikethrough (temporary promos, etc.). */
  durationLabelStrikethrough?: boolean;
  trialBadgeLabel?: string;
};

export const SUBSCRIPTION_PLAN_CONTENT: Record<MembershipTier, PlanContent> = {
  essential: {
    title: "Essential Membership",
    description:
      "Your digital food-savvy friend—full access to all category lists, quirky food facts, and kitchen inspiration!",
    features: [
      "Full access to essential grocery content",
      "We've got your back—priority support when you need us",
      "Auto-renewal so you never miss a beat (except Alipay)",
    ],
  },
  premium: {
    title: "Premium Membership",
    description:
      "Your digital food-savvy friend—full access to all category lists, quirky food facts, and kitchen inspiration!",
    features: [
      "Full access to grocery content",
      "Full access to all food/distribution lists",
      "We've got your back—priority support when you need us",
      "Auto-renewal so you never miss a beat (except Alipay)",
    ],
    durationLabel: "12 months of:",
    durationLabelStrikethrough: true,
    trialBadgeLabel: "LIMITED TIME FREE TRIAL",
  },
};
