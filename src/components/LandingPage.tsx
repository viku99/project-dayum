'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/global.css';

// Define rotating roles and motivational thoughts
const roles = ['Visual Artist', 'Animator', 'Writer'];
const thoughts = [
  'Work in progress — like everything else.',
  'Broken pieces make better art.',
  'This isn’t done. That’s the point.',
  'Refresh. Retry. Reinvent.',
];

export default function LandingPage() {
  // States
  const [roleIndex, setRoleIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showName, setShowName] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');

  // Refs
  const hasStartedAudioRef = useRef(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const whooshAudioRef = useRef<HTMLAudioElement | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSources = ['/bg.mp4', '/bg2.mp4', '/bg3.mp4'];
  const videoIndexRef = useRef(0);
  const particlesRef = useRef<Array<{x: number, y: number, size: number, speedX: number, speedY: number, life: number}>>([]);
  const resizeTimeoutRef = useRef<number | null>(null);
  const mouseMoveTimeoutRef = useRef<number | null>(null);

  const router = useRouter();

  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = window.setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle cursor position with debounce
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
      
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Create particles on mouse move
      if (Math.random() > 0.7) {
        createParticles(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle animation
  useEffect(() => {
    let animationFrameId: number;
    
    const animateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => particle.life > 0);
      
      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= 1;
      });
      
      animationFrameId = requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const createParticles = (x: number, y: number) => {
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x,
        y,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        life: Math.random() * 50 + 20
      });
    }
  };

  // Rotate roles and hide name
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

  // Canvas stars — pulsing, floating & interactive stars that follow the mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const STAR_COUNT = windowSize.width < 768 ? 150 : 250;

    const mouse = {
      x: windowSize.width / 2,
      y: windowSize.height / 2,
    };

    const stars = Array.from({ length: STAR_COUNT }, () => {
      const baseX = Math.random() * windowSize.width;
      const baseY = Math.random() * windowSize.height;

      return {
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
      };
    });

    const handleResize = () => {
      canvas.width = windowSize.width;
      canvas.height = windowSize.height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      ctx.save();
      particlesRef.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.life / 70})`;
        ctx.fill();
      });
      ctx.restore();

      // Draw stars
      stars.forEach((star) => {
        star.angle += 0.001 * star.orbit;
        star.floatOffsetX += star.floatSpeedX;
        star.floatOffsetY += star.floatSpeedY;

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
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [windowSize]);

  // Audio setup
  useEffect(() => {
    bgAudioRef.current = new Audio('/bg.mp3');
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.5;
    
    whooshAudioRef.current = new Audio('/whoosh.mp3');
    whooshAudioRef.current.volume = 0.7;
    
    return () => {
      bgAudioRef.current?.pause();
      if (bgAudioRef.current) {
        bgAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Video loading and rotation
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleEnded = () => {
      videoIndexRef.current = (videoIndexRef.current + 1) % videoSources.length;
      video.src = videoSources[videoIndexRef.current];
      video.load();
      video.play().catch(() => {});
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Click listener for audio
  useEffect(() => {
    const handleClick = () => {
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

  // Cursor tracking on button
  const handleMouseMove = (e: React.MouseEvent) => {
    const button = btnRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
    
    // Create particles on button hover
    createParticles(e.clientX, e.clientY);
  };

  // Enter click logic
  const handleEnter = () => {
    bgAudioRef.current?.pause();
    if (bgAudioRef.current) {
      bgAudioRef.current.currentTime = 0;
    }
    whooshAudioRef.current?.play();
    setFadeOut(true);
    setTimeout(() => router.push('/homer'), 800);
  };

  // Toggle video/audio mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
    
    if (bgAudioRef.current) {
      bgAudioRef.current.muted = !bgAudioRef.current.muted;
    }
  };

  // Toggle video play/pause
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  // Handle newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Newsletter signup:', email);
    setShowNewsletter(false);
    setEmail('');
  };

  // Title animation
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
    <main className={`font-satoshi relative h-screen w-full overflow-hidden bg-black text-white font-sans ${fadeOut ? 'opacity-0 transition-opacity duration-800' : ''}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0" 
      />


      {/* Background video loop */}
      <video
        ref={videoRef}
        src={videoSources[0]}
        autoPlay
        muted={isMuted}
        playsInline
        loop
        className="absolute top-0 left-0 w-full h-full object-cover mix-blend-screen z-0"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-transparent to-black/70 z-0" />

      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <button 
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L12 3v18l-4.5-4.5H4a1 1 0 01-1-1v-7a1 1 0 011-1h3.5z" />
            </svg>
          )}
        </button>
        
        <button 
          onClick={toggleVideoPlayback}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
          aria-label={isVideoPlaying ? "Pause video" : "Play video"}
        >
          {isVideoPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <button 
          onClick={() => setShowNewsletter(true)}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
          aria-label="Newsletter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

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
          className="absolute bottom-6 animate-bounce text-gray-400 text-sm"
        >
          ↓ scroll or click anywhere
        </motion.div>
      </div>

      {/* Subtle footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 1 }}
        className="absolute bottom-2 left-0 w-full text-center text-xs text-gray-500 z-20"
      >
        © {new Date().getFullYear()} ZORO — All rights reserved
      </motion.div>

      {/* Newsletter Modal */}
      <AnimatePresence>
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowNewsletter(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-black p-6 rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
              <p className="mb-4">Join my newsletter to receive updates on new projects and exhibitions.</p>
              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full p-3 border border-gray-300 rounded mb-4"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                  >
                    Subscribe
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewsletter(false)}
                    className="flex-1 bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}