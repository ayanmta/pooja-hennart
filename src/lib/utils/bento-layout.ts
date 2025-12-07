import type { MediaItem } from "@/lib/types/media";

/**
 * Bento grid item with size assignment
 */
export interface BentoGridItem {
  mediaItem: MediaItem;
  size: "small" | "large" | "wide";
  gridColSpan: 1 | 2;
  gridRowSpan: 1 | 2;
  aspectRatio: string; // Tailwind aspect ratio class
}

/**
 * Assigns grid sizes to media items based on featured status and order.
 * 
 * Algorithm:
 * - Featured items: 2x2 grid cells (large square)
 * - Regular items (even order/index): 1x1 grid cells (small square)
 * - Regular items (odd order/index): 2x1 grid cells (wide rectangle)
 * 
 * @param items - Array of media items to assign sizes to
 * @returns Array of BentoGridItem with size assignments
 */
export function assignBentoSizes(items: MediaItem[]): BentoGridItem[] {
  // Sort items: featured first, then by order
  const sortedItems = [...items].sort((a, b) => {
    // Featured items first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    // Then by order (lower order first)
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    // Finally by creation date (newer first) if order is same
    return 0;
  });

  return sortedItems.map((item, index) => {
    if (item.isFeatured) {
      // Featured items get large size (2x2)
      return {
        mediaItem: item,
        size: "large",
        gridColSpan: 2,
        gridRowSpan: 2,
        aspectRatio: "aspect-square",
      };
    } else if (index % 2 === 0) {
      // Regular items with even index get small size (1x1)
      return {
        mediaItem: item,
        size: "small",
        gridColSpan: 1,
        gridRowSpan: 1,
        aspectRatio: "aspect-square",
      };
    } else {
      // Regular items with odd index get wide size (2x1)
      return {
        mediaItem: item,
        size: "wide",
        gridColSpan: 2,
        gridRowSpan: 1,
        aspectRatio: "aspect-[2/1]",
      };
    }
  });
}
