"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, PanInfo, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

interface Card {
  id: number;
  title: string;
  image: string;
}

const cards: Card[] = [
  { id: 1, title: "Coding", image: "/assets/home/coding.jpg" },
  { id: 2, title: "Writing", image: "/assets/home/writing.jpg" },
  { id: 3, title: "Virtual Art", image: "/assets/home/virtualart.jpg" },
  { id: 4, title: "Gaming", image: "/assets/home/gaming.jpg" },
  { id: 5, title: "3-D", image: "/assets/home/3d.jpg" },
];

export default function SmoothCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInteracting = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseZ = useMotionValue(0);

  const tiltX = useTransform(mouseX, [-200, 200], [15, -15]);
  const tiltY = useTransform(mouseY, [-200, 200], [-15, 15]);
  const depthZ = useTransform(mouseZ, [0, 100], [0, 40]);

  useEffect(() => {
    const rotate = () => {
      if (!isInteracting.current) {
        controls.start({
          x: 0,
          transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
        }).then(() => {
          setActiveIndex((prev) => (prev + 1) % cards.length);
        });
      }
      timeoutRef.current = setTimeout(rotate, 5000);
    };

    timeoutRef.current = setTimeout(rotate, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, controls]);

  const getCardStyle = (index: number) => {
    const offset = (index - activeIndex + cards.length) % cards.length;
    const position = offset > cards.length / 2 ? offset - cards.length : offset;
    const isCenter = index === activeIndex;

    return {
      x: position * 320,
      scale: isCenter ? 1.1 : 0.9,
      zIndex: isCenter ? cards.length + 1 : cards.length - Math.abs(position),
      opacity: isCenter ? 1 : 0.6,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.5,
      },
    };
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (index !== activeIndex) return;
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    mouseX.set(x - centerX);
    mouseY.set(y - centerY);
    mouseZ.set(Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / 5);
  };

  const handleDragStart = () => {
    isInteracting.current = true;
    controls.stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > 500) {
      const direction = info.offset.x > 0 ? -1 : 1;
      setActiveIndex((prev) => (prev + direction + cards.length) % cards.length);
    }

    isInteracting.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 5000);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[80vh] overflow-hidden bg-neutral-900 perspective-1000"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {cards.map((card, index) => {
          const isCenter = index === activeIndex;

          const dynamicStyle = {
            ...getCardStyle(index),
            ...(isCenter && {
              transform: `rotateY(${tiltX.get()}deg) rotateX(${tiltY.get()}deg) translateZ(${depthZ.get()}px)`,
            }),
          };

          return (
            <motion.div
              key={card.id}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
              className="absolute w-[280px] h-[380px] cursor-grab active:cursor-grabbing [transform-style:preserve-3d]"
              style={dynamicStyle as unknown as React.CSSProperties}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => {
                if (isCenter) {
                  mouseX.set(0);
                  mouseY.set(0);
                  mouseZ.set(0);
                }
              }}
              whileTap={{ scale: 0.95 }}
              transition={
                isCenter
                  ? {
                      rotateY: { type: "spring", stiffness: 300, damping: 15 },
                      rotateX: { type: "spring", stiffness: 300, damping: 15 },
                      z: { type: "spring", stiffness: 200, damping: 10 },
                    }
                  : {}
              }
            >
              <div
                className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 bg-white/5 backdrop-blur-sm"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isCenter ? "translateZ(0)" : undefined,
                }}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  priority={isCenter}
                  style={{
                    transform: isCenter ? "translateZ(30px)" : undefined,
                    transformStyle: "preserve-3d",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                  style={{
                    transform: isCenter ? "translateZ(20px)" : undefined,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-50">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveIndex(i);
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % cards.length);
              }, 5000);
            }}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex ? "w-6 bg-white" : "w-2 bg-white/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
