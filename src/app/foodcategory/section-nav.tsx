"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToAnchor(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

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

type SectionNavLocale = "en" | "zh";

const SECTION_NAV_COPY = {
  en: {
    fruitsVegetables: "FRUITS & VEGETABLES",
    fruits: "Fruits",
    vegetable: "Vegetable",
    vegan: "Vegan",
    fishSeafood: "AQUATICS",
    fish: "Fish",
    shellfish: "Shellfish",
    other: "Other",
    meat: "MEAT",
    mammals: "Mammals",
    foodAdditives: "FOOD ADDICTIVES",
    processedFood: "PROCESSED FOOD",
  },
  zh: {
    fruitsVegetables: "水果与蔬菜",
    fruits: "水果",
    vegetable: "蔬菜",
    vegan: "纯素",
    fishSeafood: "鱼类与海鲜",
    fish: "鱼类",
    shellfish: "贝类",
    other: "其他",
    meat: "肉类",
    mammals: "哺乳类",
    foodAdditives: "食品添加剂",
    processedFood: "加工食品",
  },
} as const;

export default function SectionNav({ locale = "en" }: { locale?: SectionNavLocale }) {
  const pathname = usePathname();
  const actualLocale =
    locale === "zh" || pathname === "/zh" || pathname?.startsWith("/zh/") ? "zh" : "en";
  const copy = SECTION_NAV_COPY[actualLocale];
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
  const fishHasLink = true; // Aquatics
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
          {copy.fruitsVegetables}
          <ChevronDown open={openDropdown === "fruits"} muted={!fruitsHasLink} />
        </button>
        {openDropdown === "fruits" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <a
              href="#section-fruits"
              className={dropdownItemLinked}
              onClick={(e) => {
                e.preventDefault();
                setOpenDropdown(null);
                scrollToAnchor("section-fruits");
              }}
            >
              {copy.fruits}
            </a>
            <button type="button" className={dropdownItemUnlinked}>
              {copy.vegetable}
            </button>
            <button type="button" className={dropdownItemUnlinked}>
              {copy.vegan}
            </button>
          </div>
        )}
      </div>

      {/* AQUATICS */}
      <div className="relative">
        {actualLocale === "en" ? (
          <button
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              scrollToAnchor("section-aquatics");
            }}
            className={triggerClassActive}
          >
            {copy.fishSeafood}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "fish" ? null : "fish")}
              className={fishHasLink ? triggerClassActive : triggerClassMuted}
            >
              {copy.fishSeafood}
              <ChevronDown open={openDropdown === "fish"} muted={!fishHasLink} />
            </button>
            {openDropdown === "fish" && (
              <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                <a
                  href="#section-seafood"
                  className={dropdownItemLinked}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(null);
                    scrollToAnchor("section-seafood");
                  }}
                >
                  {copy.fish}
                </a>
                <button type="button" className={dropdownItemUnlinked}>
                  {copy.shellfish}
                </button>
                <button type="button" className={dropdownItemUnlinked}>
                  {copy.other}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MEAT */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "meat" ? null : "meat")}
          className={meatHasLink ? triggerClassActive : triggerClassMuted}
        >
          {copy.meat}
          <ChevronDown open={openDropdown === "meat"} muted={!meatHasLink} />
        </button>
        {openDropdown === "meat" && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <button type="button" className={dropdownItemUnlinked}>
              {copy.mammals}
            </button>
            <button type="button" className={dropdownItemUnlinked}>
              {copy.other}
            </button>
          </div>
        )}
      </div>

      {/* FOOD ADDICTIVES — no links */}
      <button type="button" className={standaloneUnlinkedClass}>
        {copy.foodAdditives}
      </button>

      {/* PROCESSED FOOD — no links */}
      <button type="button" className={standaloneUnlinkedClass}>
        {copy.processedFood}
      </button>
    </div>
  );
}
