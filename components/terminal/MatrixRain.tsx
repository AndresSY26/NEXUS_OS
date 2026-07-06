'use client';

import React, { useEffect, useRef } from 'react';
import { themeHexMap } from './themes';

interface MatrixRainProps {
  theme: string;
}

export function MatrixRain({ theme }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const color = themeHexMap[theme] || '#00FF41';

    // Caracteres en código de máquina (0 y 1)
    const chars = '01';
    const charArray = chars.split('');

    const fontSize = 20;
    const colWidth = fontSize + 6;
    const columns = Math.floor(width / colWidth) + 1;
    const drops: number[] = Array(columns).fill(1);

    // Control de velocidad mediante limitación de FPS (frames por segundo)
    let lastTime = 0;
    const fps = 15; // 15 FPS permite que los números cayendo se entiendan perfectamente
    const interval = 1000 / fps;

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      const delta = currentTime - lastTime;
      if (delta < interval) return;

      // Ajustar lastTime
      lastTime = currentTime - (delta % interval);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Ocasionalmente destaca algún número en blanco brillante
        const isBright = Math.random() > 0.98;
        if (isBright) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = color;
        }

        const x = i * colWidth;
        const y = drops[i] * (fontSize + 4);

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame((timestamp) => {
      lastTime = timestamp;
      draw(timestamp);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15] z-0"
    />
  );
}
