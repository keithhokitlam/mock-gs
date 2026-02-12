"use client";

import Link from "next/link";
import DoorSplash from "./door-splash";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <DoorSplash />
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-4xl gap-8">
          <Link
            href="/consumer"
            className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white p-12 shadow-sm transition-all duration-300 hover:border-[#2B6B4A] hover:shadow-lg"
          >
            <span className="text-2xl font-semibold font-beckman text-zinc-900">
              Consumer
            </span>
            <p className="mt-2 text-center text-sm text-zinc-500">
              For personal grocery shopping and food adventures
            </p>
          </Link>
          <Link
            href="/commercialhome"
            className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white p-12 shadow-sm transition-all duration-300 hover:border-[#2B6B4A] hover:shadow-lg"
          >
            <span className="text-2xl font-semibold font-beckman text-zinc-900">
              Commercial
            </span>
            <p className="mt-2 text-center text-sm text-zinc-500">
              For businesses and professionals
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
