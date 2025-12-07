"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import { CategoryCard } from "./CategoryCard";
import { cn } from "@/lib/utils/cn";
import type { CategoryCard as CategoryCardType, AllCard } from "@/lib/types/category";

interface CategoryCarouselProps {
  categories: CategoryCardType[];
  allCard?: AllCard; // Optional - can be removed if not needed
  className?: string;
}

/**
 * CategoryCarousel component - horizontal carousel for category selection
 * Uses Framer Motion for drag/swipe animations
 * Mobile: Shows 2.5 cards visible (2 full + half of third)
 * Desktop: Shows 4-5 cards with partial next card visible
 */
export function CategoryCarousel({
  categories,
  allCard,
  className,
}: CategoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(280);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  // Calculate card width for mobile (2.5 cards visible - 2 full + half)
  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const isMobile = window.innerWidth < 640;
        
        if (isMobile) {
          // Mobile: 2.5 cards with gaps (16px gap between cards, 16px padding on sides)
          // Formula: (containerWidth - padding - gaps) / 2.5
          const mobileCardWidth = (containerWidth - 16 * 3) / 2.5; // 2.5 cards + 3 gaps (between 2 full cards and half)
          setCardWidth(mobileCardWidth);
        } else {
          // Desktop: Fixed width for 4-5 cards with partial next
          const desktopCardWidth = 320;
          setCardWidth(desktopCardWidth);
        }
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Calculate drag constraints based on content width
  // Also disable scrolling when all cards fit on screen
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const totalCards = categories.length; // No "All" card
      const totalWidth = totalCards * (cardWidth + 16) - 16; // cards + gaps - last gap
      const maxScroll = Math.max(0, totalWidth - containerWidth);
      
      // If all cards fit, disable scrolling (set constraints to 0)
      if (totalWidth <= containerWidth) {
        setConstraints({ left: 0, right: 0 });
      } else {
        setConstraints({ left: -maxScroll, right: 0 });
      }
    }
  }, [cardWidth, categories.length]);

  // Sort categories by order
  const sortedCards = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    // Prevent click if drag distance is significant
    if (Math.abs(info.offset.x) > 10) {
      // User was dragging, not clicking
      return;
    }
  };

  const handleCardClick = (href: string) => {
    // Navigation handled by Link in CategoryCard
    // This is for any additional click handling if needed
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      
      // Only handle keyboard navigation if scrolling is enabled
      if (constraints.left === 0 && constraints.right === 0) {
        return; // Scrolling disabled, don't handle arrow keys
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const scrollAmount = cardWidth + 16; // card width + gap
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

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden", className)}
      role="region"
      aria-label="Category selection carousel"
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
        {sortedCards.map((card) => (
          <div
            key={card.categoryId || "all"}
            className="flex-shrink-0"
            style={{
              width: `${cardWidth}px`,
            }}
          >
            <CategoryCard
              category={card as CategoryCardType}
              onClick={handleCardClick}
              className="h-full"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

