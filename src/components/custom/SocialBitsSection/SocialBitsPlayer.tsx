"use client";

import React, { useState, useCallback, useMemo } from "react";
import { SocialBitsCarousel } from "./SocialBitsCarousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Youtube } from "lucide-react";
import { getYouTubeVideoId } from "@/lib/utils/videoThumbnails";
import type { MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

interface SocialBitsPlayerProps {
  items: MediaItem[];
  initialIndex?: number;
  className?: string;
}

/**
 * Main video player with scrollable carousel below
 * YouTube-style layout: large player on top, thumbnails below
 */
export function SocialBitsPlayer({
  items,
  initialIndex = 0,
  className,
}: SocialBitsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (items.length === 0) {
    return null;
  }

  const currentVideo = items[currentIndex];
  const isYouTube = currentVideo.platform === "youtube";
  const isShort = currentVideo.src?.includes("/shorts/") || currentVideo.src?.includes("youtube.com/shorts/");

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = useCallback((url: string) => {
    if (!url) return "";
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return url;
    
    const params = new URLSearchParams({
      controls: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      enablejsapi: "1",
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, []);

  const youtubeEmbedUrl = isYouTube && currentVideo.src 
    ? getYouTubeEmbedUrl(currentVideo.src)
    : "";

  const handleVideoSelect = useCallback((item: MediaItem, index: number) => {
    // Find the index in the items array
    const itemIndex = items.findIndex(i => i.id === item.id);
    if (itemIndex >= 0) {
      setCurrentIndex(itemIndex);
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set("index", itemIndex.toString());
      window.history.pushState({}, "", url.toString());
    }
  }, [items]);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Main Video Player */}
      <div className="w-full">
        <div className={cn(
          "relative w-full overflow-hidden rounded-xl bg-black",
          isShort ? "max-w-md mx-auto" : "max-w-4xl mx-auto"
        )}>
          {isYouTube && youtubeEmbedUrl ? (
            <AspectRatio ratio={isShort ? 9 / 16 : 16 / 9}>
              <iframe
                key={currentVideo.id}
                src={youtubeEmbedUrl}
                title={currentVideo.title || currentVideo.caption || "YouTube video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full rounded-xl"
              />
            </AspectRatio>
          ) : (
            <div className="flex h-[400px] items-center justify-center bg-muted rounded-xl">
              <div className="text-center">
                <Youtube className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Video not available</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        {(currentVideo.title || currentVideo.caption) && (
          <div className="mt-4 max-w-4xl mx-auto px-4">
            {currentVideo.title && (
              <h3 className="text-xl font-semibold mb-2">{currentVideo.title}</h3>
            )}
            {currentVideo.caption && (
              <p className="text-muted-foreground">{currentVideo.caption}</p>
            )}
          </div>
        )}
      </div>

      {/* Scrollable Video Carousel Below */}
      {items.length > 1 && (
        <div className="w-full">
          <h4 className="text-lg font-semibold mb-4 px-4">More Videos</h4>
          <SocialBitsCarousel
            items={items}
            onItemClick={handleVideoSelect}
            className="px-4"
          />
        </div>
      )}
    </div>
  );
}
