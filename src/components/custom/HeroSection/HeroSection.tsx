"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/custom/Logo";

interface HeroImage {
  url: string;
  alt?: string;
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  location?: string;
  backgroundImage?: string;
  heroImages?: HeroImage[];
  logo?: string;
  logoAlt?: string;
  scrollCue?: boolean;
  carouselAutoPlay?: boolean;
  carouselInterval?: number;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  heroImages,
  logo,
  logoAlt = "Logo",
  scrollCue = true,
  carouselAutoPlay = true,
  carouselInterval = 5,
}: HeroSectionProps) {
  // Determine which images to use - prefer carousel, fallback to single image
  const images: HeroImage[] =
    heroImages && heroImages.length > 0
      ? heroImages.filter((img): img is HeroImage => img?.url !== undefined)
      : backgroundImage
      ? [{ url: backgroundImage, alt: "" }]
      : [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel with fade effect
  useEffect(() => {
    if (!carouselAutoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, (carouselInterval || 5) * 1000);

    return () => clearInterval(interval);
  }, [carouselAutoPlay, carouselInterval, images.length]);

  // Fade transition for smooth image changes
  const fadeVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  const imageTransition = {
    duration: 1.2,
    ease: "easeInOut" as const,
  };

  return (
    <section
      role="banner"
      className="relative flex h-screen flex-col overflow-hidden bg-black md:h-screen lg:h-screen"
    >
      {/* Desktop: Full viewport layout with proper proportions */}
      <div className="relative flex-1 flex flex-col md:flex-row md:items-stretch">
        {/* Image Section - Desktop: Takes 60% width, Mobile: Full width */}
        {images.length > 0 && (
          <div className="relative w-full md:w-[60%] shrink-0 
            h-[70vh] min-h-[500px]
            md:h-full md:min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                variants={fadeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={imageTransition}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentImageIndex].url}
                  alt={images[currentImageIndex].alt || ""}
                  fill
                  priority={currentImageIndex === 0}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  quality={90}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 md:bg-gradient-to-r md:from-black/30 md:via-black/20 md:to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Content Section - Desktop: Takes 40% width, Mobile: Below image */}
        <div className="relative w-full md:w-[40%] bg-black flex flex-col justify-end items-center text-center px-4 pb-16 md:justify-center md:py-12 lg:py-16">
          {/* Logo - Desktop: Top of content section, Mobile: Over image */}
          {logo && (
            <motion.div
              className="absolute top-20 left-1/2 z-30 -translate-x-1/2 md:relative md:top-0 md:left-0 md:translate-x-0 md:mb-8 lg:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/"
                className="inline-block transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
                aria-label="Go to home page"
              >
                <Logo
                  src={logo}
                  alt={logoAlt}
                  width={200}
                  height={200}
                  className="w-32 sm:w-40 md:w-44 lg:w-52"
                  priority
                />
              </Link>
            </motion.div>
          )}

          {/* Title - Desktop: In content section, Mobile: Overlapping half with image */}
          <motion.div
            className="relative z-20 md:relative md:mb-6 lg:mb-8 -mt-[12vh] md:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-center text-8xl font-bold leading-[1.4] tracking-tight sm:text-9xl md:leading-[0.9] md:text-7xl lg:text-8xl xl:text-9xl">
              <span className="text-transparent [text-stroke:3px_white] [-webkit-text-stroke:3px_white] md:[text-stroke:4px_white] md:[-webkit-text-stroke:4px_white] drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                {title}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="font-handwriting text-3xl text-white leading-[1.6] sm:text-4xl sm:leading-relaxed md:text-3xl md:leading-normal lg:text-4xl xl:text-5xl mb-6 md:mb-8 lg:mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Scroll Indicator */}
          {scrollCue && (
            <motion.div
              className="mb-0 md:mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                type="button"
                aria-label="Scroll down"
                className="flex flex-col items-center gap-2 text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
                onClick={() => {
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Image Indicators (if carousel) - Desktop: Bottom right of image, Mobile: Bottom center */}
      {images.length > 1 && (
        <motion.div
          className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 md:bottom-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setCurrentImageIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-8 bg-white shadow-lg"
                    : "w-1.5 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
