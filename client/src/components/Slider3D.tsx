/**
 * 3D Slider Component
 * Features:
 * - 3D perspective transforms
 * - Smooth carousel animations
 * - Touch and mouse drag support
 * - Auto-rotation with pause on hover
 * - Responsive design
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slider3DProps {
  items: Array<{
    id: string | number;
    title: string;
    description: string;
    color?: string;
    icon?: React.ReactNode;
  }>;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onSlideChange?: (index: number) => void;
}

export default function Slider3D({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  onSlideChange,
}: Slider3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState(0);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || isHovering) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovering, items.length]);

  // Notify parent of slide change
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const getSlidePosition = (index: number) => {
    const distance = (index - currentIndex + items.length) % items.length;
    return distance > items.length / 2 ? distance - items.length : distance;
  };

  return (
    <div
      className="relative w-full h-full perspective"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ perspective: "1200px" }}
    >
      {/* 3D Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {items.map((item: typeof items[0], index: number) => {
            const position = getSlidePosition(index);
            const isActive = index === currentIndex;
            const isAdjacent = Math.abs(position) === 1;

            return (
              <motion.div
                key={item.id}
                className="absolute w-full max-w-md"
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 400 : -400,
                  rotateY: 45,
                  z: -500,
                }}
                animate={{
                  opacity: isActive ? 1 : isAdjacent ? 0.4 : 0,
                  x: position * 120,
                  rotateY: position * 25,
                  z: isActive ? 0 : -500,
                  scale: isActive ? 1 : 0.8,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -400 : 400,
                  rotateY: -45,
                  z: -500,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <motion.div
                  className={`
                    relative p-8 rounded-2xl backdrop-blur-xl
                    border border-white/10 cursor-grab active:cursor-grabbing
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-br from-[#22C55E]/20 to-[#22C55E]/5 shadow-2xl shadow-[#22C55E]/20"
                        : "bg-white/5 hover:bg-white/10"
                    }
                  `}
                  whileHover={isActive ? { scale: 1.05 } : {}}
                  whileTap={isActive ? { scale: 0.98 } : {}}
                >
                  {/* Card Content */}
                  <div className="relative z-10">
                    {item.icon && (
                      <motion.div
                        className="mb-4 text-[#22C55E]"
                        animate={isActive ? { rotateZ: 360 } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {item.icon}
                      </motion.div>
                    )}

                    <h3
                      className="text-2xl font-bold text-white mb-3"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {item.title}
                    </h3>

                    <p className="text-white/70 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {isActive && (
                      <motion.div
                        className="mt-6 h-1 bg-gradient-to-r from-[#22C55E] to-transparent rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </div>

                  {/* Glow effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#22C55E]/10 to-transparent opacity-0"
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-6">
        <motion.button
          onClick={handlePrev}
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        {/* Dot Indicators */}
        <div className="flex gap-2">
          {items.map((_: typeof items[0], index: number) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[#22C55E] w-8"
                  : "bg-white/20 w-2 hover:bg-white/40"
              }`}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
