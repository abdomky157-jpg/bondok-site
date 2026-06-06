"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ once });

  const hiddenClass = {
    up: "sr-hidden",
    left: "sr-hidden-left",
    right: "sr-hidden-right",
    scale: "sr-hidden-scale",
  }[direction];

  const visibleClass = {
    up: "sr-visible",
    left: "sr-visible-left",
    right: "sr-visible-right",
    scale: "sr-visible-scale",
  }[direction];

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? visibleClass : hiddenClass}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
