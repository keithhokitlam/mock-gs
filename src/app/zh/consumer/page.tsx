import FoodCategoryPage from "../../foodcategory/page";

const ChineseFoodCategoryContent = FoodCategoryPage as (props: {
  locale?: "en" | "zh";
}) => ReturnType<typeof FoodCategoryPage>;

export default function ChineseConsumerPage() {
  return <ChineseFoodCategoryContent locale="zh" />;
}
