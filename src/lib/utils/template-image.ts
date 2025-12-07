import type { MediaItem } from "@/lib/types/media";

/**
 * Extended MediaItem with isFeatured flag (from Sanity raw data)
 */
interface MediaItemWithFeatured extends MediaItem {
  isFeatured?: boolean;
  _createdAt?: string;
}

/**
 * Select a single template image from media items, prioritizing featured items
 * @param mediaItems Array of media items to select from
 * @returns Single selected media item, or null if no items available
 */
export function selectTemplateImage(
  mediaItems: MediaItem[]
): MediaItem | null {
  if (mediaItems.length === 0) {
    return null;
  }

  // Cast to check for isFeatured (may not be in type but present in data)
  const itemsWithFeatured = mediaItems as MediaItemWithFeatured[];

  // Prioritize featured items first
  const featured = itemsWithFeatured.filter((item) => item.isFeatured === true);

  if (featured.length > 0) {
    // Return first featured item
    return featured[0];
  }

  // Fall back to most recent item (by order or _createdAt)
  // Sort by order first (if available), then by _createdAt
  const sorted = [...itemsWithFeatured].sort((a, b) => {
    // If both have order, sort by order (ascending)
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // If only one has order, prioritize it
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    // Otherwise, sort by _createdAt (most recent first)
    if (a._createdAt && b._createdAt) {
      return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
    }
    return 0;
  });

  return sorted[0] || null;
}

/**
 * Select template image for "All" card from all media items
 * Prioritizes first featured item, falls back to most recent
 * @param allMedia All media items from Sanity
 * @returns Single selected media item, or null if no items available
 */
export function selectAllCardImage(
  allMedia: MediaItem[]
): MediaItem | null {
  if (allMedia.length === 0) {
    return null;
  }

  // Cast to check for isFeatured
  const itemsWithFeatured = allMedia as MediaItemWithFeatured[];

  // Find first featured item
  const firstFeatured = itemsWithFeatured.find((item) => item.isFeatured === true);

  if (firstFeatured) {
    return firstFeatured;
  }

  // Fall back to most recent item
  return selectTemplateImage(allMedia);
}

