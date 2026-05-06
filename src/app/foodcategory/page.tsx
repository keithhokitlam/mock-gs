import Image from "next/image";
import { redirect } from "next/navigation";
import NavBar from "../components/navbar";
import SectionNav from "./section-nav";
import GoToTopButton from "../components/go-to-top-button";
import CommercialNoticeBanner from "./commercial-notice-banner";
import fs from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/auth";

function getSlideSortValue(filename: string): number {
  const slideNumberMatch = filename.match(/slide[\s_-]*(\d+)/i);
  if (slideNumberMatch) return Number(slideNumberMatch[1]);

  const firstNumberMatch = filename.match(/(\d+)/);
  if (firstNumberMatch) return Number(firstNumberMatch[1]);

  return Number.MAX_SAFE_INTEGER;
}

function getSectionSlideImages(sectionDirName: string): string[] {
  const slidesDir = path.join(process.cwd(), "public", "foodcategory", sectionDirName);
  if (!fs.existsSync(slidesDir)) return [];

  const publicDirPath = sectionDirName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return fs
    .readdirSync(slidesDir)
    .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
    .sort((a, b) => {
      const aSort = getSlideSortValue(a);
      const bSort = getSlideSortValue(b);
      if (aSort !== bSort) return aSort - bSort;
      return a.localeCompare(b);
    })
    .map((file) => `/foodcategory/${publicDirPath}/${encodeURIComponent(file)}`);
}

type FoodCategoryLocale = "en" | "zh";

const FOOD_CATEGORY_COPY = {
  en: {
    heading: "FOOD CATEGORY",
    aquatics: "AQUATICS",
    aquaticsAlt: "Aquatic species slide",
  },
  zh: {
    heading: "食品分类",
    aquatics: "水产",
    aquaticsAlt: "水产幻灯片",
  },
} as const;

async function FoodCategoryPageContent({
  locale = "en",
}: {
  locale?: FoodCategoryLocale;
}) {
  const user = await getCurrentUser();
  if (
    user &&
    user.essential_vs_premium !== "essential" &&
    user.essential_vs_premium !== "consumer"
  ) {
    redirect(locale === "zh" ? "/zh/mastertable" : "/mastertable");
  }

  const copy = FOOD_CATEGORY_COPY[locale];
  const aquaticSlides =
    locale === "en"
      ? getSectionSlideImages("Seafood/Aquatic/Consumer - Aquatic Species - Edition 202605")
      : [];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <CommercialNoticeBanner />
      <header className="sticky top-0 z-50">
        <NavBar />
        <div className="border-b border-dotted border-zinc-300/80 bg-zinc-50 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.12)]">
          <div className="mx-auto w-full max-w-[67rem] px-4 pb-4 pt-8">
            <h1 className="mb-4 text-3xl font-semibold text-zinc-900 font-beckman">
              {copy.heading}
            </h1>
            <SectionNav locale={locale} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[67rem] px-4 pb-12 pt-8">
        {locale === "en" && aquaticSlides.length > 0 && (
          <>
            <h2
              id="section-aquatics"
              className="mb-4 scroll-mt-52 text-xl font-semibold text-zinc-900 font-beckman uppercase tracking-wide"
            >
              {copy.aquatics}
            </h2>
            <div className="mb-10 space-y-6">
              {aquaticSlides.map((src, i) => (
                <div key={src} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
                  <Image
                    src={src}
                    alt={`${copy.aquaticsAlt} ${i + 1}`}
                    width={1920}
                    height={1080}
                    quality={95}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </>
        )}

      </main>
      <GoToTopButton paths={["/foodcategory", "/consumer", "/zh/foodcategory", "/zh/consumer"]} />
    </div>
  );
}

type FoodCategoryPageProps = Record<string, never>;

export default function FoodCategoryPage(props: FoodCategoryPageProps) {
  const locale =
    (props as FoodCategoryPageProps & { locale?: FoodCategoryLocale }).locale ?? "en";

  return <FoodCategoryPageContent locale={locale} />;
}
