"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SocialBitsCard } from "./SocialBitsCard";
import type { MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

interface SocialBitsGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem, index: number) => void;
  className?: string;
  initialBatchSize?: number; // Default: 20
  loadMoreBatchSize?: number; // Default: 20
  enableInfiniteScroll?: boolean; // Default: true
}

export function SocialBitsGrid({
  items,
  onItemClick,
  className,
  initialBatchSize = 20,
  loadMoreBatchSize = 20,
  enableInfiniteScroll = true,
}: SocialBitsGridProps) {
  const [displayedItems, setDisplayedItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize displayed items
  useEffect(() => {
    if (!enableInfiniteScroll) {
      // Show all items if infinite scroll is disabled (homepage)
      setDisplayedItems(items);
      setHasMore(false);
      return;
    }

    const initialItems = items.slice(0, initialBatchSize);
    setDisplayedItems(initialItems);
    setHasMore(items.length > initialBatchSize);
  }, [items, initialBatchSize, enableInfiniteScroll]);

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore || !enableInfiniteScroll) return;

    setIsLoading(true);
    // Simulate async loading
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
    }, 300);
  }, [isLoading, hasMore, displayedItems.length, items, loadMoreBatchSize, enableInfiniteScroll]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll || !loadMoreRef.current || !hasMore) return;

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
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore, enableInfiniteScroll]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No social content available</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Pinterest-style masonry layout */}
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5">
        {displayedItems.map((item, index) => (
          <SocialBitsCard
            key={item.id}
            item={item}
            onClick={(clickedItem) => {
              const idx = displayedItems.findIndex((i) => i.id === clickedItem.id);
              onItemClick?.(clickedItem, idx);
            }}
            index={index}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {enableInfiniteScroll && hasMore && (
        <div
          ref={loadMoreRef}
          className="h-20 flex items-center justify-center py-8"
        >
          {isLoading && (
            <div className="text-muted-foreground text-sm">Loading more...</div>
          )}
        </div>
      )}

      {/* End indicator */}
      {enableInfiniteScroll && !hasMore && displayedItems.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            You've reached the end
          </p>
        </div>
      )}
    </div>
  );
}
