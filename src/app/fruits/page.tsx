import Link from "next/link";
import NavBar from "../components/navbar";
import ActionsBar from "../mastertable/actions-bar";
import AdminTable, { type AdminColumn } from "../mastertable/table";
import fruitsData from "@/data/fruits.json";

type SearchParams = Record<string, string | string[] | undefined>;
type FilterValue = string | string[];

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFilterValue(value: string): FilterValue {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string");
    }
  } catch {
    // fall through
  }
  return value;
}

const rows = fruitsData as string[][];

export default async function FruitsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const headers = rows[0] || [];
  const dataRows = rows.slice(1);

  const columns: AdminColumn[] = headers.map((header, index) => ({
    label: header || `Column ${index + 1}`,
    index,
  }));

  const columnFilters: Record<number, FilterValue> = {};
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (!key.startsWith("f_")) return;
    const index = Number(key.replace("f_", ""));
    if (Number.isNaN(index)) return;
    if (typeof value !== "string") return;
    columnFilters[index] = parseFilterValue(value);
  });

  const filteredRows = dataRows.filter((row) =>
    Object.entries(columnFilters).every(([indexValue, filterValue]) => {
      const index = Number(indexValue);
      const cell = normalizeText((row[index] || "").toString());
      if (Array.isArray(filterValue)) {
        return filterValue
          .map((v) => normalizeText(v))
          .includes(cell);
      }
      return cell.includes(normalizeText(filterValue));
    })
  );

  const sortIndexRaw = resolvedSearchParams?.sort;
  const sortIndex = Number(
    Array.isArray(sortIndexRaw) ? sortIndexRaw[0] : sortIndexRaw
  );
  const sortDirectionRaw = resolvedSearchParams?.dir;
  const sortDirection = Array.isArray(sortDirectionRaw)
    ? sortDirectionRaw[0]
    : sortDirectionRaw;

  const sortableIndices = new Set(columns.map((c) => c.index));
  let rowsToSort = [...filteredRows];
  if (!Number.isNaN(sortIndex) && sortableIndices.has(sortIndex)) {
    rowsToSort.sort((a, b) => {
      const av = (a[sortIndex] || "").toString().toLowerCase();
      const bv = (b[sortIndex] || "").toString().toLowerCase();
      if (av < bv) return sortDirection === "desc" ? 1 : -1;
      if (av > bv) return sortDirection === "desc" ? -1 : 1;
      return 0;
    });
  }

  const visibleRows = rowsToSort;
  const filterRows = dataRows;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-[67rem] px-4 py-12">
        <div className="mb-4 flex items-center gap-4">
          <Link
            href="/foodcategory#section-fruits"
            className="text-[#2B6B4A] hover:underline text-sm font-medium"
          >
            ← Back to Food Category
          </Link>
        </div>
        <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
          FRUITS
        </h1>
        <ActionsBar
          columns={columns.map((c) => c.label)}
          rows={visibleRows}
          clearFiltersHref="/fruits"
        />
        <AdminTable
          columns={columns}
          rows={visibleRows}
          filterRows={filterRows}
          activeFilters={columnFilters}
          sortIndex={Number.isNaN(sortIndex) ? null : sortIndex}
          sortDirection={sortDirection === "desc" ? "desc" : "asc"}
        />
      </main>
    </div>
  );
}
