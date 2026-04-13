/**
 * 3D Card Component with Parallax
 * Features:
 * - 3D tilt effect on mouse move
 * - Parallax depth layers
 * - Glow and shadow effects
 * - Smooth animations
 */

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Card3DProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Card3D({
  title,
  description,
  icon,
  gradient = "from-[#22C55E]/20 to-[#22C55E]/5",
  children,
  className = "",
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = e.clientX - centerX;
      const y = e.clientY - centerY;

      const rotateXValue = (y / rect.height) * 10;
      const rotateYValue = -(x / rect.width) * 10;

      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative h-full ${className}`}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setRotateX(0);
        setRotateY(0);
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {/* Glow Background */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#22C55E]/30 to-transparent blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            transform: "translateZ(-50px)",
          }}
        />
      )}

      {/* Main Card */}
      <motion.div
        className={`
          relative h-full p-8 rounded-2xl
          bg-gradient-to-br ${gradient}
          border border-white/10 backdrop-blur-xl
          transition-all duration-300
          ${isHovering ? "border-[#22C55E]/40 shadow-2xl shadow-[#22C55E]/20" : ""}
        `}
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(0px)",
        }}
      >
        {/* Parallax Layers */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
          style={{
            transform: "translateZ(20px)",
            background:
              "radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
          }}
          animate={isHovering ? { opacity: 0.5 } : { opacity: 0 }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          {icon && (
            <motion.div
              className="mb-4 text-[#22C55E] text-4xl"
              animate={isHovering ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {icon}
            </motion.div>
          )}

          {/* Title */}
          <h3
            className="text-xl font-bold text-white mb-3"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Underline */}
          <motion.div
            className="h-1 bg-gradient-to-r from-[#22C55E] to-transparent rounded-full"
            initial={{ scaleX: 0 }}
            animate={isHovering ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Children */}
          {children && (
            <motion.div
              className="mt-4"
              animate={isHovering ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            >
              {children}
            </motion.div>
          )}
        </div>

        {/* Corner Accent */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#22C55E]/20 to-transparent rounded-bl-3xl opacity-0"
          animate={isHovering ? { opacity: 1 } : { opacity: 0 }}
        />
      </motion.div>
    </motion.div>
  );
}
