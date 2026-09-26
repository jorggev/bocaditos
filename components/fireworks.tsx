"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  alpha: number;
  color: string;
};

type Rocket = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  targetY: number;
  color: string;
  particles: Particle[];
};

const colors = ["#f97316", "#facc15", "#22c55e", "#0ea5e9", "#d946ef", "#ef4444"];

export function FireworksBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let lastLaunch = 0;
    const rockets: Rocket[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const launch = () => {
      const width = window.innerWidth;
      rockets.push({
        x: Math.random() * width,
        y: window.innerHeight,
        velocityX: (Math.random() - 0.5) * 1.5,
        velocityY: -(7 + Math.random() * 3),
        targetY: window.innerHeight * (0.15 + Math.random() * 0.35),
        color: colors[Math.floor(Math.random() * colors.length)],
        particles: [],
      });
    };

    const explode = (rocket: Rocket) => {
      for (let index = 0; index < 70; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        rocket.particles.push({
          x: rocket.x,
          y: rocket.y,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          alpha: 1,
          color: rocket.color,
        });
      }
    };

    const animate = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.fillStyle = "rgba(0, 0, 0, 0.14)";
      context.fillRect(0, 0, width, height);

      if (time - lastLaunch > 1000 + Math.random() * 1200) {
        launch();
        lastLaunch = time;
      }

      rockets.forEach((rocket) => {
        if (rocket.particles.length === 0) {
          rocket.x += rocket.velocityX;
          rocket.y += rocket.velocityY;
          rocket.velocityY += 0.08;
          context.fillStyle = rocket.color;
          context.beginPath();
          context.arc(rocket.x, rocket.y, 2, 0, Math.PI * 2);
          context.fill();

          if (rocket.y <= rocket.targetY || rocket.velocityY >= 0) explode(rocket);
        }

        rocket.particles.forEach((particle) => {
          particle.x += particle.velocityX;
          particle.y += particle.velocityY;
          particle.velocityY += 0.04;
          particle.alpha -= 0.015;
          context.globalAlpha = Math.max(particle.alpha, 0);
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
          context.fill();
          context.globalAlpha = 1;
        });
      });

      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        if (rockets[index].particles.length > 0 && rockets[index].particles.every((particle) => particle.alpha <= 0)) {
          rockets.splice(index, 1);
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export { FireworksBackground as Fireworks };
export default FireworksBackground;