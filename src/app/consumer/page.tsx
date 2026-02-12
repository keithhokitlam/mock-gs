import Link from "next/link";
import NavBar from "../components/navbar";

export default function ConsumerPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold font-beckman text-zinc-900">
          Consumer
        </h1>
        <p className="mt-4 text-zinc-600">
          Our consumer experience is coming soon. Stay tuned!
        </p>
        <Link
          href="/"
          className="mt-8 text-[#2B6B4A] hover:underline font-medium"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
