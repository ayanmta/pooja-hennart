"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

// Helper function to format text with line breaks and paragraphs
function formatText(text: string): React.ReactNode {
  if (!text) return null;
  
  // Split by double line breaks for paragraphs
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => {
    // Split by single line breaks for line breaks within paragraphs
    const lines = paragraph.split(/\n/).filter(l => l.trim());
    
    return (
      <p key={index} className={index > 0 ? "mt-3" : ""}>
        {lines.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

interface MediaLightboxProps {
  items: MediaItem[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaLightbox({
  items,
  initialIndex,
  open,
  onOpenChange,
}: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dragX, setDragX] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    x.set(0);
    setDragX(0);
  }, [initialIndex, open, x]);

  const currentItem = items[currentIndex];

  // Swipe threshold
  const SWIPE_THRESHOLD = 50;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Handle swipe/drag end
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Determine if swipe was significant enough
    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 0) {
        // Swipe right - previous
        handlePrevious();
      } else {
        // Swipe left - next
        handleNext();
      }
    }
    
    // Reset position
    x.set(0);
    setDragX(0);
  };

  // Handle drag
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragX(info.offset.x);
  };

  const handleShare = async () => {
    if (navigator.share && currentItem) {
      try {
        await navigator.share({
          title: currentItem.caption || "Portfolio Image",
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, items.length]);

  if (!currentItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl p-0 [&>button]:hidden max-h-[95vh] overflow-hidden">
        <div className="relative flex flex-col lg:flex-row h-[95vh]">
          {/* Image Section */}
          <div className="relative flex-1 overflow-hidden bg-muted/20 lg:overflow-visible">
            {/* Swipe Indicator - Left (Previous) */}
            {items.length > 1 && dragX > 20 && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 lg:hidden pointer-events-none">
                <div className="bg-background/90 backdrop-blur rounded-full p-2 animate-pulse">
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </div>
              </div>
            )}

            {/* Swipe Indicator - Right (Next) */}
            {items.length > 1 && dragX < -20 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 lg:hidden pointer-events-none">
                <div className="bg-background/90 backdrop-blur rounded-full p-2 animate-pulse">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            )}

            <motion.div
              className="relative w-full h-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={{ 
                x,
                opacity: useTransform(x, (value) => {
                  const absValue = Math.abs(value);
                  return absValue > 0 ? 1 - Math.min(absValue / 200, 0.3) : 1;
                }),
              }}
              dragDirectionLock
              dragMomentum={false}
            >
              <Image
                src={currentItem.src}
                alt={currentItem.caption || currentItem.title || "Portfolio image"}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, calc(100vw - 360px)"
                priority
              />
            </motion.div>

            {/* Top Bar - Mobile */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2">
                {currentItem.categories && currentItem.categories.length > 0 && (
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                    {currentItem.categories[0]}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="bg-background/90 backdrop-blur"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="bg-background/90 backdrop-blur"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation Buttons - Desktop Only (Bottom Left and Right) */}
            {items.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="hidden lg:flex absolute bottom-4 left-4 bg-background/90 backdrop-blur hover:bg-background z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="hidden lg:flex absolute bottom-4 right-4 bg-background/90 backdrop-blur hover:bg-background z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Details Panel - Compact */}
          <div className="w-full lg:w-[320px] xl:w-[360px] flex flex-col bg-background border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
            {/* Top Bar - Desktop */}
            <div className="sticky top-0 z-10 bg-background border-b border-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentItem.categories && currentItem.categories.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {currentItem.categories[0]}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="hidden lg:flex h-8 w-8"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content - Compact */}
            <div className="flex-1 p-4 space-y-4">
              {/* Title */}
              {currentItem.title && (
                <div>
                  <h2 className="font-serif text-xl xl:text-2xl font-semibold leading-tight text-foreground">
                    {currentItem.title}
                  </h2>
                </div>
              )}

              {/* Caption/Description */}
              {currentItem.caption && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="text-foreground/90 leading-relaxed text-sm">
                    {formatText(currentItem.caption)}
                  </div>
                </div>
              )}

              {/* Image Counter and Dots - Combined */}
              {items.length > 1 && (
                <div className="pt-3 border-t border-border space-y-3">
                  <p className="text-xs text-muted-foreground text-center">
                    {currentIndex + 1} / {items.length}
                  </p>
                  <div className="flex justify-center gap-1.5">
                    {items.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors",
                          index === currentIndex
                            ? "bg-primary"
                            : "bg-muted-foreground/50 hover:bg-muted-foreground/75"
                        )}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

