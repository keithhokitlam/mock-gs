import SubscriptionsPage from "../../subscriptions/page";

type SearchParams = Record<string, string | string[] | undefined>;

export default function ChineseSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return <SubscriptionsPage searchParams={searchParams} />;
}
