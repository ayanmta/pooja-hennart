"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface AnimatedPortfolioSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedPortfolioSection({
  children,
  className,
}: AnimatedPortfolioSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  
  // Smooth spring animations
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Rotation effect for artistic feel
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 2]);

  return (
    <motion.section
      ref={ref}
      className={cn("relative overflow-visible", className)}
      style={{
        opacity: smoothOpacity,
        scale: smoothScale,
      }}
    >
      {/* Background gradient overlay for depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 0]) as any,
        }}
      />

      {/* Main content with parallax */}
      <motion.div
        style={{
          y: smoothY,
          rotate: rotate,
        }}
        className="relative z-10 overflow-visible"
      >
        {children}
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.1, 0.1, 0]),
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </motion.div>
    </motion.section>
  );
}

