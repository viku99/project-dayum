'use client';
import React, { useRef, useEffect } from 'react';

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  directionX: number;
  directionY: number;
}

interface SparklesProps {
  particleCount?: number;
  minSize?: number;
  maxSize?: number;
  color?: string;
  speed?: number;
  className?: string;
}

const Sparkles = ({
  particleCount = 100,
  minSize = 1,
  maxSize = 3,
  color = '#ffffff',
  speed = 0.3,
  className = '',
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const sparkles: Sparkle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (maxSize - minSize) + minSize,
      opacity: Math.random(),
      directionX: (Math.random() - 0.5) * speed,
      directionY: (Math.random() - 0.5) * speed,
    }));

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      sparkles.forEach((sparkle) => {
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity})`;
        ctx.fill();
      });
    };

    const update = () => {
      sparkles.forEach((sparkle) => {
        sparkle.x += sparkle.directionX;
        sparkle.y += sparkle.directionY;

        if (sparkle.x < 0 || sparkle.x > width) sparkle.directionX *= -1;
        if (sparkle.y < 0 || sparkle.y > height) sparkle.directionY *= -1;
      });
    };

    const animate = () => {
      update();
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount, minSize, maxSize, color, speed]);

  return <canvas ref={canvasRef} className={`absolute top-0 left-0 z-0 ${className}`} />;
};

export default Sparkles;
