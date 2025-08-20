'use client';

import React, { useEffect, useRef } from 'react';

const CursorSparkTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const sparks: any[] = [];

    const createSpark = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        sparks.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          alpha: 1,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.alpha -= 0.02;

        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${spark.alpha})`;
        ctx.fill();

        if (spark.alpha <= 0) sparks.splice(i, 1);
      }

      requestAnimationFrame(draw);
    };

    const handleMove = (e: MouseEvent) => {
      createSpark(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMove);
    draw();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]"
    />
  );
};

export default CursorSparkTrail;
