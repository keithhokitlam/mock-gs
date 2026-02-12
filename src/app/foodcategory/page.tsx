import Image from "next/image";
import NavBar from "../components/navbar";
import SectionNav from "./section-nav";
import fs from "fs";
import path from "path";

function getSlideImages(): string[] {
  const slidesDir = path.join(process.cwd(), "public", "foodcategory");
  if (!fs.existsSync(slidesDir)) return [];
  return fs
    .readdirSync(slidesDir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort()
    .map((f) => `/foodcategory/${f}`);
}

export default function FoodCategoryPage() {
  const slideImages = getSlideImages();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-[67rem] px-4 py-12">
        <h1 className="mb-4 text-3xl font-semibold text-zinc-900 font-beckman">
          FOOD CATEGORY
        </h1>
        <SectionNav />

        {slideImages.length > 0 ? (
          <div className="space-y-6">
            {slideImages.map((src, i) => (
              <div
                key={src}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Food category slide ${i + 1}`}
                  width={1920}
                  height={1080}
                  quality={95}
                  className="w-full h-auto"
                  unoptimized
                />
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
