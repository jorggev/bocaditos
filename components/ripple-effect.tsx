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
  id: number;
}

export function RippleEffect({
  children,
  color = "currentColor",
  duration = 0.6,
  className,
}: RippleProps) {
  const [ripples, setRipples] = React.useState<RipplePosition[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const nextRippleId = React.useRef(0);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const size = 24;
    const ripple = {
      x: event.clientX - rect.left - size / 2,
      y: event.clientY - rect.top - size / 2,
      id: nextRippleId.current++,
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
      onPointerDown={handlePointerDown}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x,
              top: ripple.y,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: color,
              transformOrigin: "center",
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}