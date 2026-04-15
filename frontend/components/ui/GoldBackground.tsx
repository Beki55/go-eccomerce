'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

export default function GoldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 60;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
    }));

    const isDark = resolvedTheme === 'dark';

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isDark) {
        const grad = ctx.createRadialGradient(
          canvas.width * 0.7, canvas.height * 0.2, 0,
          canvas.width * 0.7, canvas.height * 0.2, canvas.width * 0.7
        );
        grad.addColorStop(0, 'rgba(139, 115, 85, 0.08)');
        grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.04)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const grad2 = ctx.createRadialGradient(
          canvas.width * 0.2, canvas.height * 0.8, 0,
          canvas.width * 0.2, canvas.height * 0.8, canvas.width * 0.5
        );
        grad2.addColorStop(0, 'rgba(212, 175, 55, 0.06)');
        grad2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createRadialGradient(
          canvas.width * 0.8, canvas.height * 0.1, 0,
          canvas.width * 0.8, canvas.height * 0.1, canvas.width * 0.6
        );
        grad.addColorStop(0, 'rgba(212, 175, 55, 0.05)');
        grad.addColorStop(0.5, 'rgba(255, 215, 0, 0.03)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        const baseOpacity = isDark ? currentOpacity * 0.8 : currentOpacity * 0.4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 215, 0, ${baseOpacity})`
          : `rgba(212, 175, 55, ${baseOpacity})`;
        ctx.fill();

        if (isDark && p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${baseOpacity * 0.15})`;
          ctx.fill();
        }
      });

      drawGeometricPatterns(ctx, canvas.width, canvas.height, isDark);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  );
}

function drawGeometricPatterns(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  isDark: boolean
) {
  const goldColor = isDark ? 'rgba(212, 175, 55, 0.12)' : 'rgba(212, 175, 55, 0.06)';
  const goldColorStrong = isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)';

  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 0.5;

  ctx.beginPath();
  ctx.moveTo(w * 0.85, 0);
  ctx.lineTo(w, h * 0.15);
  ctx.lineTo(w, 0);
  ctx.closePath();
  ctx.strokeStyle = goldColorStrong;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, h * 0.85);
  ctx.lineTo(w * 0.15, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 0.4;

  const size = Math.min(w, h) * 0.08;
  const corners = [
    { x: 30, y: 30 },
    { x: w - 30, y: 30 },
    { x: 30, y: h - 30 },
    { x: w - 30, y: h - 30 },
  ];

  corners.forEach(corner => {
    ctx.beginPath();
    ctx.moveTo(corner.x, corner.y);
    ctx.lineTo(corner.x + size, corner.y);
    ctx.moveTo(corner.x, corner.y);
    ctx.lineTo(corner.x, corner.y + size);
    ctx.stroke();
  });

  ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.07)' : 'rgba(212, 175, 55, 0.04)';
  ctx.lineWidth = 0.3;

  for (let i = 0; i < 5; i++) {
    const cx = w * 0.9;
    const cy = h * 0.1;
    const r = (i + 1) * 40;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.5, Math.PI);
    ctx.stroke();
  }
}
