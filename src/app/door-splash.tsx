"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const LOGO_SIZE = 400;
const LOGO_HEIGHT = LOGO_SIZE;
const LOGO_WIDTH = LOGO_SIZE;
const HALF = LOGO_WIDTH / 2;
const ANIMATION_MS = 3000;
const AUTO_PLAY_DELAY_MS = 800;

const LOGO_SRC = "/logos/Grocery-Share Logo.png";

export default function DoorSplash() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const openDoors = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
  }, [isOpen]);

  useEffect(() => {
    const t = setTimeout(openDoors, AUTO_PLAY_DELAY_MS);
    return () => clearTimeout(t);
  }, [openDoors]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setIsHidden(true), ANIMATION_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Left door — 50vw, white, logo half; slides off-screen left. No overlay — page shows through gap. */}
      <div
        className="fixed left-0 top-0 z-50 flex h-screen w-1/2 items-center justify-end bg-white transition-transform ease-out"
        style={{
          transform: isOpen ? "translateX(-100vw)" : "translateX(0)",
          transitionDuration: `${ANIMATION_MS}ms`,
        }}
        aria-hidden
      >
        <div className="relative shrink-0 overflow-hidden" style={{ width: HALF, height: LOGO_SIZE }}>
          <Image
            src={LOGO_SRC}
            alt=""
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className="object-cover"
            style={{ objectPosition: "left center" }}
            unoptimized
          />
        </div>
      </div>
      {/* Right door — 50vw, white, logo half; slides off-screen right */}
      <div
        className="fixed right-0 top-0 z-50 flex h-screen w-1/2 items-center justify-start bg-white transition-transform ease-out"
        style={{
          transform: isOpen ? "translateX(100vw)" : "translateX(0)",
          transitionDuration: `${ANIMATION_MS}ms`,
        }}
        aria-hidden
      >
        <div className="relative shrink-0 overflow-hidden" style={{ width: HALF, height: LOGO_SIZE }}>
          <Image
            src={LOGO_SRC}
            alt=""
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className="object-cover"
            style={{ objectPosition: "right center", marginLeft: -HALF }}
            unoptimized
          />
        </div>
      </div>
    </>
  );
}
