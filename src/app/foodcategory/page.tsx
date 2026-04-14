import Image from "next/image";
import Link from "next/link";
import NavBar from "../components/navbar";
import SectionNav from "./section-nav";
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

export default function FoodCategoryPage() {
  const seafoodSlides = getSectionSlideImages("Seafood");
  const fruitsAndVegetablesSlides = getSectionSlideImages("Fruits&Vegetables");

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-[67rem] px-4 py-12">
        <h1 className="mb-4 text-3xl font-semibold text-zinc-900 font-beckman">
          FOOD CATEGORY
        </h1>
        <SectionNav />

        {seafoodSlides.length > 0 && (
          <>
            <h2
              id="section-seafood"
              className="mb-4 scroll-mt-24 text-xl font-semibold text-zinc-900 font-beckman uppercase tracking-wide"
            >
              SEAFOOD
            </h2>
            <div className="mb-10 space-y-6">
              {seafoodSlides.map((src, i) => (
                <div key={src} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
                  <Image
                    src={src}
                    alt={`Seafood slide ${i + 1}`}
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

        <h2 className="mb-4 text-xl font-semibold text-zinc-900 font-beckman uppercase tracking-wide">
          FRUITS & VEGETABLES
        </h2>

        {fruitsAndVegetablesSlides.length > 0 ? (
          <div className="space-y-6">
            {fruitsAndVegetablesSlides.map((src, i) => (
              <div key={src} className="space-y-6">
                {i === 1 && (
                  <p id="section-fruits" className="scroll-mt-24 text-lg font-semibold text-zinc-800 font-beckman">
                    FRUITS (for complete list,{" "}
                    <Link href="/fruits" className="text-[#2B6B4A] hover:underline">
                      click here
                    </Link>
                    )
                  </p>
                )}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
                  <Image
                    src={src}
                    alt={`Fruits and vegetables slide ${i + 1}`}
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
              alt="Food category collage - fruits and vegetables with English and Chinese names including Orange, Passion Fruit, Pineapple, Jackfruit, Durian, Strawberry, Cherimoya, Tomato, Bay Berry, Mandarin, Cantaloupe, and Pitaya"
              width={1200}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        )}
      </main>
    </div>
  );
}
