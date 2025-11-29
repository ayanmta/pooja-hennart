"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

interface MediaMasonryGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem) => void;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function MediaMasonryGrid({
  items,
  onItemClick,
  columns = { mobile: 2, tablet: 3, desktop: 4 },
}: MediaMasonryGridProps) {
  if (items.length === 0) {
    return (
      <section aria-label="Portfolio grid" className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">
            No items to display
          </p>
        </div>
      </section>
    );
  }

  const getGridColsClass = (cols: number) => {
    const map: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return map[cols] || "grid-cols-2";
  };

  return (
    <section aria-label="Portfolio grid" className="py-12">
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "grid gap-4",
            getGridColsClass(columns.mobile || 2),
            `md:${getGridColsClass(columns.tablet || 3)}`,
            `lg:${getGridColsClass(columns.desktop || 4)}`
          )}
        >
          {items.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "group relative cursor-pointer overflow-hidden transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              onClick={() => onItemClick?.(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onItemClick?.(item);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={item.caption || "Portfolio item"}
            >
              <AspectRatio ratio={3 / 4}>
                <Image
                  src={item.thumbnail || item.src}
                  alt={item.caption || "Portfolio image"}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-90"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              </AspectRatio>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

