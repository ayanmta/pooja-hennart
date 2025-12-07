import type { MediaItem } from "@/lib/types/media";
import type { CollageImage } from "@/lib/types/category";

/**
 * Extended MediaItem with isFeatured flag (from Sanity raw data)
 */
interface MediaItemWithFeatured extends MediaItem {
  isFeatured?: boolean;
}

/**
 * Select collage images from media items, prioritizing featured items
 * @param mediaItems Array of media items to select from
 * @param maxCount Maximum number of images to select (default: 4)
 * @returns Array of selected media items for collage
 */
export function selectCollageImages(
  mediaItems: MediaItem[],
  maxCount: number = 4
): MediaItem[] {
  if (mediaItems.length === 0) {
    return [];
  }

  // Cast to check for isFeatured (may not be in type but present in data)
  const itemsWithFeatured = mediaItems as MediaItemWithFeatured[];

  // Prioritize featured items if available
  const featured = itemsWithFeatured.filter((item) => item.isFeatured === true);

  // If we have featured items, prioritize them, otherwise use all items
  const prioritized = featured.length > 0 ? featured : mediaItems;

  // Select up to maxCount items
  return prioritized.slice(0, maxCount);
}

/**
 * Generate collage images for a category card
 * @param categoryId Category ID to filter media items
 * @param allMedia All media items from Sanity
 * @returns Array of collage images for the category card
 */
export function generateCategoryCardCollage(
  categoryId: string,
  allMedia: MediaItem[]
): CollageImage[] {
  // Filter media items by category
  const categoryMedia = allMedia.filter((item) =>
    item.categories.includes(categoryId)
  );

  // Select 2-4 images for collage
  const selected = selectCollageImages(categoryMedia, 4);

  // Transform to CollageImage format
  return selected.map((item) => ({
    id: item.id,
    src: item.thumbnail || item.src,
    alt: item.caption || `Image from ${categoryId} category`,
    thumbnail: item.thumbnail,
  }));
}

/**
 * Generate collage images for the "All" card
 * @param allMedia All media items from Sanity
 * @returns Array of collage images for the "All" card
 */
export function generateAllCardCollage(
  allMedia: MediaItem[]
): CollageImage[] {
  // For "All" card, we'll use featured items or recent items
  // Since MediaItem doesn't have isFeatured yet, we'll use all items
  // This will be enhanced when we add featured item support
  const selected = selectCollageImages(allMedia, 6);

  // Transform to CollageImage format
  return selected.map((item) => ({
    id: item.id,
    src: item.thumbnail || item.src,
    alt: item.caption || "Featured image",
    thumbnail: item.thumbnail,
  }));
}

