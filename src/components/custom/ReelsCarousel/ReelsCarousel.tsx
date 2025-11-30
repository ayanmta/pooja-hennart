"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, Instagram } from "lucide-react";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface ReelsCarouselProps {
  reels: MediaItem[];
  onReelClick?: (item: MediaItem) => void;
  className?: string;
}

export function ReelsCarousel({
  reels,
  onReelClick,
  className,
}: ReelsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const [cardWidth, setCardWidth] = useState(280);

  // Calculate card width based on viewport
  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // On mobile: full width minus padding, on larger screens: fixed width
        const width = window.innerWidth < 640 
          ? containerWidth - 32 // 16px padding on each side
          : window.innerWidth < 1024
          ? 320
          : 360;
        setCardWidth(width);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      const threshold = cardWidth * 0.3;
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      let newIndex = currentIndex;

      if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
        if (offset > 0 || velocity > 0) {
          // Swipe right (previous)
          newIndex = Math.max(0, currentIndex - 1);
        } else {
          // Swipe left (next)
          newIndex = Math.min(reels.length - 1, currentIndex + 1);
        }
      }

      setCurrentIndex(newIndex);
      x.set(0);
    },
    [currentIndex, cardWidth, reels.length, x]
  );

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Calculate transform for cards
  const cardOffset = useTransform(x, (latest) => {
    return latest - currentIndex * cardWidth;
  });

  // Snap to current index
  useEffect(() => {
    if (!isDragging) {
      x.set(-currentIndex * cardWidth);
    }
  }, [currentIndex, cardWidth, isDragging, x]);

  if (reels.length === 0) {
    return (
      <div className={cn("flex h-[600px] items-center justify-center", className)}>
        <p className="text-center text-muted-foreground">No reels available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        "touch-pan-x touch-pan-y", // Enable touch gestures
        className
      )}
    >
      <motion.div
        className="flex h-[600px] md:h-[700px]"
        style={{
          x: cardOffset,
        }}
        drag="x"
        dragConstraints={{ left: -(reels.length - 1) * cardWidth, right: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{
          x: -currentIndex * cardWidth,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {reels.map((reel, index) => (
          <motion.div
            key={reel.id}
            className="relative shrink-0"
            style={{
              width: cardWidth,
              paddingLeft: index === 0 ? "1rem" : "0.75rem",
              paddingRight: index === reels.length - 1 ? "1rem" : "0.75rem",
            }}
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={cn(
                "group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl bg-black shadow-2xl transition-all",
                "ring-2 ring-transparent hover:ring-white/20",
                isDragging && "cursor-grabbing"
              )}
              onClick={() => !isDragging && onReelClick?.(reel)}
              role="button"
              tabIndex={0}
              aria-label={reel.caption || "Instagram reel"}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isDragging) {
                  e.preventDefault();
                  onReelClick?.(reel);
                }
              }}
            >
              {/* Reel Image/Thumbnail */}
              <div className="relative h-full w-full">
                <Image
                  src={reel.thumbnail || reel.src}
                  alt={reel.caption || "Reel thumbnail"}
                  fill
                  className="object-cover"
                  sizes={`${cardWidth}px`}
                  priority={index === currentIndex}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all group-hover:bg-white/30 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="ml-1 h-8 w-8 text-white" fill="white" />
                  </motion.div>
                </div>

                {/* Instagram Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                      <Instagram className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Caption (if available) */}
                {reel.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="line-clamp-2 text-sm font-medium text-white drop-shadow-lg">
                      {reel.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Dots */}
      {reels.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {reels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to reel ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe Indicator (on first load) */}
      {reels.length > 1 && currentIndex === 0 && !isDragging && (
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.div>
            <span className="text-xs">Swipe</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

