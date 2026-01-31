import Image from "next/image";
import NavBar from "../components/navbar";

export default function FoodCategoryPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-[67rem] px-4 py-12">
        <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
          FOOD CATEGORY
        </h1>

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
      </main>
    </div>
  );
}
