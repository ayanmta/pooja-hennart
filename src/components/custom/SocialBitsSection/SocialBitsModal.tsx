"use client";

import React, { useState, useEffect } from "react";
import { X, Instagram, Youtube, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type MediaItem } from "@/lib/types/media";

interface SocialBitsModalProps {
  items: MediaItem[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SocialBitsModal({
  items,
  initialIndex,
  open,
  onOpenChange,
}: SocialBitsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentVideo = items[currentIndex];
  if (!currentVideo) return null;

  const isYouTube = currentVideo.platform === "youtube";
  const isInstagram = currentVideo.platform === "instagram";

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}?controls=1&rel=0&modestbranding=1`;
    }
    
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|u\/\w\/|.*[&?]v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    const videoId = match && match[1] ? match[1] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1`;
    }
    
    return url;
  };

  // Detect if it's a YouTube Short
  const isYouTubeShort = (url: string) => {
    return url.includes('/shorts/') || url.includes('youtube.com/shorts/');
  };

  // Get Instagram embed URL
  const getInstagramEmbedUrl = (url: string) => {
    const match = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://www.instagram.com/p/${match[1]}/embed/`;
    }
    return null;
  };

  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(currentVideo.src) : '';
  const isShort = isYouTube && isYouTubeShort(currentVideo.src);
  const instagramEmbedUrl = isInstagram ? getInstagramEmbedUrl(currentVideo.src) : null;

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, items.length]);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < items.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 [&>button]:hidden">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-2 top-2 z-20 bg-background/80 backdrop-blur"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Navigation Arrows */}
          {canGoPrevious && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur hover:bg-background/90"
              aria-label="Previous video"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {canGoNext && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur hover:bg-background/90"
              aria-label="Next video"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          {/* Video Player */}
          <div className="relative">
            {isYouTube ? (
              <div className={isShort ? "flex justify-center" : ""}>
                <AspectRatio ratio={isShort ? 9 / 16 : 16 / 9}>
                  <iframe
                    key={currentVideo.id} // Force re-render on video change
                    src={youtubeEmbedUrl}
                    title={currentVideo.caption || "YouTube video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={`h-full w-full rounded-lg ${isShort ? "max-w-md mx-auto" : ""}`}
                  />
                </AspectRatio>
              </div>
            ) : isInstagram ? (
              // Try embed on desktop, redirect on mobile
              !isMobile && instagramEmbedUrl ? (
                <AspectRatio ratio={9 / 16}>
                  <iframe
                    key={currentVideo.id}
                    src={instagramEmbedUrl}
                    title={currentVideo.caption || "Instagram Reel"}
                    allow="encrypted-media"
                    className="h-full w-full rounded-lg max-w-md mx-auto"
                  />
                </AspectRatio>
              ) : (
                <div className="flex h-[80vh] items-center justify-center bg-muted">
                  <div className="text-center">
                    <Instagram className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      {isMobile 
                        ? "Watch this reel on Instagram" 
                        : "Unable to load Instagram embed"}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => window.open(currentVideo.src, "_blank")}
                    >
                      Watch on Instagram
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex h-[80vh] items-center justify-center bg-muted">
                <p className="text-muted-foreground">Unsupported video platform</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="border-t border-border bg-background p-4">
            <div className="flex items-center gap-2 mb-2">
              {isYouTube && <Youtube className="h-5 w-5 text-red-600" />}
              {isInstagram && <Instagram className="h-5 w-5 text-pink-600" />}
              {currentVideo.title && (
                <p className="text-sm font-medium">{currentVideo.title}</p>
              )}
            </div>
            {currentVideo.caption && (
              <p className="text-sm text-muted-foreground">{currentVideo.caption}</p>
            )}
            {/* Video counter */}
            <p className="text-xs text-muted-foreground mt-2">
              {currentIndex + 1} of {items.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
