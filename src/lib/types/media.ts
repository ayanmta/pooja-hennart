export type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  platform?: "instagram" | "youtube";
  categories: string[];
  caption?: string;
};

export type MediaCategory = "bridal" | "mehendi" | "party" | "hair" | "before-after" | "editorial" | "tutorial" | "other";

