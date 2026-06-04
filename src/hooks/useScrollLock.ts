"use client";

import { useEffect } from "react";

/**
 * Locks body scroll when `isOpen` is true, restoring when false.
 * Uses `overflow: hidden` and compensates for scrollbar width to prevent layout shift.
 */
export function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Calculate scrollbar width
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`
    );
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("--scrollbar-width");
    };
  }, [isOpen]);
}
