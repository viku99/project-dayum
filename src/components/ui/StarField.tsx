'use client';

import React, { useRef, useEffect } from 'react';

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Initialize mouse position as {0,0}, set real values on mount
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial mouse position to center on mount (client only)
    mouse.current.x = window.innerWidth / 2;
    mouse.current.y = window.innerHeight / 2;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: {
      x: number;
      y: number;
      radius: number;
      speed: number;
      depth: number;
      angle: number;
    }[] = [];

    const numStars = 300;

    const generateStars = () => {
      for (let i = 0; i < numStars; i++) {
        const depth = Math.random(); // 0 to 1
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.5 + depth * 1.5,
          speed: 0.2 + depth * 0.6,
          depth,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Mouse gravity effect (orbital pull)
        const dx = mouse.current.x - star.x;
        const dy = mouse.current.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          star.angle += 0.02 * (1 - star.depth); // closer stars orbit more
          star.x += Math.cos(star.angle) * 0.6;
          star.y += Math.sin(star.angle) * 0.6;
        }

        // Star movement
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        // Vignette fade effect
        const fadeX = Math.abs(star.x - width / 2) / (width / 2);
        const fadeY = Math.abs(star.y - height / 2) / (height / 2);
        const edgeFade = 1 - Math.max(fadeX, fadeY) * 0.7;

        // Draw with soft glow
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + 0.5 * edgeFade})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5 + star.depth * 10;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    generateStars();
    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none"
    />
  );
};

export default StarField;
