"use client";

import Image from "next/image";
import Link from "next/link";
import DoorSplash from "./door-splash";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <DoorSplash />
      <nav className="sticky top-0 z-40 w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
        <div className="h-16" />
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <div className="-mt-[200px]">
          <Image
            src="/logos/Grocery-Share Logo (Bottom).png"
            alt="GroceryShare"
            width={600}
            height={600}
            priority
            className="h-auto w-[20.4rem] md:w-[25.5rem]"
          />
          <div className="-mt-[3.5rem] flex w-full max-w-4xl gap-8 md:-mt-[4.5rem]">
          <Link
            href="/consumer"
            className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white p-12 shadow-sm transition-all duration-300 hover:border-[#225a3d] hover:bg-[#225a3d] hover:shadow-lg group"
          >
            <span className="text-2xl font-semibold font-beckman text-zinc-900 transition-colors group-hover:text-white">
              Consumer
            </span>
            <p className="mt-2 text-center text-sm text-zinc-500 transition-colors group-hover:text-white/90">
              For personal grocery shopping and food adventures
            </p>
          </Link>
          <Link
            href="/commercialhome"
            className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white p-12 shadow-sm transition-all duration-300 hover:border-[#225a3d] hover:bg-[#225a3d] hover:shadow-lg group"
          >
            <span className="text-2xl font-semibold font-beckman text-zinc-900 transition-colors group-hover:text-white">
              Commercial
            </span>
            <p className="mt-2 text-center text-sm text-zinc-500 transition-colors group-hover:text-white/90">
              For businesses and professionals
            </p>
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
