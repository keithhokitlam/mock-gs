import Image from "next/image";
import Link from "next/link";
import NavBar from "../components/navbar";
import SectionNav from "./section-nav";
import GoToTopButton from "../components/go-to-top-button";
import CommercialNoticeBanner from "./commercial-notice-banner";
import fs from "fs";
import path from "path";

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

  return fs
    .readdirSync(slidesDir)
    .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
    .sort((a, b) => {
      const aSort = getSlideSortValue(a);
      const bSort = getSlideSortValue(b);
      if (aSort !== bSort) return aSort - bSort;
      return a.localeCompare(b);
    })
    .map((file) => `/foodcategory/${sectionDirName}/${file}`);
}

type FoodCategoryLocale = "en" | "zh";

const FOOD_CATEGORY_COPY = {
  en: {
    heading: "FOOD CATEGORY",
    seafood: "FISH & SEAFOOD",
    fruitsVegetables: "FRUITS & VEGETABLES",
    fruits: "FRUITS",
    completeListPrefix: "for complete list,",
    clickHere: "click here",
    seafoodAlt: "Seafood slide",
    fruitsAlt: "Fruits and vegetables slide",
    collageAlt:
      "Food category collage - fruits and vegetables with English and Chinese names including Orange, Passion Fruit, Pineapple, Jackfruit, Durian, Strawberry, Cherimoya, Tomato, Bay Berry, Mandarin, Cantaloupe, and Pitaya",
  },
  zh: {
    heading: "食品分类",
    seafood: "鱼类与海鲜",
    fruitsVegetables: "水果与蔬菜",
    fruits: "水果",
    completeListPrefix: "查看完整清单，",
    clickHere: "点击这里",
    seafoodAlt: "海鲜幻灯片",
    fruitsAlt: "水果与蔬菜幻灯片",
    collageAlt: "食品分类拼图，包含带中英文名称的水果和蔬菜",
  },
} as const;

function FoodCategoryPageContent({
  locale = "en",
}: {
  locale?: FoodCategoryLocale;
}) {
  const copy = FOOD_CATEGORY_COPY[locale];
  const seafoodSlides = getSectionSlideImages("Seafood");
  const fruitsAndVegetablesSlides = getSectionSlideImages("Fruits&Vegetables");

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
        {seafoodSlides.length > 0 && (
          <>
            <h2
              id="section-seafood"
              className="mb-4 scroll-mt-52 text-xl font-semibold text-zinc-900 font-beckman uppercase tracking-wide"
            >
              {copy.seafood}
            </h2>
            <div className="mb-10 space-y-6">
              {seafoodSlides.map((src, i) => (
                <div key={src} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
                  <Image
                    src={src}
                    alt={`${copy.seafoodAlt} ${i + 1}`}
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

        <h2 className="mb-4 scroll-mt-52 text-xl font-semibold text-zinc-900 font-beckman uppercase tracking-wide">
          {copy.fruitsVegetables}
        </h2>

        {fruitsAndVegetablesSlides.length > 0 ? (
          <div className="space-y-6">
            {fruitsAndVegetablesSlides.map((src, i) => (
              <div
                key={src}
                id={i === 0 && fruitsAndVegetablesSlides.length === 1 ? "section-fruits" : undefined}
                className={`space-y-6${i === 0 && fruitsAndVegetablesSlides.length === 1 ? " scroll-mt-52" : ""}`}
              >
                {i === 1 && (
                  <p
                    id={fruitsAndVegetablesSlides.length >= 2 ? "section-fruits" : undefined}
                    className="scroll-mt-52 text-lg font-semibold text-zinc-800 font-beckman"
                  >
                    {copy.fruits} ({copy.completeListPrefix}{" "}
                    <Link href={locale === "zh" ? "/zh/fruits" : "/fruits"} className="text-[#2B6B4A] hover:underline">
                      {copy.clickHere}
                    </Link>
                    )
                  </p>
                )}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
                  <Image
                    src={src}
                    alt={`${copy.fruitsAlt} ${i + 1}`}
                    width={1920}
                    height={1080}
                    quality={95}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
            <Image
              src="/foodcategory-collage.png"
              alt={copy.collageAlt}
              width={1200}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        )}
      </main>
      <GoToTopButton paths={["/foodcategory", "/consumer", "/zh/foodcategory", "/zh/consumer"]} />
    </div>
  );
}

export default function FoodCategoryPage() {
  return <FoodCategoryPageContent />;
}
