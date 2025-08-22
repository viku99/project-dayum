// app/page.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Clock, User, Search, Menu, BookOpen, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

/**
 * ============================================
 * Fireside — Premium Reading Experience
 * ============================================
 * Clean, organized, and visually balanced design
 */

/* =========================
   Data types
   =========================
*/
interface Author {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
}

interface ImageRef {
  url: string;
  alt: string;
  width: number;
  height: number;
  attribution?: string;
}

interface Category {
  name: string;
  slug: string;
  color: string;
  textColor: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  publishedAt: string;
  author: Author;
  featuredImage: ImageRef;
  readTime: number;
  category: Category;
  isPremium?: boolean;
  tags?: string[];
}

/* ===============================
   High-performance mock data
   ===============================
*/
function getFeaturedArticles(): Article[] {
  // Generate gradient-based placeholder images (GPU friendly)
  const generateGradient = (width: number, height: number, colors: string[]) => 
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">${colors.map((color, i) => `<stop offset="${i * 100 / (colors.length - 1)}%" stop-color="${color}"/>`).join('')}</linearGradient></defs><rect width="100%" height="100%" fill="url(%23grad)"/></svg>`;

  const gradients = [
    ['#FF7E5F', '#FEB47B'], // Warm orange
    ['#FF6B6B', '#FF8E53'], // Coral to orange
    ['#4ECDC4', '#556270'], // Teal to dark blue
    ['#EDE574', '#E1F5C4'], // Yellow to light green
    ['#FFAFBD', '#FFC3A0'], // Pink to peach
    ['#7F00FF', '#E100FF'], // Purple to pink
    ['#FF416C', '#FF4B2B'], // Red to orange
    ['#8E2DE2', '#4A00E0'], // Purple to blue
    ['#FF5F6D', '#FFC371'], // Coral to yellow
    ['#2193b0', '#6dd5ed'], // Blue to light blue
    ['#ee9ca7', '#ffdde1'], // Pink to light pink
    ['#B06AB3', '#4568DC']  // Purple to blue
  ];

  const now = new Date();
  const articles: Article[] = [
    {
      id: "a-01",
      slug: "the-art-of-quiet-reading",
      title: "The Art of Quiet Reading",
      excerpt: "Why slow reading matters: a gentle manifesto for reclaiming deep attention in a distracted age.",
      body: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      author: { name: "E. Hawthorne", slug: "e-hawthorne", avatar: generateGradient(40, 40, ['#FF7E5F', '#FEB47B']) },
      featuredImage: { url: generateGradient(1400, 900, gradients[0]), alt: "A quiet reading nook", width: 1400, height: 900 },
      readTime: 8,
      category: { name: "Essays", slug: "essays", color: "bg-amber-100", textColor: "text-amber-800" },
    },
    {
      id: "a-02",
      slug: "sherlock-on-the-mind",
      title: "Sherlock on the Mind: Observation and Inference",
      excerpt: "How the detective's methods teach us observation, patience, and cognitive craft.",
      body: "To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name.",
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      author: { name: "A. Doyle", slug: "a-doyle", avatar: generateGradient(40, 40, ['#FF6B6B', '#FF8E53']) },
      featuredImage: { url: generateGradient(1400, 900, gradients[1]), alt: "Magnifying glass over text", width: 1400, height: 900 },
      readTime: 12,
      category: { name: "Analysis", slug: "analysis", color: "bg-blue-100", textColor: "text-blue-800" },
      isPremium: true,
    },
    {
      id: "a-03",
      slug: "on-reading-frankenstein",
      title: "On Reading Frankenstein",
      excerpt: "A reflective journey through Shelley's prose: empathy, creation, and consequence.",
      body: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      author: { name: "M. Shelley", slug: "m-shelley", avatar: generateGradient(40, 40, ['#4ECDC4', '#556270']) },
      featuredImage: { url: generateGradient(1400, 900, gradients[2]), alt: "Fog over an old house", width: 1400, height: 900 },
      readTime: 11,
      category: { name: "Book Review", slug: "book-review", color: "bg-rose-100", textColor: "text-rose-800" },
    },
    {
      id: "a-04",
      slug: "the-ethics-of-reading",
      title: "The Ethics of Reading",
      excerpt: "Ownership, interpretation, and the moral dimensions of storytelling.",
      body: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      author: { name: "L. Emerson", slug: "l-emerson", avatar: generateGradient(40, 40, ['#EDE574', '#E1F5C4']) },
      featuredImage: { url: generateGradient(1400, 900, gradients[3]), alt: "Open book and cup", width: 1400, height: 900 },
      readTime: 9,
      category: { name: "Philosophy", slug: "philosophy", color: "bg-emerald-100", textColor: "text-emerald-800" },
    },
    {
      id: "a-05",
      slug: "how-to-savor-long-forms",
      title: "How to Savor Long-forms",
      excerpt: "Micro-habits and reading rituals that help you finish long pieces with joy.",
      body: "To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name.",
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 28).toISOString(),
      author: { name: "C. Hart", slug: "c-hart", avatar: generateGradient(40, 40, ['#FFAFBD', '#FFC3A0']) },
      featuredImage: { url: generateGradient(1400, 900, gradients[4]), alt: "Reader by a window", width: 1400, height: 900 },
      readTime: 7,
      category: { name: "Guides", slug: "guides", color: "bg-violet-100", textColor: "text-violet-800" },
    },
    // Grid articles
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `g-${i + 1}`,
      slug: `article-${i + 1}`,
      title: `Deep Dive: The Art of Narrative ${i + 1}`,
      excerpt: `Exploring the intricate patterns of storytelling in modern literature ${i + 1}.`,
      body: "Sample content here...",
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * (35 + i * 10)).toISOString(),
      author: { 
        name: [`J. Austen`, `F. Kafka`, `V. Woolf`, `G. Marquez`, `T. Morrison`, `H. Murakami`][i],
        slug: `author-${i + 1}`,
        avatar: generateGradient(40, 40, gradients[i + 5])
      },
      featuredImage: { 
        url: generateGradient(640, 420, gradients[i + 5]), 
        alt: `Article image ${i + 1}`, 
        width: 640, 
        height: 420 
      },
      readTime: 5 + i,
      category: { 
        name: [`Fiction`, `Philosophy`, `Memoir`, `Fantasy`, `History`, `Poetry`][i],
        slug: `category-${i + 1}`,
        color: [`bg-amber-100`, `bg-blue-100`, `bg-lime-100`, `bg-rose-100`, `bg-cyan-100`, `bg-fuchsia-100`][i],
        textColor: [`text-amber-800`, `text-blue-800`, `text-lime-800`, `text-rose-800`, `text-cyan-800`, `text-fuchsia-800`][i]
      },
    }))
  ];

  return articles;
}

