import AdminPage from "../../mastertable/page";

type SearchParams = Record<string, string | string[] | undefined>;
const ChineseAdminPage = AdminPage as (props: {
  searchParams?: Promise<SearchParams>;
  locale?: "en" | "zh";
}) => ReturnType<typeof AdminPage>;

export default function ChineseMastertablePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  return <ChineseAdminPage searchParams={searchParams} locale="zh" />;
}
