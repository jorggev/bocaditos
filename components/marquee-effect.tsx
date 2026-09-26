"use client";

import type { CSSProperties, ReactNode } from "react";

type MarqueeEffectProps = {
  children: ReactNode;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  speed?: number;
  speedOnHover?: number;
  gap?: number;
};

export function MarqueeEffect({
  children,
  direction = "horizontal",
  reverse = false,
  speed = 30,
  speedOnHover = 1,
  gap = 12,
}: MarqueeEffectProps) {
  const style = {
    "--marquee-duration": `${speed}s`,
    "--marquee-hover-duration": `${speed / speedOnHover}s`,
    "--marquee-gap": `${gap}px`,
  } as CSSProperties;

  return (
    <div className={`marquee relative overflow-hidden ${direction === "vertical" ? "marquee-vertical h-full" : "w-full"}`} style={style}>
      <div className={`marquee-track flex ${direction === "vertical" ? "flex-col" : "flex-row"} ${reverse ? "marquee-reverse" : ""}`}>
        <div className={`flex shrink-0 gap-[var(--marquee-gap)] ${direction === "vertical" ? "flex-col" : "flex-row"}`}>{children}</div>
        <div aria-hidden="true" className={`flex shrink-0 gap-[var(--marquee-gap)] ${direction === "vertical" ? "flex-col" : "flex-row"}`}>{children}</div>
      </div>
    </div>
  );
}