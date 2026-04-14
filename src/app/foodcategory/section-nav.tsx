"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const ChevronDown = ({ open, muted }: { open: boolean; muted?: boolean }) => (
  <svg
    className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""} ${muted ? "text-zinc-400" : "text-zinc-600"}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const triggerClassActive =
  "flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 hover:border-zinc-300";

const triggerClassMuted =
  "flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-zinc-400 shadow-sm transition-colors hover:bg-zinc-100 hover:border-zinc-300";

const dropdownItemLinked =
  "block w-full px-4 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100";

const dropdownItemUnlinked =
  "block w-full cursor-default px-4 py-2 text-left text-sm text-zinc-400 hover:bg-transparent";

const standaloneUnlinkedClass = triggerClassMuted;

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

  const fruitsHasLink = true; // Fruits
  const fishHasLink = true; // Fish → seafood
  const meatHasLink = false;

  return (
    <div ref={containerRef} className="flex flex-wrap gap-3">
      {/* FRUITS & VEGETABLES */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "fruits" ? null : "fruits")}
          className={fruitsHasLink ? triggerClassActive : triggerClassMuted}
        >
          FRUITS & VEGETABLES
          <ChevronDown open={openDropdown === "fruits"} muted={!fruitsHasLink} />
        </button>
        {openDropdown === "fruits" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <Link
              href="#section-fruits"
              onClick={() => setOpenDropdown(null)}
              className={dropdownItemLinked}
            >
              Fruits
            </Link>
            <button type="button" className={dropdownItemUnlinked}>
              Vegetable
            </button>
            <button type="button" className={dropdownItemUnlinked}>
              Vegan
            </button>
          </div>
        )}
      </div>

      {/* FISH & SEAFOOD */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "fish" ? null : "fish")}
          className={fishHasLink ? triggerClassActive : triggerClassMuted}
        >
          FISH & SEAFOOD
          <ChevronDown open={openDropdown === "fish"} muted={!fishHasLink} />
        </button>
        {openDropdown === "fish" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <Link
              href="#section-seafood"
              onClick={() => setOpenDropdown(null)}
              className={dropdownItemLinked}
            >
              Fish
            </Link>
            <button type="button" className={dropdownItemUnlinked}>
              Shellfish
            </button>
            <button type="button" className={dropdownItemUnlinked}>
              Other
            </button>
          </div>
        )}
      </div>

      {/* MEAT */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "meat" ? null : "meat")}
          className={meatHasLink ? triggerClassActive : triggerClassMuted}
        >
          MEAT
          <ChevronDown open={openDropdown === "meat"} muted={!meatHasLink} />
        </button>
        {openDropdown === "meat" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <button type="button" className={dropdownItemUnlinked}>
              Mammals
            </button>
            <button type="button" className={dropdownItemUnlinked}>
              Other
            </button>
          </div>
        )}
      </div>

      {/* FOOD ADDICTIVES — no links */}
      <button type="button" className={standaloneUnlinkedClass}>
        FOOD ADDICTIVES
      </button>

      {/* PROCESSED FOOD — no links */}
      <button type="button" className={standaloneUnlinkedClass}>
        PROCESSED FOOD
      </button>
    </div>
  );
}
