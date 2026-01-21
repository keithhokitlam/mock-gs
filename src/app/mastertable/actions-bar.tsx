"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ActionsBarProps = {
  columns: string[];
  rows: string[][];
};

function escapeCsvValue(value: string) {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function buildCsv(columns: string[], rows: string[][]) {
  const header = columns.map((column) => escapeCsvValue(column)).join(",");
  const body = rows.map((row) =>
    row.map((cell) => escapeCsvValue(cell ?? "")).join(",")
  );
  return `\uFEFF${[header, ...body].join("\n")}`;
}

function buildPlainText(columns: string[], rows: string[][]) {
  const header = columns.join("\t");
  const body = rows.map((row) => row.map((cell) => cell ?? "").join("\t"));
  return [header, ...body].join("\n");
}

function buildExcelHtml(columns: string[], rows: string[][]) {
  const header = columns.map((column) => `<th>${column}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${cell ?? ""}</td>`)
          .join("")}</tr>`
    )
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8" /></head><body><table>${header ? `<thead><tr>${header}</tr></thead>` : ""}<tbody>${body}</tbody></table></body></html>`;
}

function downloadFile(contents: string, filename: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ActionsBar({ columns, rows }: ActionsBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);
  const safeColumns = useMemo(
    () => columns.map((column) => column ?? ""),
    [columns]
  );
  const safeRows = useMemo(
    () => rows.map((row) => row.map((cell) => cell ?? "")),
    [rows]
  );

  const handleExport = (format: "excel" | "csv" | "txt") => {
    setIsOpen(false);
    if (format === "excel") {
      downloadFile(
        buildExcelHtml(safeColumns, safeRows),
        "groceryshare-export.xls",
        "application/vnd.ms-excel"
      );
      return;
    }
    if (format === "csv") {
      downloadFile(
        buildCsv(safeColumns, safeRows),
        "groceryshare-export.csv",
        "text/csv"
      );
      return;
    }
    downloadFile(
      buildPlainText(safeColumns, safeRows),
      "groceryshare-export.txt",
      "text/plain"
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!exportMenuRef.current) return;
      if (!exportMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex items-center justify-end gap-3 pb-3">
      <div className="relative" ref={exportMenuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-md bg-zinc-400 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          Export
        </button>
        {isOpen ? (
          <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-md border border-zinc-200 bg-white text-xs text-zinc-900 shadow-lg">
            <button
              type="button"
              onClick={() => handleExport("excel")}
              className="block w-full px-3 py-2 text-left font-semibold uppercase tracking-wide hover:bg-zinc-100"
            >
              Excel
            </button>
            <button
              type="button"
              onClick={() => handleExport("csv")}
              className="block w-full px-3 py-2 text-left font-semibold uppercase tracking-wide hover:bg-zinc-100"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport("txt")}
              className="block w-full px-3 py-2 text-left font-semibold uppercase tracking-wide hover:bg-zinc-100"
            >
              Plain Text
            </button>
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-md bg-zinc-400 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Print
      </button>
      <Link
        href="/mastertable"
        className="rounded-md bg-zinc-400 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Clear All Filters
      </Link>
    </div>
  );
}
