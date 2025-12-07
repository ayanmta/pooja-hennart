"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import { SocialBitsCard } from "./SocialBitsCard";
import { cn } from "@/lib/utils/cn";
import type { MediaItem } from "@/lib/types/media";

interface SocialBitsCarouselProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem, index: number) => void;
  className?: string;
}

/**
 * SocialBitsCarousel component - horizontal scrollable carousel
 * Similar to CategoryCarousel, shows up to 8 items with swipe/drag support
 */
export function SocialBitsCarousel({
  items,
  onItemClick,
  className,
}: SocialBitsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  // Calculate card width - similar to CategoryCarousel
  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
        
        if (isMobile) {
          // Mobile: 1 card visible - Pinterest style, bigger portrait cards
          // Vertical cards are tall, show full card for better visibility
          const mobileCardWidth = containerWidth - 16 * 2; // Full width minus padding
          setCardWidth(Math.min(mobileCardWidth, 360)); // Cap at 360px for mobile (bigger)
        } else if (isTablet) {
          // Tablet: 1.2 cards visible - bigger portrait cards like Pinterest
          const tabletCardWidth = (containerWidth - 16 * 3) / 1.2; // 1.2 cards + 3 gaps
          setCardWidth(Math.min(tabletCardWidth, 450)); // Cap at 450px for tablet (bigger)
        } else {
          // Desktop: Pinterest style - much larger vertical cards
          // Show 1.5-2 cards with partial next visible for better visibility
          const desktopCardWidth = 500; // Much larger cards like Pinterest
          setCardWidth(desktopCardWidth);
        }
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Calculate drag constraints based on content width
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const totalCards = items.length;
      const totalWidth = totalCards * (cardWidth + 16) - 16; // cards + gaps - last gap
      const maxScroll = Math.max(0, totalWidth - containerWidth);
      
      // If all cards fit, disable scrolling
      if (totalWidth <= containerWidth) {
        setConstraints({ left: 0, right: 0 });
      } else {
        setConstraints({ left: -maxScroll, right: 0 });
      }
    }
  }, [cardWidth, items.length]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    // Prevent click if drag distance is significant
    if (Math.abs(info.offset.x) > 10) {
      return;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      
      if (constraints.left === 0 && constraints.right === 0) {
        return; // Scrolling disabled
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const scrollAmount = cardWidth + 16;
        const currentX = x.get();
        const newX =
          e.key === "ArrowLeft"
            ? Math.max(constraints.left, currentX - scrollAmount)
            : Math.min(constraints.right, currentX + scrollAmount);
        x.set(newX);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [cardWidth, constraints, x]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden", className)}
      role="region"
      aria-label="Social bits carousel"
      tabIndex={0}
    >
      <motion.div
        className="flex gap-4 px-4"
        style={{
          x,
        }}
        drag={constraints.left !== 0 || constraints.right !== 0 ? "x" : false}
        dragConstraints={constraints}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {items.map((item, index) => {
          // Both Instagram Reels and YouTube Shorts use vertical format (9:16)
          // This matches YouTube Shorts native app experience
          const cardHeight = (cardWidth * 16) / 9; // 9:16 aspect ratio (vertical)
          
          return (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
              }}
            >
              <SocialBitsCard
                item={item}
                onClick={(clickedItem) => {
                  const idx = items.findIndex((i) => i.id === clickedItem.id);
                  onItemClick?.(clickedItem, idx);
                }}
                index={index}
                className="h-full"
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
