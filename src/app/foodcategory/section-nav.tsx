"use client";

import { useState, useRef, useEffect } from "react";

export default function SectionNav() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 hover:border-zinc-300"
        >
          FRUITS & VEGETABLES
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Fruit
            </button>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Vegetable
            </button>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Vegan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
