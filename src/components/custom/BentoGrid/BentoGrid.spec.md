# BentoGrid Component Specification

## Overview
A bento-style grid component that displays media items in a visually appealing grid layout with varying sizes, infinite scroll, and subtle animations.

## Props

### BentoGrid

```typescript
interface BentoGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem, index: number) => void;
  className?: string;
  initialBatchSize?: number; // Default: 20
  loadMoreBatchSize?: number; // Default: 20
}
```

**Props Description**:
- `items` (required): Array of MediaItem objects to display
- `onItemClick` (optional): Callback fired when a grid item is clicked. Receives the MediaItem and its index.
- `className` (optional): Additional CSS classes to apply to the grid container
- `initialBatchSize` (optional): Number of items to display initially. Default: 20
- `loadMoreBatchSize` (optional): Number of items to load per batch during infinite scroll. Default: 20

## Behavior

### Size Assignment
- Featured items: 2x2 grid cells (large square)
- Regular items (even order/index): 1x1 grid cells (small square)
- Regular items (odd order/index): 2x1 grid cells (wide rectangle)

### Infinite Scroll
- Automatically loads more items when user scrolls within 200px of bottom
- Uses Intersection Observer API for performance
- Shows loading indicator while fetching
- Displays "end of portfolio" message when all items are loaded

### Animations
- Items fade in and scale up as they enter viewport
- Staggered animation delay (50ms per item)
- Respects `prefers-reduced-motion` user preference
- Hover effect: slight scale-up on grid items

### Responsive Layout
- Mobile (default): 1 column
- Small screens (sm): 2 columns
- Large screens (lg): 3 columns
- Extra large screens (xl): 4 columns

## Usage

```tsx
import { BentoGrid } from "@/components/custom/BentoGrid";
import type { MediaItem } from "@/lib/types/media";

const mediaItems: MediaItem[] = [...];

<BentoGrid
  items={mediaItems}
  onItemClick={(item, index) => {
    console.log("Clicked:", item, index);
  }}
  initialBatchSize={20}
  loadMoreBatchSize={20}
/>
```

## Empty State
When `items` array is empty, displays: "No portfolio items available"

## Performance Considerations
- Uses `useMemo` to memoize size assignments
- Lazy loads images below the fold
- Intersection Observer efficiently detects scroll position
- Animations use GPU-accelerated properties (opacity, transform)

## Accessibility
- Respects `prefers-reduced-motion`
- Images include alt text from MediaItem caption
- Keyboard navigation supported (items are clickable)
- Loading states are announced to screen readers
