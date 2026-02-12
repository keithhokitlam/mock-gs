"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const buttonClass =
  "flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 hover:border-zinc-300";
const dropdownItemClass = "block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100";

export default function SectionNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  return (
    <div ref={containerRef} className="mb-6 flex flex-wrap gap-3">
      {/* FRUITS & VEGETABLES */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "fruits" ? null : "fruits")}
          className={buttonClass}
        >
          FRUITS & VEGETABLES
          <ChevronDown open={openDropdown === "fruits"} />
        </button>
        {openDropdown === "fruits" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <Link
              href="#section-fruits"
              onClick={() => setOpenDropdown(null)}
              className={dropdownItemClass}
            >
              Fruits
            </Link>
            <button type="button" className={dropdownItemClass}>Vegetable</button>
            <button type="button" className={dropdownItemClass}>Vegan</button>
          </div>
        )}
      </div>

      {/* FISH & SEAFOOD */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "fish" ? null : "fish")}
          className={buttonClass}
        >
          FISH & SEAFOOD
          <ChevronDown open={openDropdown === "fish"} />
        </button>
        {openDropdown === "fish" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <button type="button" className={dropdownItemClass}>Fish</button>
            <button type="button" className={dropdownItemClass}>Shellfish</button>
            <button type="button" className={dropdownItemClass}>Other</button>
          </div>
        )}
      </div>

      {/* MEAT */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "meat" ? null : "meat")}
          className={buttonClass}
        >
          MEAT
          <ChevronDown open={openDropdown === "meat"} />
        </button>
        {openDropdown === "meat" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <button type="button" className={dropdownItemClass}>Mammals</button>
            <button type="button" className={dropdownItemClass}>Other</button>
          </div>
        )}
      </div>

      {/* FOOD ADDICTIVES */}
      <button type="button" className={buttonClass}>
        FOOD ADDICTIVES
      </button>

      {/* PROCESSED FOOD */}
      <button type="button" className={buttonClass}>
        PROCESSED FOOD
      </button>
    </div>
  );
}