/* ============================
   Performance-optimized helpers
   ============================ */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
};

// Custom CSS for line-clamp utility
const lineClampStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

/* ============================
   Header Component
   ============================ */
const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <motion.a
          href="/"
          className="flex items-center gap-2 text-xl font-bold"
          whileHover={{ scale: 1.05 }}
          aria-label="Fireside homepage"
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Fireside
          </span>
        </motion.a>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {['Articles', 'Reviews', 'Authors', 'About'].map((item) => (
            <motion.a
              key={item}
              href="#"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 font-medium"
              whileHover={{ y: -2 }}
              aria-label={`Navigate to ${item} section`}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
            aria-label="Search"
          >
            <Search size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            aria-label="Subscribe to Fireside"
          >
            Subscribe
          </motion.button>
          
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-3 space-y-4">
              {['Articles', 'Reviews', 'Authors', 'About'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

/* ---------------------------
   Ultra-smooth Hero Carousel
   --------------------------- */
const HeroCarousel: React.FC<{ slides: Article[] }> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<number>(0);
  const progress = useMotionValue(0);
  const total = slides.length;

  // GPU-accelerated progress bar
  const progressWidth = useTransform(progress, (v: number) => `${Math.round(v * 100)}%`);

  // RAF-based smooth transitions
  const navigate = useCallback((newIndex: number) => {
    if (isAnimating || newIndex === currentIndex) return;
    
    setIsAnimating(true);
    setDirection(newIndex > currentIndex ? 1 : -1);
    
    // Start progress bar animation
    progress.set(0);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 600); // Match CSS transition duration
  }, [currentIndex, isAnimating, progress]);

  // Auto-advance with smooth timing
  useEffect(() => {
    const interval = setInterval(() => {
      navigate((currentIndex + 1) % total);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, navigate, total]);

  // Continuous progress animation
  useEffect(() => {
    if (isAnimating) return;
    
    const interval = setInterval(() => {
      progress.set((progress.get() + 0.002) % 1);
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [isAnimating, progress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate((currentIndex + 1) % total);
      if (e.key === 'ArrowLeft') navigate((currentIndex - 1 + total) % total);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, navigate, total]);

  // Swipe gestures for mobile
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 30) {
      if (diff > 0) navigate((currentIndex + 1) % total);
      else navigate((currentIndex - 1 + total) % total);
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative select-none overflow-hidden rounded-3xl mx-4 mt-6 group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured articles carousel"
    >
      <style>{lineClampStyles}</style>
      <div className="relative h-[70vh] min-h-[500px] md:min-h-[600px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ 
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1] 
            }}
            className="absolute inset-0"
            aria-hidden={isAnimating}
            aria-label={`Slide ${currentIndex + 1} of ${total}: ${currentSlide.title}`}
          >
            <div className="relative h-full w-full">
              {/* Background image with parallax */}
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={currentSlide.featuredImage.url}
                  alt={currentSlide.featuredImage.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  width={currentSlide.featuredImage.width}
                  height={currentSlide.featuredImage.height}
                />
              </motion.div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-end pb-16 px-4 md:px-8">
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="max-w-4xl"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`inline-block ${currentSlide.category.color} ${currentSlide.category.textColor} px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20`}
                  >
                    {currentSlide.category.name}
                  </motion.span>

                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    {currentSlide.title}
                  </motion.h2>

                  <motion.p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed line-clamp-3">
                    {currentSlide.excerpt}
                  </motion.p>

                  <motion.div 
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-white/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <User size={16} aria-hidden="true" />
                      </div>
                      <span>{currentSlide.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} aria-hidden="true" />
                      <span>{currentSlide.readTime} min read</span>
                    </div>
                    <span>{formatDate(currentSlide.publishedAt)}</span>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold flex items-center gap-3 transition-all duration-300 group/btn"
                    aria-label={`Read article: ${currentSlide.title}`}
                  >
                    Read Article
                    <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} aria-hidden="true" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Progress bar */}
          <div className="flex-1 max-w-2xl mr-0 sm:mr-8 w-full">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-white/80 rounded-full origin-left"
                aria-valuenow={progress.get() * 100}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate((currentIndex - 1 + total) % total)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate((currentIndex + 1) % total)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-20 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => navigate(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------
   Premium Article Card
   --------------------------- */
const ArticleCard: React.FC<{ article: Article; index: number }> = ({ article, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 will-change-transform border border-gray-100 dark:border-gray-800"
      aria-label={`Article: ${article.title}`}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <motion.img
          src={article.featuredImage.url}
          alt={article.featuredImage.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7 }}
          width={article.featuredImage.width}
          height={article.featuredImage.height}
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Category badge */}
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={`absolute top-4 left-4 ${article.category.color} ${article.category.textColor} px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20`}
        >
          {article.category.name}
        </motion.span>
        
        {/* Premium badge */}
        {article.isPremium && (
          <motion.span
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-2 py-1 rounded text-xs font-bold"
          >
            PREMIUM
          </motion.span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.h3 
          className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300"
          whileHover={{ x: 2 }}
        >
          {article.title}
        </motion.h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <img 
                src={article.author.avatar} 
                alt={article.author.name}
                className="w-6 h-6 rounded-full"
                width={24}
                height={24}
              />
              <span>{article.author.name}</span>
            </div>
            <span aria-hidden="true">•</span>
            <div className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              <span>{article.readTime} min</span>
            </div>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        {/* Read more button */}
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 group/readmore"
          aria-label={`Read more about ${article.title}`}
        >
          Read More
          <ArrowRight className="group-hover/readmore:translate-x-1 transition-transform" size={16} aria-hidden="true" />
        </motion.button>
      </div>
    </motion.article>
  );
};

/* ---------------------------
   Featured Grid
   --------------------------- */
const FeaturedGrid: React.FC<{ items: Article[] }> = ({ items }) => {
  return (
    <section className="px-4 md:px-6 py-12 md:py-16" aria-label="Featured articles">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Articles
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Curated selection of thought-provoking reads from our editors
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {items.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </section>
  );
};

/* ---------------------------
   Enhanced Newsletter CTA
   --------------------------- */
function NewsletterCTO() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setEmail('');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="px-4 md:px-6 py-16 md:py-20"
      aria-label="Newsletter subscription"
    >
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        
        <motion.h3
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Join the Fireside Community
        </motion.h3>
        
        <motion.p
          className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          A weekly dispatch of long-form essays, book reviews, and careful reading recommendations. 
          No noise — just good writing.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 md:px-6 py-3 md:py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
            aria-label="Email address for newsletter subscription"
          />
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-amber-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
            aria-label="Subscribe to newsletter"
          >
            {isSubmitting ? 'Joining...' : 'Join Now'}
            {!isSubmitting && <ArrowRight size={20} aria-hidden="true" />}
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
}

/* ---------------------------
   Enhanced Footer
   --------------------------- */
function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-10 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-5"
              whileHover={{ x: 2 }}
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Fireside
              </span>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-lg">
              Where stories find their home. A premium reading platform focused on long-form writing and careful curation.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mb-6">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Youtube, label: 'YouTube' }
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href="#"
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -3 }}
                  aria-label={`Follow us on ${social.label}`}
                >
                  <social.icon size={20} className="text-amber-600" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { 
              title: 'Explore', 
              links: ['Articles', 'Reviews', 'Authors', 'Collections', 'Topics'] 
            },
            { 
              title: 'Company', 
              links: ['About', 'Team', 'Careers', 'Contact', 'Press'] 
            },
            { 
              title: 'Resources', 
              links: ['Blog', 'Guides', 'Webinars', 'Newsletter', 'Help Center'] 
            }
          ].map((section, i) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <motion.a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 block text-base"
                      whileHover={{ x: 4 }}
                      aria-label={`${link} page`}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-2">Stay in the loop</h4>
              <p className="text-gray-600 dark:text-gray-400">Get the latest articles and updates delivered to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1 min-w-0"
                aria-label="Email for newsletter subscription"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm md:text-base">
            © {new Date().getFullYear()} Fireside. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <motion.a 
              href="#" 
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Cookie Policy
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================
   Main HomeScreen Component
   ============================ */
export default function HomeScreen() {
  const all = useMemo(() => getFeaturedArticles(), []);
  const hero = all.slice(0, 5);
  const grid = all.slice(5, 11);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <style>{lineClampStyles}</style>
      
      {/* Header */}
      <Header />

      {/* Hero Carousel */}
      <div className="pt-16 md:pt-20">
        <HeroCarousel slides={hero} />
      </div>

      {/* Featured Articles Grid */}
      <FeaturedGrid items={grid} />

      {/* Newsletter CTA */}
      <NewsletterCTO />

      {/* Footer */}
      <Footer />
    </main>
  );
}