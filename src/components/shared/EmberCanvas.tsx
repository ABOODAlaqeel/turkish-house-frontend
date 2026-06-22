"use client";

import { useEffect, useRef } from "react";

interface EmberCanvasProps {
  particleCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function EmberCanvas({ particleCount = 40, className = "", style }: EmberCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = canvas.width = parent.clientWidth;
      h = canvas.height = parent.clientHeight;
    };
    resize();

    const colors: [number, number, number][] = [
      [232, 118, 43],   // accent orange
      [244, 169, 60],   // light gold
      [139, 36, 56],    // brand wine red
      [255, 200, 100],  // bright gold
      [200, 80, 40],    // deep ember
    ];

    interface P {
      x: number; y: number;
      vx: number; vy: number;
      s: number; a: number;
      l: number; ml: number;
      c: [number, number, number];
    }

    const pool: P[] = [];

    const spawn = (rand = false): P => ({
      x: Math.random() * w,
      y: rand ? Math.random() * h : h + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 1 + 0.3),
      s: Math.random() * 2.5 + 0.8,
      a: Math.random() * 0.55 + 0.25,
      l: 0,
      ml: Math.random() * 400 + 120,
      c: colors[Math.floor(Math.random() * colors.length)],
    });

    for (let i = 0; i < particleCount; i++) pool.push(spawn(true));

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        p.l++;

        // Mouse attraction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120 && d > 0) {
          p.vx += (dx / d) * 0.025;
          p.vy += (dy / d) * 0.025;
        }

        // Wind sway
        p.vx += Math.sin(p.l * 0.012 + p.x * 0.001) * 0.006;
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.997;
        p.vy *= 0.999;

        const t = p.l / p.ml;
        const alpha = p.a * (1 - t);
        const size = p.s * (1 - t * 0.3);
        const [r, g, b] = p.c;

        // Outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.8})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.15})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha * 1.6, 1)})`;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Recycle
        if (p.l >= p.ml || p.y < -30 || p.x < -30 || p.x > w + 30) {
          pool[i] = spawn();
        }
      }
      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: "screen", ...style }}
    />
  );
}
