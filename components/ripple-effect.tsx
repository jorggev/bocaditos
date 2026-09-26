"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";

interface RippleProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  className?: string;
}

interface RipplePosition {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function RippleEffect({
  children,
  color = "rgba(255, 255, 255, 0.7)",
  duration = 0.8,
  className,
}: RippleProps) {
  const [ripples, setRipples] = React.useState<RipplePosition[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      size,
      id: Date.now(),
    };

    setRipples((current) => [...current, ripple]);
    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== ripple.id));
    }, duration * 1000);
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex overflow-hidden rounded-lg ${className ?? ""}`}
      onMouseDown={handleMouseDown}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y, opacity: 0.5 }}
            animate={{
              width: ripple.size,
              height: ripple.size,
              x: ripple.x - ripple.size / 2,
              y: ripple.y - ripple.size / 2,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: "easeOut" }}
            style={{
              position: "absolute",
              borderRadius: "100%",
              backgroundColor: color,
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}