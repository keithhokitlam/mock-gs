"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MastertableStickyContext, type MastertableStickyState } from "./mastertable-sticky-context";

type MastertableStickyLayoutProps = {
  header: ReactNode;
  children: ReactNode;
};

export default function MastertableStickyLayout({ header, children }: MastertableStickyLayoutProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [stackPx, setStackPx] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const sync = () => setStackPx(el.offsetHeight);

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  const value: MastertableStickyState = { mode: "mastertable", stackPx };

  return (
    <MastertableStickyContext.Provider value={value}>
      <div
        ref={stackRef}
        className="sticky top-0 z-50 bg-zinc-50 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.12)]"
      >
        {header}
      </div>
      <div className="w-full overflow-x-visible px-4 pb-10">{children}</div>
    </MastertableStickyContext.Provider>
  );
}
