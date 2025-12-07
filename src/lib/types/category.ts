import type { MediaItem } from "./media";

/**
 * Collage image for category cards
 */
export interface CollageImage {
  id: string;
  src: string;
  alt: string;
  thumbnail?: string;
}

/**
 * Category card entity for carousel display
 */
export interface CategoryCard {
  categoryId: string;
  categoryLabel: string;
  description?: string;
  templateImage: CollageImage;
  href: string;
  order: number;
}

/**
 * "All" card entity for showing all media items
 */
export interface AllCard {
  label: string;
  templateImage: CollageImage;
  href: string;
}

