export type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  platform?: "instagram" | "youtube";
  categories: string[];
  title?: string;
  caption?: string;
  isFeatured?: boolean;
  order?: number;
};

export type MediaCategory = "bridal" | "mehendi" | "party" | "hair" | "before-after" | "editorial" | "tutorial" | "other";

