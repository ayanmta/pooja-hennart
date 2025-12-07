"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Play, Video, Youtube } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

interface SocialBitsCardProps {
  item: MediaItem;
  onClick?: (item: MediaItem) => void;
  className?: string;
  index: number; // For staggered animation delay
}

export function SocialBitsCard({
  item,
  onClick,
  className,
  index,
}: SocialBitsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const isInstagram = item.platform === "instagram";
  const isYouTube = item.platform === "youtube";

  // Get thumbnail URL - use provided thumbnail or generate for YouTube
  const getThumbnailUrl = (): string | null => {
    // Debug: Log thumbnail data for Instagram items
    if (isInstagram && process.env.NODE_ENV === 'development') {
      console.log('Instagram reel thumbnail check:', {
        id: item.id,
        thumbnail: item.thumbnail,
        thumbnailType: typeof item.thumbnail,
        thumbnailLength: item.thumbnail?.length,
        src: item.src,
      });
    }

    // If thumbnail is provided from Sanity (CDN URL like cdn.sanity.io), use it for both platforms
    if (item.thumbnail && item.thumbnail.trim() !== "") {
      const thumbnail = item.thumbnail.trim();
      
      // If it's an Instagram reel/post URL (not a CDN image), we can't use it as an image source
      if (thumbnail.includes("instagram.com/reel/") || thumbnail.includes("instagram.com/p/")) {
        if (isInstagram && process.env.NODE_ENV === 'development') {
          console.log('Rejected Instagram URL as thumbnail:', thumbnail);
        }
        return null;
      }
      
      // Sanity CDN URLs (cdn.sanity.io) or other valid image URLs work fine
      // This includes thumbnails uploaded to Sanity for Instagram reels
      // Also accept any valid HTTP/HTTPS URL that's not an Instagram post URL
      if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://") || thumbnail.startsWith("/")) {
        if (isInstagram && process.env.NODE_ENV === 'development') {
          console.log('Using valid thumbnail URL:', thumbnail);
        }
        return thumbnail;
      }
    }
    
    // Auto-generate YouTube thumbnail if not provided
    if (isYouTube && item.src) {
      const videoIdMatch = item.src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[&?]v=))([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
      }
    }
    
    // For Instagram without thumbnail in Sanity, show placeholder
    // Note: Instagram thumbnails should be uploaded in Sanity for best results
    if (isInstagram) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No thumbnail found for Instagram reel:', item.id, item.title || item.caption);
      }
      return null;
    }
    
    return null;
  };

  const thumbnailUrl = getThumbnailUrl();
  
  // Use Next.js Image if we have a valid thumbnail URL
  // Valid URLs: Sanity CDN (cdn.sanity.io), YouTube (img.youtube.com), or other image URLs
  // Invalid: Instagram reel/post URLs (instagram.com/reel/ or instagram.com/p/)
  const useNextImage = Boolean(
    thumbnailUrl && 
    typeof thumbnailUrl === 'string' &&
    thumbnailUrl.trim() !== "" && 
    !thumbnailUrl.includes("instagram.com/reel/") && 
    !thumbnailUrl.includes("instagram.com/p/") &&
    (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://") || thumbnailUrl.startsWith("/"))
  );

  // Both Instagram Reels and YouTube Shorts use vertical format (9:16)
  // This matches YouTube Shorts native app experience
  const isVertical = true; // Both platforms use vertical format
  const aspectRatio = "9 / 16"; // Vertical format like YouTube Shorts

  // Animation variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
        delay: prefersReducedMotion ? 0 : index * 0.05,
      },
    },
  };

  // Check if this is carousel mode (has fixed height class)
  const isCarouselMode = className?.includes("h-full");

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer group",
        // For carousel: h-full, for grid: mb-4 break-inside-avoid
        isCarouselMode ? "h-full" : "mb-4 break-inside-avoid",
        "w-full",
        // YouTube Shorts style: larger border radius, shadow
        isCarouselMode && "shadow-lg",
        className
      )}
      onClick={() => onClick?.(item)}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail Image - Vertical format (9:16) like YouTube Shorts */}
      <div 
        className={cn(
          "relative w-full",
          isCarouselMode ? "h-full" : ""
        )}
        style={!isCarouselMode ? { aspectRatio: aspectRatio } : undefined}
      >
        {useNextImage && thumbnailUrl ? (
          // Use Next.js Image for YouTube (optimized) or valid image URLs (including Sanity CDN)
          <Image
            src={thumbnailUrl}
            alt={item.title || item.caption || `${item.platform || "social"} video`}
            fill={isCarouselMode}
            width={!isCarouselMode ? 600 : undefined}
            height={!isCarouselMode ? 1067 : undefined} // 9:16 ratio (600 * 16/9 = 1067)
            className={cn(
              "object-cover rounded-xl transition-transform duration-300 group-hover:scale-105",
              !isCarouselMode && "w-full h-auto"
            )}
            loading="lazy"
            sizes={isCarouselMode 
              ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            }
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const placeholder = target.parentElement?.querySelector(".thumbnail-placeholder") as HTMLElement;
              if (placeholder) {
                placeholder.style.display = "flex";
              }
            }}
          />
        ) : null}
        {/* Placeholder for Instagram when no valid thumbnail */}
        {(!useNextImage || !thumbnailUrl) && isInstagram && (
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-[#E4405F] to-[#C13584] flex items-center justify-center rounded-xl thumbnail-placeholder",
              useNextImage && thumbnailUrl ? "hidden" : "flex"
            )}
          >
            <Video className="h-16 w-16 text-white/90" fill="white" />
          </div>
        )}
        {/* Placeholder for YouTube when no valid thumbnail */}
        {(!useNextImage || !thumbnailUrl) && isYouTube && (
          <div 
            className={cn(
              "absolute inset-0 bg-[#000000] flex items-center justify-center rounded-xl thumbnail-placeholder",
              useNextImage && thumbnailUrl ? "hidden" : "flex"
            )}
          >
            <Youtube className="h-16 w-16 text-white/90" fill="white" />
          </div>
        )}
      </div>

      {/* Platform Badge - Top Left */}
      <div className="absolute top-2 left-2 z-10">
        {isInstagram && (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#E4405F] to-[#C13584] shadow-lg">
            <Video className="h-4 w-4 text-white" fill="white" />
          </div>
        )}
        {isYouTube && (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#FF0000] shadow-lg">
            <Youtube className="h-4 w-4 text-white" fill="white" />
          </div>
        )}
      </div>

      {/* Play Button - Centered (YouTube Shorts style - larger, more prominent) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
          <Play className="h-8 w-8 text-foreground ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Title and Caption Overlay - On Hover */}
      {(item.title || item.caption) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-4 sm:p-6 z-20">
          {item.title && (
            <h3 className="text-white text-lg sm:text-xl mb-1 line-clamp-2">
              {item.title}
            </h3>
          )}
          {item.caption && (
            <p className="text-white/90 text-sm sm:text-base line-clamp-2">
              {item.caption}
            </p>
          )}
        </div>
      )}

      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
}
