"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { type BentoGridItem as BentoGridItemType } from "@/lib/utils/bento-layout";
import { cn } from "@/lib/utils/cn";

interface BentoGridItemProps {
  item: BentoGridItemType;
  onClick?: (item: BentoGridItemType) => void;
  className?: string;
  index: number; // For staggered animation delay
}

export function BentoGridItem({
  item,
  onClick,
  className,
  index,
}: BentoGridItemProps) {
  const { mediaItem } = item;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  // Animation variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const, // easeOut curve
        delay: prefersReducedMotion ? 0 : index * 0.05, // Stagger delay
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "relative overflow-hidden rounded-lg cursor-pointer group mb-4 break-inside-avoid w-full",
        className
      )}
      onClick={() => onClick?.(item)}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Pinterest-style: Natural height images */}
      <div className="relative w-full">
        <Image
          src={mediaItem.src}
          alt={mediaItem.title || mediaItem.caption || "Portfolio image"}
          width={600}
          height={900}
          className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        />
      </div>
      {/* Title and Subtitle Overlay */}
      {(mediaItem.title || mediaItem.caption) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-4 sm:p-6">
          {mediaItem.title && (
            <h3 className="text-white text-lg sm:text-xl mb-1 line-clamp-2">
              {mediaItem.title}
            </h3>
          )}
          {mediaItem.caption && (
            <p className="text-white/90 text-sm sm:text-base line-clamp-2">
              {mediaItem.caption}
            </p>
          )}
        </div>
      )}
      {/* Optional overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
}
