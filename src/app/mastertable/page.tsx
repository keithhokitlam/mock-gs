import Image from "next/image";
import Link from "next/link";
import ActionsBar from "./actions-bar";
import AdminTable, { type AdminColumn } from "./table";

const SHEET_ID = "1kx7wArkJ5VDSwNuKDKizUMp1exnxfub-aI6xszqCZxs";
const SHEET_GID = "0";

function parseCsv(data: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < data.length; i += 1) {
    const char = data[i];
    const nextChar = data[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      row.push(cell);
      if (row.length > 1 || row[0] !== "") {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.length > 1 || row[0] !== "") {
    rows.push(row);
  }
  return rows;
}

async function getSheetRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load the Google Sheet.");
  }

  const csv = await response.text();
  return parseCsv(csv);
}

type SearchParams = Record<string, string | string[] | undefined>;

type AdminPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const rows = await getSheetRows();
  const headers = rows[0] || [];
  const dataRows = rows.slice(1);
  const statusIndex = headers.findIndex(
    (header) => header.trim().toLowerCase() === "status"
  );

  const columns: AdminColumn[] = headers
    .map((header, index) => ({ label: header || `Column ${index + 1}`, index }))
    .filter((column) => column.index !== statusIndex);

  const activeRows =
    statusIndex >= 0
      ? dataRows.filter((row) => (row[statusIndex] || "").trim() === "Active")
      : dataRows;

  const columnFilters: Record<number, string> = {};
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (!key.startsWith("f_")) return;
    const index = Number(key.replace("f_", ""));
    if (Number.isNaN(index)) return;
    if (index === statusIndex) return;
    if (Array.isArray(value)) return;
    columnFilters[index] = value;
  });

  const filteredRows = activeRows.filter((row) =>
    Object.entries(columnFilters).every(([indexValue, filterValue]) => {
      const index = Number(indexValue);
      const cell = (row[index] || "").toString().toLowerCase();
      return cell.includes(filterValue.toLowerCase());
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

  const sortableIndices = new Set(columns.map((column) => column.index));
  const rowsToSort = [...filteredRows];
  if (!Number.isNaN(sortIndex) && sortableIndices.has(sortIndex)) {
    rowsToSort.sort((left, right) => {
      const leftValue = (left[sortIndex] || "").toString().toLowerCase();
      const rightValue = (right[sortIndex] || "").toString().toLowerCase();
      if (leftValue < rightValue) return sortDirection === "desc" ? 1 : -1;
      if (leftValue > rightValue) return sortDirection === "desc" ? -1 : 1;
      return 0;
    });
  }

  const visibleRows = rowsToSort.map((row) =>
    row.filter((_, index) => index !== statusIndex)
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <nav className="w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
        <div className="flex w-full items-center gap-4 px-2 py-0">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/logos/GS_logo_highres_2x.png"
              alt="GroceryShare"
              width={260}
              height={104}
              className="h-16 w-auto translate-y-[2px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            <span className="font-beckman">About</span>
            <span className="font-beckman">Support</span>
            <span className="font-beckman">FAQ</span>
          </div>
        </div>
      </nav>
      <div className="mx-auto w-full max-w-6xl px-6 pt-4 pb-10">
        <ActionsBar
          columns={columns.map((column) => column.label)}
          rows={visibleRows}
        />
        <AdminTable
          columns={columns}
          rows={visibleRows}
          activeFilters={columnFilters}
          sortIndex={Number.isNaN(sortIndex) ? null : sortIndex}
          sortDirection={sortDirection === "desc" ? "desc" : "asc"}
        />
      </div>
    </div>
  );
}
