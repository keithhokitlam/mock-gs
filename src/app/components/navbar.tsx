import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function NavBar() {
  const user = await getCurrentUser();
  const userEmail = user?.email || null;

  return (
    <nav className="w-full bg-gradient-to-r from-white from-[0%] via-[#2B6B4A] via-[20%] to-[#2B6B4A]">
      <div className="flex w-full items-center justify-between gap-4 px-2 py-0">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/logos/GS_logo_highres_2x.png"
              alt="GroceryShare"
              width={260}
              height={104}
              className="h-16 w-auto translate-y-[2px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-12 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            <span className="font-beckman">About</span>
            <Link href="/pricing" className="font-beckman hover:opacity-80">
              Pricing
            </Link>
            <Link href="/support" className="font-beckman hover:opacity-80">
              Support
            </Link>
            <Link href="/contact" className="font-beckman hover:opacity-80">
              Contact
            </Link>
            <span className="font-beckman">FAQ</span>
          </div>
        </div>
        {userEmail && (
          <div className="text-white font-beckman text-xs">
            {userEmail}
          </div>
        )}
      </div>
    </nav>
  );
}
