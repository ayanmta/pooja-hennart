"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface AnimatedPortfolioSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Subtle fade-in animation on scroll - elegant and professional
 * No parallax or complex scroll effects, just a gentle entrance
 */
export function AnimatedPortfolioSection({
  children,
  className,
}: AnimatedPortfolioSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      className={cn("relative overflow-visible", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // Smooth, elegant easing
      }}
    >
      {children}
    </motion.section>
  );
}

