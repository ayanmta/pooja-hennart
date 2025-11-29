"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

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

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const currentItem = items[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
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
      <DialogContent className="max-w-7xl p-0 [&>button]:hidden">
        <div className="relative flex h-[90vh] flex-col">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentItem.categories && currentItem.categories.length > 0 && (
                <Badge variant="secondary">
                  {currentItem.categories[0]}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="bg-background/80 backdrop-blur"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="bg-background/80 backdrop-blur"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={currentItem.thumbnail || currentItem.src}
              alt={currentItem.caption || "Portfolio image"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {/* Navigation Buttons */}
            {items.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-background/80 backdrop-blur rounded-lg p-4">
              {currentItem.caption && (
                <p className="text-sm text-foreground">{currentItem.caption}</p>
              )}
              {/* Dot Indicators */}
              {items.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "h-2 w-2 rounded-full transition-colors",
                        index === currentIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/50"
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

