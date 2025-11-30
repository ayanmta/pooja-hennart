"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Youtube, Instagram, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

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

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Handle swipe gestures
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      const threshold = 50;
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
        if (offset > 0 || velocity > 0) {
          // Swipe right (previous)
          prev();
        } else {
          // Swipe left (next)
          next();
        }
      }
      x.set(0);
    },
    [next, prev, x]
  );

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section aria-label="Testimonials" className="py-12 md:py-14 lg:py-16">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl"
        >
          {/* Section Header */}
          <div className="mb-12 text-center md:text-left">
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
              Kind Words
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base md:text-base lg:text-lg">What clients are saying</p>
          </div>

          {/* Card Container */}
          <div className="relative">
            <TiltedCard className="h-full">
              <motion.div
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                dragElastic={0.3}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="relative cursor-grab active:cursor-grabbing"
              >
                <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-card via-card to-muted/20 p-8 shadow-2xl transition-shadow duration-300 hover:shadow-3xl md:p-12 touch-pan-x touch-pan-y">
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
                      className="relative mb-8 text-center md:text-left"
                    >
                      <Quote className="mb-4 h-8 w-8 text-muted-foreground/50 mx-auto md:mx-0" />
                      <p className="text-base leading-relaxed text-foreground sm:text-lg md:text-lg lg:text-xl">
                        {currentTestimonial.quote}
                      </p>
                    </motion.blockquote>

                    {/* Author Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex flex-col items-center gap-4 sm:flex-row sm:items-center md:items-start"
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
                      <div className="flex flex-col items-center gap-2 text-center sm:items-start md:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                          <cite className="not-italic font-semibold text-foreground text-base">
                            {currentTestimonial.name}
                          </cite>
                          {currentTestimonial.platform && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "gap-1.5",
                                currentTestimonial.platform === "youtube" && "border-red-500/50 text-red-600",
                                currentTestimonial.platform === "instagram" && "border-pink-500/50 text-pink-600"
                              )}
                            >
                              {currentTestimonial.platform === "youtube" ? (
                                <>
                                  <Youtube className="h-3.5 w-3.5" />
                                  <span className="text-xs">YouTube</span>
                                </>
                              ) : currentTestimonial.platform === "instagram" ? (
                                <>
                                  <Instagram className="h-3.5 w-3.5" />
                                  <span className="text-xs">Instagram</span>
                                </>
                              ) : null}
                            </Badge>
                          )}
                        </div>
                        {currentTestimonial.event && (
                          <Badge variant="secondary" className="text-xs font-normal">
                            {currentTestimonial.event}
                          </Badge>
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
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/90 backdrop-blur-md shadow-lg transition-all hover:bg-background hover:shadow-xl md:left-4"
                          onClick={prev}
                          disabled={isDragging}
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
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/90 backdrop-blur-md shadow-lg transition-all hover:bg-background hover:shadow-xl md:right-4"
                          onClick={next}
                          disabled={isDragging}
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
                      className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-10"
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
                              ? "w-8 bg-primary shadow-md"
                              : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground"
                          )}
                          aria-label={`Go to testimonial ${index + 1}`}
                          aria-current={index === currentIndex ? "true" : "false"}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* Swipe Hint */}
                  {testimonials.length > 1 && !isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
                    >
                      <Badge variant="outline" className="text-xs font-normal bg-background/80 backdrop-blur-sm">
                        Swipe to navigate
                      </Badge>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </TiltedCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
