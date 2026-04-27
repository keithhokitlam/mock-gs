export type MembershipTier = "essential" | "premium";
export type SubscriptionContentLocale = "en" | "zh";

type PlanContent = {
  title: string;
  description: string;
  features: string[];
  durationLabel?: string;
  /** When true, duration line shows with strikethrough (temporary promos, etc.). */
  durationLabelStrikethrough?: boolean;
  trialBadgeLabel?: string;
};

export const SUBSCRIPTION_PLAN_CONTENT: Record<
  SubscriptionContentLocale,
  Record<MembershipTier, PlanContent>
> = {
  en: {
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
  },
  zh: {
    essential: {
      title: "Essential 基础会员",
      description:
        "你的数字化美食智友：畅享基础杂货内容、趣味食物知识和厨房灵感！",
      features: [
        "完整访问基础杂货内容",
        "需要帮助时，我们会优先支持你",
        "自动续费，不错过任何精彩内容（Alipay 除外）",
      ],
    },
    premium: {
      title: "Premium 高级会员",
      description:
        "你的数字化美食智友：畅享全部分类清单、趣味食物知识和厨房灵感！",
      features: [
        "完整访问杂货内容",
        "完整访问所有食品和分销清单",
        "需要帮助时，我们会优先支持你",
        "自动续费，不错过任何精彩内容（Alipay 除外）",
      ],
      durationLabel: "12 个月：",
      durationLabelStrikethrough: true,
      trialBadgeLabel: "限时免费试用",
    },
  },
};

export function getSubscriptionPlanContent(locale: SubscriptionContentLocale = "en") {
  return SUBSCRIPTION_PLAN_CONTENT[locale];
}
