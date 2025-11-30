"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface ReelsCarouselProps {
  reels: MediaItem[];
  onReelClick?: (item: MediaItem) => void;
  className?: string;
  includeYouTube?: boolean; // Include YouTube videos in the carousel
}

export function ReelsCarousel({
  reels,
  onReelClick,
  className,
  includeYouTube = false,
}: ReelsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playedVideos, setPlayedVideos] = useState<Set<string>>(new Set());
  const x = useMotionValue(0);
  const [cardWidth, setCardWidth] = useState(280);
  const videoRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = useCallback((url: string, autoplay = false) => {
    if (!url) return '';
    
    // Handle YouTube Shorts format
    const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=${autoplay ? 1 : 0}&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`;
    }
    
    // Handle standard YouTube URL formats
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|u\/\w\/|.*[&?]v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    const videoId = match && match[1] ? match[1] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`;
    }
    
    return url;
  }, []);

  // Detect if it's a YouTube Short
  const isYouTubeShort = useCallback((url: string) => {
    return url.includes('/shorts/') || url.includes('youtube.com/shorts/');
  }, []);

  // Get Instagram embed URL (Instagram doesn't support direct embedding, but we can try oEmbed)
  const getInstagramEmbedUrl = useCallback((url: string) => {
    // Extract post ID from Instagram URL
    const match = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://www.instagram.com/p/${match[1]}/embed`;
    }
    return null;
  }, []);

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

  // Handle drag end with infinite loop
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      const threshold = cardWidth * 0.3;
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      let newIndex = currentIndex;

      if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
        if (offset > 0 || velocity > 0) {
          // Swipe right (previous) - infinite loop
          newIndex = (currentIndex - 1 + reels.length) % reels.length;
        } else {
          // Swipe left (next) - infinite loop
          newIndex = (currentIndex + 1) % reels.length;
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

  // Autoplay video when it comes into focus
  useEffect(() => {
    const currentReel = reels[currentIndex];
    if (!currentReel) return;

    const videoId = currentReel.id;
    
    // Mark as played (using setTimeout to avoid synchronous setState)
    if (!playedVideos.has(videoId)) {
      setTimeout(() => {
        setPlayedVideos(prev => new Set(prev).add(videoId));
      }, 0);
    }

    // For YouTube videos, reload iframe with autoplay
    if (currentReel.platform === "youtube") {
      const iframe = videoRefs.current.get(videoId);
      if (iframe) {
        const newSrc = getYouTubeEmbedUrl(currentReel.src, true);
        if (iframe.src !== newSrc) {
          iframe.src = newSrc;
        }
      }
    }
  }, [currentIndex, reels, playedVideos, getYouTubeEmbedUrl]);

  // Render individual reel card
  const renderReelCard = (reel: MediaItem, index: number, isDuplicate: boolean) => {
    const isYouTube = reel.platform === "youtube";
    const isInstagram = reel.platform === "instagram";
    const isActive = !isDuplicate && index === currentIndex;
    const shouldAutoplay = isActive && isYouTube;
    const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(reel.src, shouldAutoplay) : '';
    const isShort = isYouTube && isYouTubeShort(reel.src);
    const instagramEmbedUrl = isInstagram ? getInstagramEmbedUrl(reel.src) : null;

    return (
      <div
        className={cn(
          "group relative h-full w-full overflow-hidden rounded-2xl bg-black shadow-2xl transition-all",
          "ring-2 ring-transparent",
          isDragging && "cursor-grabbing"
        )}
        role="button"
        tabIndex={0}
        aria-label={reel.caption || `${reel.platform} video`}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isDragging) {
            e.preventDefault();
            onReelClick?.(reel);
          }
        }}
      >
        <div className="relative h-full w-full">
          {/* YouTube Video Player */}
          {isYouTube && youtubeEmbedUrl && (
            <iframe
              ref={(el) => {
                if (el) videoRefs.current.set(reel.id, el);
              }}
              src={youtubeEmbedUrl}
              title={reel.caption || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              style={{ aspectRatio: isShort ? '9/16' : '16/9' }}
            />
          )}

          {/* Instagram Embed */}
          {isInstagram && instagramEmbedUrl ? (
            <iframe
              src={instagramEmbedUrl}
              title={reel.caption || "Instagram reel"}
              className="h-full w-full"
              scrolling="no"
              allow="encrypted-media"
            />
          ) : isInstagram ? (
            // Fallback: Show thumbnail with link for Instagram
            <>
              <Image
                src={reel.thumbnail || reel.src}
                alt={reel.caption || "Instagram reel"}
                fill
                className="object-cover"
                sizes={`${cardWidth}px`}
                priority={isActive}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <button
                  onClick={() => window.open(reel.src, "_blank")}
                  className="rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 px-6 py-3 text-white font-semibold hover:scale-105 transition-transform"
                >
                  Watch on Instagram
                </button>
              </div>
            </>
          ) : (
            // Fallback: Show thumbnail
            <Image
              src={reel.thumbnail || reel.src}
              alt={reel.caption || "Video thumbnail"}
              fill
              className="object-cover"
              sizes={`${cardWidth}px`}
              priority={isActive}
            />
          )}

          {/* Gradient Overlay (only for non-video or when video is not playing) */}
          {(!isYouTube || !isActive) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          )}

          {/* Platform Badge */}
          <div className="absolute top-4 right-4 z-10">
            {isInstagram ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                  <Instagram className="h-4 w-4 text-white" />
                </div>
              </div>
            ) : isYouTube ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                  <Youtube className="h-4 w-4 text-white" />
                </div>
              </div>
            ) : null}
          </div>

          {/* Caption */}
          {reel.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <p className="line-clamp-2 text-sm font-medium text-white drop-shadow-lg">
                {reel.caption}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

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
        dragConstraints={{ left: -Infinity, right: Infinity }}
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
            key={`${reel.id}-${index}`}
            className="relative shrink-0"
            style={{
              width: cardWidth,
              paddingLeft: index === 0 ? "1rem" : "0.75rem",
              paddingRight: index === reels.length - 1 ? "1rem" : "0.75rem",
            }}
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {renderReelCard(reel, index, false)}
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

