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

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

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
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src={getYouTubeEmbedUrl(video.src)}
                  title={video.caption || "YouTube video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-lg"
                />
              </AspectRatio>
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

