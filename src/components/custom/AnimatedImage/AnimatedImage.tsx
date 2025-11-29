"use client";

import React from "react";
import { motion } from "framer-motion";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils/cn";

interface AnimatedImageProps extends Omit<ImageProps, "onMouseEnter" | "onMouseLeave"> {
  className?: string;
  hoverScale?: number;
}

export function AnimatedImage({
  className,
  hoverScale = 1.05,
  ...props
}: AnimatedImageProps) {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      whileHover={{ scale: hoverScale }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image {...props} />
      </motion.div>
    </motion.div>
  );
}

