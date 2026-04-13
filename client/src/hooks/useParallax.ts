/**
 * useParallax Hook
 * Provides parallax scroll effect for elements
 * Creates depth illusion by moving elements at different speeds
 */

import { useRef, useEffect, useState } from "react";
import { useMotionValue, useTransform } from "framer-motion";

export function useParallax(offset = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const scrollY = useMotionValue(0);

  const y = useTransform(scrollY, (latest) => {
    if (elementTop === 0) return 0;
    return (latest - elementTop) * offset;
  });

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    if (ref.current) {
      setElementTop(ref.current.offsetTop);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return { ref, y };
}

/**
 * useScrollReveal Hook
 * Reveals elements as they scroll into view
 */
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/**
 * useMouseParallax Hook
 * Creates parallax effect based on mouse position
 */
export function useMouseParallax(intensity = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      setMousePosition({
        x: x * intensity,
        y: y * intensity,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensity]);

  return { ref, mousePosition };
}
