import FruitsPage from "../../fruits/page";

type SearchParams = Record<string, string | string[] | undefined>;

export default function ChineseFruitsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return <FruitsPage searchParams={searchParams} />;
}
