"use client";

import { useEffect, useState } from "react";

const LOGO_HEIGHT = 400;
const LOGO_WIDTH = 600;
const HALF_HEIGHT = LOGO_HEIGHT / 2;
const ANIMATION_MS = 1200;

const LOGO_SRC = "/logos/GroceryShare_logo_stacked_1024.png";

type DoorSplashSlideUpProps = {
  onComplete?: () => void;
};

export default function DoorSplashSlideUp({ onComplete }: DoorSplashSlideUpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Start animation on next frame so closed state renders first
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      setIsHidden(true);
      onComplete?.();
    }, ANIMATION_MS);
    return () => clearTimeout(t);
  }, [isOpen, onComplete]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Top door — full width, 50vh; slides up off-screen */}
      <div
        className="fixed left-0 top-0 z-[60] flex w-full flex-1 items-end justify-center bg-white transition-transform ease-out"
        style={{
          height: "50vh",
          transform: isOpen ? "translateY(-100vh)" : "translateY(0)",
          transitionDuration: `${ANIMATION_MS}ms`,
        }}
        aria-hidden
      >
        <div
          className="relative shrink-0 overflow-hidden bg-no-repeat"
          style={{
            width: `${LOGO_WIDTH}px`,
            height: `${HALF_HEIGHT}px`,
            backgroundImage: `url(${LOGO_SRC})`,
            backgroundSize: `${LOGO_WIDTH}px ${LOGO_HEIGHT}px`,
            backgroundPosition: "0 0",
          }}
        />
      </div>
      {/* Bottom door — full width, 50vh; slides down off-screen */}
      <div
        className="fixed bottom-0 left-0 z-[60] flex w-full flex-1 items-start justify-center bg-white transition-transform ease-out"
        style={{
          height: "50vh",
          transform: isOpen ? "translateY(100vh)" : "translateY(0)",
          transitionDuration: `${ANIMATION_MS}ms`,
        }}
        aria-hidden
      >
        <div
          className="relative shrink-0 overflow-hidden bg-no-repeat"
          style={{
            width: `${LOGO_WIDTH}px`,
            height: `${HALF_HEIGHT}px`,
            backgroundImage: `url(${LOGO_SRC})`,
            backgroundSize: `${LOGO_WIDTH}px ${LOGO_HEIGHT}px`,
            backgroundPosition: `0 -${HALF_HEIGHT}px`,
          }}
        />
      </div>
    </>
  );
}
