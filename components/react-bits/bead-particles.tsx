"use client";

import { useEffect, useRef, useCallback } from "react";

interface BeadParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  targetOpacity: number;
  phase: number;
}

const BEAD_COLORS = [
  "#5E6AD2", // indigo
  "#9373EE", // purple
  "#FF6B6B", // coral
  "#FFB300", // amber
  "#2EA244", // green
  "#4371C7", // blue
  "#EF3E6F", // pink
  "#F98421", // orange
  "#784198", // deep purple
  "#30CCCC", // teal
  "#C71585", // magenta
  "#77C74A", // lime
  "#FEE434", // yellow
  "#D4AF37", // gold
  "#FFFFFF", // white
];

interface BeadParticlesProps {
  particleCount?: number;
  className?: string;
}

export default function BeadParticles({
  particleCount = 80,
  className = "",
}: BeadParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<BeadParticle[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: BeadParticle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.15,
          radius: 2 + Math.random() * 4,
          color: BEAD_COLORS[Math.floor(Math.random() * BEAD_COLORS.length)],
          opacity: 0.2 + Math.random() * 0.4,
          targetOpacity: 0.2 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
      return particles;
    },
    [particleCount]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles = particlesRef.current;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Only init particles on first resize or if none exist
      if (particles.length === 0) {
        particles = initParticles(width, height);
        particlesRef.current = particles;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - timeRef.current) / 16.667, 3); // cap delta
      timeRef.current = timestamp;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Wrap around edges
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Subtle opacity pulsing
        p.opacity += (p.targetOpacity - p.opacity) * 0.003 * dt;
        if (Math.random() < 0.002 * dt) {
          p.targetOpacity = 0.15 + Math.random() * 0.5;
        }

        // Draw bead
        const alpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Outer glow
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 2.5
        );
        gradient.addColorStop(0, p.color + hexAlpha(alpha));
        gradient.addColorStop(0.5, p.color + hexAlpha(alpha * 0.3));
        gradient.addColorStop(1, p.color + hexAlpha(0));
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw subtle connections between nearby beads
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = particles[i].color + hexAlpha(alpha);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}

/** Convert 0-1 alpha to 2-digit hex */
function hexAlpha(alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const int = Math.round(clamped * 255);
  return int.toString(16).padStart(2, "0");
}
