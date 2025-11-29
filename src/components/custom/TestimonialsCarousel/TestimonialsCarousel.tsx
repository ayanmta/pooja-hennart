"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Youtube, Instagram, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  event?: string;
  profilePic?: string;
  platform?: "youtube" | "instagram" | "manual";
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

// 3D Tilt Card Component (React Bits inspired)
function TiltedCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
    >
      <div style={{ transform: "translateZ(75px)" }}>{children}</div>
    </motion.div>
  );
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section aria-label="Testimonials" className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl"
        >
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Kind Words
            </h2>
            <p className="text-muted-foreground">What clients are saying</p>
          </div>

          {/* Card Container */}
          <div className="relative">
            <TiltedCard className="h-full">
              <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-card via-card to-muted/20 p-8 shadow-2xl transition-shadow duration-300 hover:shadow-3xl md:p-12">
                {/* Decorative Quote Icon */}
                <div className="absolute right-8 top-8 opacity-5">
                  <Quote className="h-24 w-24 text-foreground" />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/5" />

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }}
                    className="relative z-10"
                  >
                    {/* Quote */}
                    <motion.blockquote
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="relative mb-8 text-center"
                    >
                      <Quote className="mb-4 h-8 w-8 text-muted-foreground/50" />
                      <p className="text-lg leading-relaxed text-foreground sm:text-xl md:text-2xl lg:text-3xl">
                        {currentTestimonial.quote}
                      </p>
                    </motion.blockquote>

                    {/* Author Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                      {/* Profile Picture */}
                      {currentTestimonial.profilePic && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border shadow-lg ring-2 ring-muted/20"
                        >
                          <Image
                            src={currentTestimonial.profilePic}
                            alt={currentTestimonial.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </motion.div>
                      )}

                      {/* Name and Event */}
                      <div className="flex flex-col items-center gap-1 text-center sm:items-start">
                        <div className="flex items-center gap-2">
                          <cite className="not-italic font-semibold text-foreground">
                            {currentTestimonial.name}
                          </cite>
                          {currentTestimonial.platform && (
                            <motion.span
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              className="text-muted-foreground"
                            >
                              {currentTestimonial.platform === "youtube" ? (
                                <Youtube className="h-5 w-5 text-red-500" />
                              ) : currentTestimonial.platform === "instagram" ? (
                                <Instagram className="h-5 w-5 text-pink-500" />
                              ) : null}
                            </motion.span>
                          )}
                        </div>
                        {currentTestimonial.event && (
                          <p className="text-sm font-medium text-muted-foreground">
                            {currentTestimonial.event}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                {testimonials.length > 1 && (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg transition-all hover:bg-background hover:shadow-xl"
                        onClick={prev}
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg transition-all hover:bg-background hover:shadow-xl"
                        onClick={next}
                        aria-label="Next testimonial"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </>
                )}

                {/* Dot Indicators */}
                {testimonials.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 flex justify-center gap-2"
                  >
                    {testimonials.map((_, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => goToSlide(index)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          index === currentIndex
                            ? "w-8 bg-foreground shadow-md"
                            : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground"
                        )}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </motion.div>
                )}
              </Card>
            </TiltedCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
