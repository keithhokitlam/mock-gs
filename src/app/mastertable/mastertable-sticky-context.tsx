"use client";

import { createContext, useContext } from "react";

export type MastertableStickyState =
  | { mode: "off" }
  /** stackPx is undefined until measured; then frozen chrome height in px for thead sticky offset */
  | { mode: "mastertable"; stackPx: number | undefined };

export const MastertableStickyContext = createContext<MastertableStickyState>({ mode: "off" });

export function useMastertableStickyHeader(): MastertableStickyState {
  return useContext(MastertableStickyContext);
}
