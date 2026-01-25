"use client";

import { useCallback, useEffect, useState } from "react";

const LOGO_HEIGHT = 400;
const LOGO_WIDTH = 600;
const HALF = LOGO_WIDTH / 2;
const ANIMATION_MS = 600;
const AUTO_PLAY_DELAY_MS = 800;

const LOGO_SRC = "/logos/GroceryShare_logo_stacked_1024.png";

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      aria-hidden
    >
      {/* Container: flexbox ensures both halves are side-by-side */}
      <div
        className="flex"
        style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
      >
        {/* Left half — shows left 300px of logo */}
        <div
          className="overflow-hidden transition-transform ease-out"
          style={{
            width: `${HALF}px`,
            height: `${LOGO_HEIGHT}px`,
            flexShrink: 0,
            transform: isOpen ? "translateX(-100%)" : "translateX(0)",
            transitionDuration: `${ANIMATION_MS}ms`,
          }}
        >
          <div
            style={{
              width: `${LOGO_WIDTH}px`,
              height: `${LOGO_HEIGHT}px`,
              backgroundImage: `url(${LOGO_SRC})`,
              backgroundSize: `${LOGO_WIDTH}px ${LOGO_HEIGHT}px`,
              backgroundPosition: "0 0",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
        {/* Right half — shows right 300px of logo */}
        <div
          className="relative overflow-hidden transition-transform ease-out"
          style={{
            width: `${HALF}px`,
            height: `${LOGO_HEIGHT}px`,
            flexShrink: 0,
            transform: isOpen ? "translateX(100%)" : "translateX(0)",
            transitionDuration: `${ANIMATION_MS}ms`,
          }}
        >
          <div
            className="absolute"
            style={{
              left: `-${HALF}px`,
              width: `${LOGO_WIDTH}px`,
              height: `${LOGO_HEIGHT}px`,
              backgroundImage: `url(${LOGO_SRC})`,
              backgroundSize: `${LOGO_WIDTH}px ${LOGO_HEIGHT}px`,
              backgroundPosition: `right center`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </div>
    </div>
  );
}
