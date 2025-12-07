# Data Model: Social Section

**Feature**: 003-social-section  
**Date**: 2025-01-XX

## Overview

The Social Section uses the existing `MediaItem` data structure from Sanity CMS. No schema changes are required. The section receives Instagram Reels and YouTube videos as separate arrays and combines them for unified display.

## Data Structure

### MediaItem Type

```typescript
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
```

### Social Section Props

```typescript
interface SocialSectionProps {
  reels: MediaItem[];           // Instagram Reels
  youtubeVideos: MediaItem[];       // YouTube videos
  onVideoClick?: (item: MediaItem) => void;
}
```

### Combined Social Item

```typescript
interface SocialItem extends MediaItem {
  platform: "instagram" | "youtube"; // Required for social items
  displayOrder: number;               // Calculated: sort by date/relevance
}
```

## Data Processing

### Combining Arrays

```typescript
// Combine and sort reels and YouTube videos
const combinedItems: SocialItem[] = [
  ...reels.map(reel => ({ ...reel, platform: "instagram" as const })),
  ...youtubeVideos.map(video => ({ ...video, platform: "youtube" as const }))
].sort((a, b) => {
  // Sort by date (most recent first) or order
  // Implementation depends on available date fields
  return (b.order || 0) - (a.order || 0);
});
```

### Platform Filtering

```typescript
// Filter by platform
const filteredItems = platformFilter === "all"
  ? combinedItems
  : combinedItems.filter(item => item.platform === platformFilter);
```

## Sanity CMS Integration

### Current Query

```typescript
// From src/lib/sanity/queries.ts
export async function getVideoItems(): Promise<MediaItem[]> {
  // Returns all video items from Sanity
  // Items have platform: "instagram" or "youtube"
}
```

### Usage in Page Component

```typescript
// From src/app/(site)/page.tsx
const allVideos = await getVideoItems();
const reels = allVideos.filter(video => video.platform === "instagram");
const youtubeVideos = allVideos.filter(video => video.platform === "youtube");
```

## Data Flow

1. **Sanity CMS** → `getVideoItems()` → Returns all video items
2. **Server Component** → Filters by platform → `reels[]` and `youtubeVideos[]`
3. **HomeClient** → Passes arrays as props → `SocialSection`
4. **SocialSection** → Combines and sorts → `combinedItems[]`
5. **SocialCarousel** → Renders items → `SocialCard[]`

## Platform Identification

### Instagram Reels
- `platform: "instagram"`
- `type: "video"`
- `src`: Instagram URL (e.g., `https://www.instagram.com/reel/ABC123/`)
- `thumbnail`: Optional thumbnail URL

### YouTube Videos
- `platform: "youtube"`
- `type: "video"`
- `src`: YouTube URL (e.g., `https://www.youtube.com/watch?v=ABC123` or `https://youtu.be/ABC123`)
- `thumbnail`: Optional thumbnail URL (can be generated from video ID)

## Sorting & Ordering

### Default Sort Order
1. Featured items first (`isFeatured: true`)
2. Then by `order` field (if available)
3. Then by recency (if date field available)
4. Fallback: Array order from Sanity

### Display Order Calculation

```typescript
const calculateDisplayOrder = (item: MediaItem, index: number): number => {
  if (item.isFeatured) return 0; // Featured items first
  if (item.order !== undefined) return item.order;
  return index + 1000; // Fallback to array position
};
```

## Empty States

### No Content
```typescript
if (combinedItems.length === 0) {
  // Show empty state message
  return <EmptyState message="No social content available" />;
}
```

### No Reels
```typescript
if (reels.length === 0 && youtubeVideos.length > 0) {
  // Show only YouTube videos
  // Optional: Hide Instagram filter option
}
```

### No YouTube Videos
```typescript
if (youtubeVideos.length === 0 && reels.length > 0) {
  // Show only Instagram Reels
  // Optional: Hide YouTube filter option
}
```

## Data Validation

### Required Fields
- `id`: Unique identifier
- `src`: Video URL
- `platform`: "instagram" or "youtube"
- `type`: "video"

### Optional Fields
- `thumbnail`: Fallback to generated thumbnail if missing
- `caption`: Display in card and modal if available
- `title`: Display in card and modal if available

## Future Enhancements

### Potential Schema Additions
- `publishedDate`: Date field for sorting by recency
- `viewCount`: View count for popularity sorting
- `duration`: Video duration for display
- `tags`: Additional tags for filtering

### Potential Data Sources
- Instagram Graph API (for additional metadata)
- YouTube Data API (for additional metadata)
- Analytics integration (for view counts)
