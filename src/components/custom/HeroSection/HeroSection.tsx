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
  const [direction, setDirection] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (!carouselAutoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, (carouselInterval || 5) * 1000);

    return () => clearInterval(interval);
  }, [carouselAutoPlay, carouselInterval, images.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
  };

  const imageTransition = {
    x: { type: "spring" as const, stiffness: 300, damping: 30 },
    opacity: { duration: 1.5 },
    scale: { duration: 1.5 },
  };

  return (
    <section
      role="banner"
      className="relative flex min-h-screen flex-col overflow-hidden bg-black"
    >
      {/* Image Section - Top Portion (60vh) */}
      {images.length > 0 && (
        <div className="relative h-[60vh] min-h-[400px] w-full flex-shrink-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={slideVariants}
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
                className="object-cover"
                sizes="100vw"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Logo - Top Center (over image) */}
      {logo && (
        <motion.div
          className="absolute top-8 left-1/2 z-30 -translate-x-1/2"
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
              className="w-32 sm:w-40 md:w-48"
              priority
            />
          </Link>
        </motion.div>
      )}

      {/* Main Title - Spans across image and black section (half on image, half below) */}
      <motion.div
        className="relative z-20 -mt-[8vh] px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-center text-9xl font-bold leading-[0.9] tracking-tight sm:text-[10rem] md:text-[12rem] lg:text-[14rem] xl:text-[16rem] 2xl:text-[18rem]">
          <span className="text-transparent [text-stroke:4px_white] [-webkit-text-stroke:4px_white] drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            {title}
          </span>
        </h1>
      </motion.div>

      {/* Bottom Section - Black Background with Subtitle */}
      <motion.div
        className="relative z-10 flex-1 bg-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Handwritten Subtitle */}
            {subtitle && (
              <motion.p
                className="font-handwriting text-3xl text-white sm:text-4xl md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Scroll Indicator - Animated Arrow (below subtitle) */}
            {scrollCue && (
              <motion.div
                className="mt-2"
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
      </motion.div>

      {/* Image Indicators (if carousel) - Positioned above black section */}
      {images.length > 1 && (
        <motion.div
          className="absolute bottom-[40vh] left-1/2 z-30 -translate-x-1/2 md:bottom-[45vh]"
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
                  setDirection(index > currentImageIndex ? 1 : -1);
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
