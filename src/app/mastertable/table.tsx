"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type AdminColumn = {
  label: string;
  index: number;
};

type AdminTableProps = {
  columns: AdminColumn[];
  rows: string[][];
  activeFilters: Record<number, string>;
  sortIndex: number | null;
  sortDirection: "asc" | "desc";
};

const nowrapHeaders = new Set([
  "Product Name (English)",
  "Product Name (French)",
  "Product Name (Chinese)",
]);

function buildKey(index: number) {
  return `f_${index}`;
}

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AdminTable({
  columns,
  rows,
  activeFilters,
  sortIndex,
  sortDirection,
}: AdminTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draftFilters, setDraftFilters] = useState<Record<number, string>>(
    activeFilters
  );
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDraftFilters(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    if (openMenu === null || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - 16;
    const maxTop = window.innerHeight - rect.height - 16;
    setMenuPosition((prev) => ({
      left: Math.min(Math.max(prev.left, 16), maxLeft),
      top: Math.min(Math.max(prev.top, 16), maxTop),
    }));
  }, [openMenu]);

  const columnFilterValues = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current: Record<number, string> = {};
    columns.forEach((column) => {
      const value = params.get(buildKey(column.index)) || "";
      if (value) {
        current[column.index] = value;
      }
    });
    return current;
  }, [columns, searchParams]);

  const clientSortIndex = useMemo(() => {
    const raw = searchParams.get("sort");
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  const clientSortDirection = useMemo(() => {
    const raw = searchParams.get("dir");
    return raw === "desc" ? "desc" : "asc";
  }, [searchParams]);

  const effectiveSortIndex = clientSortIndex ?? sortIndex;

  const positionByIndex = useMemo(() => {
    const map = new Map<number, number>();
    columns.forEach((column, position) => {
      map.set(column.index, position);
    });
    return map;
  }, [columns]);

  const displayRows = useMemo(() => {
    let nextRows = rows;
    const filterEntries = Object.entries(columnFilterValues).filter(
      ([, value]) => value.trim() !== ""
    );

    if (filterEntries.length) {
      nextRows = nextRows.filter((row) =>
        filterEntries.every(([indexValue, filterValue]) => {
          const originalIndex = Number(indexValue);
          const position = positionByIndex.get(originalIndex);
          if (position === undefined) return true;
          const cell = normalizeText((row[position] || "").toString());
          const needle = normalizeText(filterValue);
          return needle ? cell.includes(needle) : true;
        })
      );
    }

    const effectiveSortIndex = clientSortIndex ?? sortIndex;
    const effectiveSortDirection = clientSortIndex ? clientSortDirection : sortDirection;

    if (effectiveSortIndex !== null) {
      const position = positionByIndex.get(effectiveSortIndex);
      if (position !== undefined) {
        nextRows = [...nextRows].sort((left, right) => {
          const leftValue = (left[position] || "").toString().toLowerCase();
          const rightValue = (right[position] || "").toString().toLowerCase();
          if (leftValue < rightValue)
            return effectiveSortDirection === "desc" ? 1 : -1;
          if (leftValue > rightValue)
            return effectiveSortDirection === "desc" ? -1 : 1;
          return 0;
        });
      }
    }

    return nextRows;
  }, [
    rows,
    columnFilterValues,
    clientSortDirection,
    clientSortIndex,
    positionByIndex,
    sortDirection,
    sortIndex,
  ]);

  const updateSearch = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }
      params.set(key, value);
    });
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    router.refresh();
  };

  const applyFilter = (index: number) => {
    const value = draftFilters[index]?.trim() || "";
    updateSearch({ [buildKey(index)]: value || null });
  };

  const clearFilter = (index: number) => {
    setDraftFilters((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    updateSearch({ [buildKey(index)]: null });
  };

  const setSort = (index: number, direction: "asc" | "desc") => {
    updateSearch({ sort: index.toString(), dir: direction });
  };

  const clearSort = () => {
    updateSearch({ sort: null, dir: null });
  };

  const openDropdown = (
    columnIndex: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 224;
    const left = Math.min(
      Math.max(rect.right + window.scrollX - menuWidth, 16),
      window.innerWidth - menuWidth - 16
    );
    setMenuPosition({
      top: rect.bottom + window.scrollY + 8,
      left,
    });
    setOpenMenu(columnIndex);
  };

  const closeDropdown = () => setOpenMenu(null);

  return (
    <div className="print-table relative overflow-visible rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-hidden rounded-2xl">
        <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full text-left text-sm">
        <thead className="bg-black text-xs uppercase tracking-wide text-white font-beckman">
          <tr>
            {columns.map((column) => {
              const headerLabel = column.label;
              const noWrap = nowrapHeaders.has(headerLabel);
              const isOpen = openMenu === column.index;

              return (
                <th
                  key={`header-${column.index}`}
                  className={`px-4 py-3 ${noWrap ? "whitespace-nowrap" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{headerLabel}</span>
                    <button
                      type="button"
                      onClick={(event) => openDropdown(column.index, event)}
                      className="text-xs text-white/80 hover:text-white"
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                    >
                      ▼
                    </button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {displayRows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-sm text-zinc-500" colSpan={columns.length}>
                No matching rows found.
              </td>
            </tr>
          ) : (
            displayRows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="hover:bg-zinc-50">
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
          </table>
        </div>
      </div>
      {openMenu !== null ? (
        <div
          ref={menuRef}
          className="fixed z-50 w-56 rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 shadow-lg"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Filter
            </label>
            <input
              type="text"
              value={draftFilters[openMenu] ?? columnFilterValues[openMenu] ?? ""}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  [openMenu]: event.target.value,
                }))
              }
              placeholder={`Search ${
                columns.find((column) => column.index === openMenu)?.label ?? ""
              }`}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyFilter(openMenu)}
                className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => clearFilter(openMenu)}
                className="rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-700"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="mt-3 border-t border-zinc-200 pt-3">
            <button
              type="button"
              onClick={() => setSort(openMenu, "asc")}
              className="block w-full rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-100"
            >
              Sort A → Z
            </button>
            <button
              type="button"
              onClick={() => setSort(openMenu, "desc")}
              className="mt-1 block w-full rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-100"
            >
              Sort Z → A
            </button>
            {effectiveSortIndex === openMenu ? (
              <button
                type="button"
                onClick={clearSort}
                className="mt-2 block w-full rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hover:bg-zinc-100"
              >
                Clear sort
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={closeDropdown}
            className="mt-3 w-full rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hover:bg-zinc-100"
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
