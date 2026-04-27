import AdminPage from "../../mastertable/page";

type SearchParams = Record<string, string | string[] | undefined>;

export default function ChineseMastertablePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  return <AdminPage searchParams={searchParams} />;
}
