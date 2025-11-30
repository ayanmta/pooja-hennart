"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReelsCarousel } from "@/components/custom/ReelsCarousel";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

interface VideoGridProps {
  reels: MediaItem[];
  youtubeVideos: MediaItem[];
  onVideoClick?: (item: MediaItem) => void;
  reelsLayout?: "scroll" | "grid"; // "scroll" for home page, "grid" for videos page
}

export function VideoGrid({
  reels,
  youtubeVideos,
  onVideoClick,
  reelsLayout = "scroll",
}: VideoGridProps) {
  return (
    <section aria-label="Video gallery">
      <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="reels">Reels</TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="mt-0">
            {youtubeVideos.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No YouTube videos available
              </p>
            ) : reelsLayout === "scroll" ? (
              // YouTube Shorts-style carousel with autoplay
              <ReelsCarousel
                reels={youtubeVideos}
                onReelClick={onVideoClick}
                includeYouTube={true}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {youtubeVideos.map((video) => (
                  <Card
                    key={video.id}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                    onClick={() => onVideoClick?.(video)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onVideoClick?.(video);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={video.caption || "YouTube video"}
                  >
                    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={video.thumbnail || video.src}
                          alt={video.caption || "Video thumbnail"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
                          <Play className="h-12 w-12 text-white" fill="white" />
                        </div>
                      </AspectRatio>
                      {video.caption && (
                        <div className="flex items-center p-4">
                          <p className="text-sm font-medium">{video.caption}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reels" className="mt-0">
            {reels.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No reels available
              </p>
            ) : reelsLayout === "scroll" ? (
              // Reels carousel layout (Instagram-style swipeable cards with autoplay)
              <ReelsCarousel
                reels={reels}
                onReelClick={onVideoClick}
              />
            ) : (
              // Grid layout (for videos page)
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {reels.map((reel) => (
                  <Card
                    key={reel.id}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                    onClick={() => onVideoClick?.(reel)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onVideoClick?.(reel);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={reel.caption || "Instagram reel"}
                  >
                    <AspectRatio ratio={1}>
                      <Image
                        src={reel.thumbnail || reel.src}
                        alt={reel.caption || "Reel thumbnail"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
                        <Play className="h-12 w-12 text-white" fill="white" />
                      </div>
                    </AspectRatio>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
    </section>
  );
}

