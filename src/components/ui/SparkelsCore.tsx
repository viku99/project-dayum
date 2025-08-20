'use client';

import React, { useRef, useEffect } from 'react';

interface SparkelsProps {
  className?: string;
  color?: string;
  maxSize?: number;
  minSize?: number;
}

export const SparkelsCore: React.FC<SparkelsProps> = ({
  className = '',
  color = '#ffffff',
  maxSize = 1.2,
  minSize = 0.4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const sparks = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * (maxSize - minSize) + minSize,
      alpha: Math.random() * 0.4 + 0.2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      sparks.forEach((spark) => {
        spark.x += spark.dx;
        spark.y += spark.dy;

        if (spark.x < 0 || spark.x > canvas.offsetWidth) spark.dx *= -1;
        if (spark.y < 0 || spark.y > canvas.offsetHeight) spark.dy *= -1;

        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = spark.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [color, maxSize, minSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
    />
  );
};
