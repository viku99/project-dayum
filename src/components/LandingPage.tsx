'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/global.css';

// # Define rotating roles and motivational thoughts
const roles = ['Visual Artist', 'Animator', 'Writer'];
const thoughts = [
  'Work in progress — like everything else.',
  'Broken pieces make better art.',
  'This isn’t done. That’s the point.',
  'Refresh. Retry. Reinvent.',
];

// # Type definition for stars
type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
};

export default function LandingPage() {
  // # States
  const [roleIndex, setRoleIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showName, setShowName] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // # Refs
  const hasStartedAudioRef = useRef(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const whooshAudioRef = useRef<HTMLAudioElement | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftClicks = useRef(0);
  const rightClickFlag = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSources = ['/bg.mp4', '/bg2.mp4', '/bg3.mp4'];
  const videoIndexRef = useRef(0);

  const router = useRouter();

  // # Rotate roles and hide name
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    const hideNameTimeout = setTimeout(() => setShowName(false), 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(hideNameTimeout);
    };
  }, []);

// # Canvas stars — pulsing, floating & interactive stars that follow the mouse
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const STAR_COUNT = 250; // Number of stars to render

  // Star type definition
  const stars: {
    baseX: number;
    baseY: number;
    x: number;
    y: number;
    radius: number;
    angle: number;
    orbit: number;
    pulse: number;
    opacity: number;
    isFollowing: boolean;
    floatOffsetX: number;
    floatOffsetY: number;
    floatSpeedX: number;
    floatSpeedY: number;
  }[] = [];

  // Mouse coordinates
  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  // # Initialize stars with float motion params
  for (let i = 0; i < STAR_COUNT; i++) {
    const baseX = Math.random() * window.innerWidth;
    const baseY = Math.random() * window.innerHeight;

    stars.push({
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      radius: Math.random() * 1.5 + 0.5,
      angle: Math.random() * Math.PI * 2,
      orbit: Math.random() * 1.5 + 0.5,
      pulse: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      isFollowing: false,
      floatOffsetX: Math.random() * 100,
      floatOffsetY: Math.random() * 100,
      floatSpeedX: Math.random() * 0.2 - 0.1,
      floatSpeedY: Math.random() * 0.2 - 0.1,
    });
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const handleMouseMove = (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);

  let animationId: number;

  // # Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      // Update orbit angle for circular drift
      star.angle += 0.001 * star.orbit;

      // Update float offsets (soft drift motion)
      star.floatOffsetX += star.floatSpeedX;
      star.floatOffsetY += star.floatSpeedY;

      // Bounce float inside soft bounds to simulate wandering
      if (star.floatOffsetX > 20 || star.floatOffsetX < -20) star.floatSpeedX *= -1;
      if (star.floatOffsetY > 20 || star.floatOffsetY < -20) star.floatSpeedY *= -1;

      const floatX = star.baseX + Math.cos(star.angle) * 1.5 + star.floatOffsetX;
      const floatY = star.baseY + Math.sin(star.angle) * 1.5 + star.floatOffsetY;

      const dx = mouse.x - floatX;
      const dy = mouse.y - floatY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 300) {
        star.isFollowing = true;
      } else if (dist > 400) {
        star.isFollowing = false;
      }

      if (star.isFollowing) {
        star.x += (mouse.x - star.x) * 0.25;
        star.y += (mouse.y - star.y) * 0.25;
      } else {
        star.x = floatX;
        star.y = floatY;
      }

      const scale = 1 + 0.2 * Math.sin(Date.now() * 0.002 * star.pulse);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
  };
}, []);

  // # Audio setup
  useEffect(() => {
    bgAudioRef.current = new Audio('/bg.mp3');
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.5;
    whooshAudioRef.current = new Audio('/whoosh.mp3');
    return () => {
      bgAudioRef.current?.pause();
      bgAudioRef.current!.currentTime = 0;
    };
  }, []);

  // # Rotate videos
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      videoIndexRef.current = (videoIndexRef.current + 1) % videoSources.length;
      video.src = videoSources[videoIndexRef.current];
      video.load();
      video.play().catch(() => {});
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  // # Click listener for audio & secret combo
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button === 0) leftClicks.current++;
      if (e.button === 2) rightClickFlag.current = true;

      if (leftClicks.current >= 3 && rightClickFlag.current) {
        setShowSecret(true);
        new Audio('/whoosh.mp3').play().catch(() => {});
        leftClicks.current = 0;
        rightClickFlag.current = false;
        setTimeout(() => setShowSecret(false), 5000);
      }

      if (!hasStartedAudioRef.current) {
        bgAudioRef.current?.play().catch(() => {});
        hasStartedAudioRef.current = true;
      } else {
        setQuoteIndex((prev) => (prev + 1) % thoughts.length);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // # Cursor tracking on button
  const handleMouseMove = (e: React.MouseEvent) => {
    const button = btnRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  };

  // # Enter click logic
  const handleEnter = () => {
    bgAudioRef.current?.pause();
    bgAudioRef.current!.currentTime = 0;
    whooshAudioRef.current?.play();
    setFadeOut(true);
    setTimeout(() => router.push('/homer'), 800);
  };

  // # Deeper easter egg click
  const handleDeeperClick = useCallback(() => {
    console.log('You clicked deeper into the VOID.');
    // You can add more here
  }, []);

  // # Title animation
  const titleChars = 'Z O R O'.split('').map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className={`relative inline-block ${char === ' ' ? 'w-3 inline-block' : 'mx-0.5'}`}
      style={{ textShadow: '0 0 3px white, 0 0 6px white' }}
    >
      {char}
    </motion.span>
  ));

  return (
    <main className="font-satoshi relative h-screen w-full overflow-hidden bg-black text-white font-sans">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

      {/* 🔁 Background video loop */}
      <video
        ref={videoRef}
        src="/bg.mp4"
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover mix-blend-screen z-0"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0" />

      {/* Main content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 text-center">
        <AnimatePresence>
          {showName && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-wide select-none"
            >
              {titleChars}
            </motion.h1>
          )}
        </AnimatePresence>

        <motion.p
          key={roleIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-4 text-xl md:text-2xl text-gray-300 font-light blink-cursor"
        >
          {roles[roleIndex]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 p-6 md:p-8 max-w-xl backdrop-blur-md bg-white/5 border border-white/20 rounded-xl shadow-2xl"
        >
          <p className="text-sm md:text-base text-gray-200 leading-relaxed text-center select-none">
            {thoughts[quoteIndex]}
          </p>
        </motion.div>

        {/* Enter Button */}
        <motion.button
          ref={btnRef}
          onClick={handleEnter}
          onMouseMove={handleMouseMove}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="relative mt-10 px-10 py-4 rounded-2xl text-white text-lg font-semibold tracking-wider overflow-hidden border border-white/30 backdrop-blur-md bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 group active:scale-90"
        >
          <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 animate-border-sweep rounded-2xl z-0" />
          <span className="absolute inset-0 z-0 bg-white/10 blur-xl rounded-2xl opacity-20 group-hover:opacity-30 transition duration-300" />
          <span className="relative z-10 group-hover:opacity-0 transition">ENTER</span>
          <span className="absolute inset-0 flex justify-center items-center z-10 opacity-0 group-hover:opacity-100 transition">DIVE IN</span>
        </motion.button>

        {/* Scroll Down Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-6 animate-bounce text-gray-400"
        >
          ↓ scroll
        </motion.div>
      </div>

      {/* Easter Egg Secret Screen */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            key="easter-egg-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            role="dialog"
            aria-modal="true"
            onClick={handleDeeperClick}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 text-white text-2xl md:text-4xl font-bold tracking-wider select-none cursor-pointer"
          >
            <div className="text-center pointer-events-none">
              ✨ You just woke up the VOID
              <p className="text-sm mt-3 text-gray-400">click again to go deeper...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
