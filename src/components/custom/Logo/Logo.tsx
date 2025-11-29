import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({
  src,
  alt,
  width = 200,
  height = 200,
  className,
  priority = false,
}: LogoProps) {
  // Check if it's an SVG
  const isSvg = src.toLowerCase().endsWith(".svg") || src.includes(".svg");

  if (isSvg) {
    // For SVGs, use unoptimized Image or regular img tag
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("h-auto object-contain", className)}
        priority={priority}
        unoptimized
      />
    );
  }

  // For regular images, use optimized Image
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("h-auto object-contain", className)}
      priority={priority}
    />
  );
}

