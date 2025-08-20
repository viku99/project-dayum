"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";

const categories = [
  { 
    title: "Coding", 
    image: "/assets/home/coding.jpg", 
    link: "/homer/coding" 
  },
  { 
    title: "Writing", 
    image: "/assets/home/writing.jpg", 
    link: "/homer/writing" 
  },
  // ... add other categories
];

export default function VideoBackgroundCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate cards every 3.5 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % categories.length);
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Card positioning with carousel effect
  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    const distance = Math.abs(offset);
    
    return {
      x: offset * 300, // Horizontal spacing
      scale: 1 - distance * 0.2, // Scale down non-active cards
      zIndex: categories.length - distance, // Stacking order
      opacity: 1 - distance * 0.5 // Fade out non-active cards
    };
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Your video will go here */}
      {/* <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src="/your-video.mp4" type="video/mp4" />
      </video> */}

      {/* Carousel Container */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {categories.map((category, index) => {
          const { x, scale, zIndex, opacity } = getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={category.title}
              className="absolute cursor-pointer"
              style={{ 
                x, 
                scale, 
                zIndex, 
                opacity,
                originX: 0.5,
                originY: 0.5
              }}
              animate={{ 
                x, 
                scale, 
                opacity,
                transition: { type: "spring", stiffness: 100 }
              }}
              whileHover={{ scale: isActive ? 1.1 : scale + 0.1 }}
              onClick={() => isActive ? window.location.href = category.link : setActiveIndex(index)}
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                glareEnable
                glareMaxOpacity={0.2}
                glarePosition="all"
                scale={1.02}
                transitionSpeed={1500}
              >
                <div className="relative rounded-xl overflow-hidden border-2 border-white/20 w-[250px] h-[350px] backdrop-blur-sm bg-white/10">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={250}
                    height={350}
                    className="object-cover w-full h-full"
                    priority={isActive}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white text-lg font-bold">{category.title}</h3>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}