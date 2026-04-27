import FoodCategoryPage from "../../foodcategory/page";

const ChineseFoodCategoryContent = FoodCategoryPage as (props: {
  locale?: "en" | "zh";
}) => ReturnType<typeof FoodCategoryPage>;

export default function ChineseFoodCategoryPage() {
  return <ChineseFoodCategoryContent locale="zh" />;
}
