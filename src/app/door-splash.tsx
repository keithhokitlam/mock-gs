"use client";

import { useCallback, useEffect, useState } from "react";

const LOGO_WIDTH = 400;
const LOGO_HEIGHT = 300;
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
      {/* Left door — left half of logo, meets center; slides off-screen left */}
      <div
        className="fixed left-0 top-0 z-50 flex h-screen w-1/2 items-center justify-end bg-white transition-transform ease-out"
        style={{
          transform: isOpen ? "translateX(-100vw)" : "translateX(0)",
          transitionDuration: `${ANIMATION_MS}ms`,
        }}
        aria-hidden
      >
        <div
          className="relative shrink-0 overflow-hidden bg-no-repeat"
          style={{
            width: HALF,
            height: LOGO_HEIGHT,
            backgroundImage: `url("${LOGO_SRC.replace(/ /g, "%20")}")`,
            backgroundSize: `${LOGO_WIDTH}px ${LOGO_HEIGHT}px`,
            backgroundPosition: "left center",
          }}
        />
      </div>
      {/* Right door — right half of logo, meets center; slides off-screen right */}
      <div
        className="fixed right-0 top-0 z-50 flex h-screen w-1/2 items-center justify-start bg-white transition-transform ease-out"
        style={{
          transform: isOpen ? "translateX(100vw)" : "translateX(0)",
          transitionDuration: `${ANIMATION_MS}ms`,
        }}
        aria-hidden
      >
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: HALF,
            height: LOGO_HEIGHT,
            backgroundImage: `url("${LOGO_SRC.replace(/ /g, "%20")}")`,
            backgroundSize: `${LOGO_WIDTH}px ${LOGO_HEIGHT}px`,
            backgroundPosition: "right center",
          }}
        />
      </div>
    </>
  );
}
