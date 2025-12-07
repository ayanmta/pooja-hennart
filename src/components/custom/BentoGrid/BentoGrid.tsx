"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BentoGridItem } from "./BentoGridItem";
import type { MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

interface BentoGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem, index: number) => void;
  className?: string;
  initialBatchSize?: number; // Default: 20
  loadMoreBatchSize?: number; // Default: 20
}

export function BentoGrid({
  items,
  onItemClick,
  className,
  initialBatchSize = 20,
  loadMoreBatchSize = 20,
}: BentoGridProps) {
  const [displayedItems, setDisplayedItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize displayed items
  useEffect(() => {
    const initialItems = items.slice(0, initialBatchSize);
    setDisplayedItems(initialItems);
    setHasMore(items.length > initialBatchSize);
  }, [items, initialBatchSize]);

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate async loading (in real app, this might fetch from API)
    setTimeout(() => {
      const currentLength = displayedItems.length;
      const nextBatch = items.slice(currentLength, currentLength + loadMoreBatchSize);
      
      if (nextBatch.length > 0) {
        setDisplayedItems((prev) => [...prev, ...nextBatch]);
        setHasMore(currentLength + nextBatch.length < items.length);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 300); // Small delay for smooth UX
  }, [isLoading, hasMore, displayedItems.length, items, loadMoreBatchSize]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin: "200px", // Trigger 200px before bottom
        threshold: 0.1,
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);


  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No portfolio items available</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Pinterest-style masonry layout for all screen sizes */}
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5">
        {displayedItems.map((item, index) => (
          <BentoGridItem
            key={item.id}
            item={{
              mediaItem: item,
              size: "small",
              gridColSpan: 1,
              gridRowSpan: 1,
              aspectRatio: "aspect-auto",
            }}
            onClick={(bentoItem) => {
              const idx = displayedItems.findIndex((i) => i.id === bentoItem.mediaItem.id);
              onItemClick?.(bentoItem.mediaItem, idx);
            }}
            index={index}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="h-20 flex items-center justify-center py-8"
        >
          {isLoading && (
            <div className="text-muted-foreground text-sm">Loading more...</div>
          )}
        </div>
      )}

      {/* End of portfolio indicator */}
      {!hasMore && displayedItems.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            You've reached the end of the portfolio
          </p>
        </div>
      )}
    </div>
  );
}
