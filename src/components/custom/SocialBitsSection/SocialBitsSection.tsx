"use client";

import React, { useMemo, useState } from "react";
import { SocialBitsGrid } from "./SocialBitsGrid";
import { SocialBitsCarousel } from "./SocialBitsCarousel";
import { SocialBitsModal } from "./SocialBitsModal";
import type { MediaItem } from "@/lib/types/media";

interface SocialBitsSectionProps {
  reels: MediaItem[];
  youtubeVideos: MediaItem[];
  onVideoClick?: (item: MediaItem) => void;
  maxItems?: number; // For homepage limit (shows carousel)
  enableInfiniteScroll?: boolean; // Default: true (for grid on full page)
  useCarousel?: boolean; // Use carousel layout (homepage) vs grid (full page)
  className?: string;
}

export function SocialBitsSection({
  reels,
  youtubeVideos,
  onVideoClick,
  maxItems,
  enableInfiniteScroll = true,
  useCarousel = false,
  className,
}: SocialBitsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Combine and sort videos (newest first)
  const combinedItems = useMemo(() => {
    const allItems: MediaItem[] = [
      ...reels.map(reel => ({ ...reel, platform: "instagram" as const })),
      ...youtubeVideos.map(video => ({ ...video, platform: "youtube" as const })),
    ];

    // Sort by order field if available, otherwise maintain array order (newest first from Sanity)
    return allItems.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return 0;
    });
  }, [reels, youtubeVideos]);

  // Limit items for homepage carousel
  const displayItems = maxItems ? combinedItems.slice(0, maxItems) : combinedItems;

  const handleItemClick = (item: MediaItem, index: number) => {
    // Find index in full combinedItems array for modal navigation
    const fullIndex = combinedItems.findIndex(i => i.id === item.id);
    setModalIndex(fullIndex >= 0 ? fullIndex : index);
    setModalOpen(true);
    onVideoClick?.(item);
  };

  if (combinedItems.length === 0) {
    return null; // Hide section if no content
  }

  return (
    <>
      {useCarousel || maxItems ? (
        // Use carousel for homepage (up to 8 items)
        <SocialBitsCarousel
          items={displayItems}
          onItemClick={handleItemClick}
          className={className}
        />
      ) : (
        // Use grid for full page (infinite scroll)
        <SocialBitsGrid
          items={displayItems}
          onItemClick={handleItemClick}
          enableInfiniteScroll={enableInfiniteScroll}
          className={className}
        />
      )}
      
      <SocialBitsModal
        items={combinedItems}
        initialIndex={modalIndex}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
