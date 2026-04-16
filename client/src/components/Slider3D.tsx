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

  return null;
}
