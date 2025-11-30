"use client";

import React from "react";
import { X, Instagram, Youtube } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type MediaItem } from "@/lib/types/media";

interface VideoModalProps {
  video: MediaItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoModal({ video, open, onOpenChange }: VideoModalProps) {
  const isYouTube = video.platform === "youtube";
  const isInstagram = video.platform === "instagram";

  // Extract YouTube video ID from URL (handles regular videos and Shorts)
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle YouTube Shorts format: youtube.com/shorts/VIDEO_ID or youtu.be/VIDEO_ID (if it's a short)
    const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    
    // Handle standard YouTube URL formats
    // Match: youtu.be/VIDEO_ID, youtube.com/watch?v=VIDEO_ID, youtube.com/embed/VIDEO_ID, etc.
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|u\/\w\/|.*[&?]v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    const videoId = match && match[1] ? match[1] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Fallback: return original URL if we can't parse it
    return url;
  };

  // Detect if it's a YouTube Short (vertical video)
  const isYouTubeShort = (url: string) => {
    return url.includes('/shorts/') || url.includes('youtube.com/shorts/');
  };

  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(video.src) : '';
  const isShort = isYouTube && isYouTubeShort(video.src);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 [&>button]:hidden">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Video Player */}
          <div className="relative">
            {isYouTube ? (
              <div className={isShort ? "flex justify-center" : ""}>
                <AspectRatio ratio={isShort ? 9 / 16 : 16 / 9}>
                  <iframe
                    src={youtubeEmbedUrl}
                    title={video.caption || "YouTube video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={`h-full w-full rounded-lg ${isShort ? "max-w-md mx-auto" : ""}`}
                  />
                </AspectRatio>
              </div>
            ) : isInstagram ? (
              <div className="flex h-[80vh] items-center justify-center bg-muted">
                <div className="text-center">
                  <Instagram className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Instagram Reels must be viewed on Instagram
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.open(video.src, "_blank")}
                  >
                    Open on Instagram
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-[80vh] items-center justify-center bg-muted">
                <p className="text-muted-foreground">Unsupported video platform</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          {video.caption && (
            <div className="border-t border-border bg-background p-4">
              <div className="flex items-center gap-2">
                {isYouTube && <Youtube className="h-5 w-5 text-red-600" />}
                {isInstagram && <Instagram className="h-5 w-5 text-pink-600" />}
                <p className="text-sm font-medium">{video.caption}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

