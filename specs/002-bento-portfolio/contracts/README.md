# Contracts: Bento Portfolio Page

**Feature**: 002-bento-portfolio  
**Date**: 2025-01-06

## Overview

This feature is frontend-only (Next.js component). No API contracts are required as:
- Data comes from Sanity CMS via existing GROQ queries
- Navigation uses Next.js routing (no API endpoints)
- No external API integrations needed

## Component Contracts

### BentoGrid Component Interface

**Props**:
```typescript
interface BentoGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem, index: number) => void;
  className?: string;
  initialBatchSize?: number; // Default: 20
  loadMoreBatchSize?: number; // Default: 20
}
```

**Behavior**:
- Renders media items in bento-style grid with varying sizes
- Implements infinite scroll for large collections
- Applies algorithmic size assignment (featured → large, regular → small)
- Animates items as they enter viewport
- Respects `prefers-reduced-motion` for animations

**Size Assignment**:
- Featured items: 2x2 grid cells (large square)
- Regular items (even order): 1x1 grid cells (small square)
- Regular items (odd order): 2x1 grid cells (wide rectangle)

### BentoGridItem Component Interface

**Props**:
```typescript
interface BentoGridItemProps {
  item: BentoGridItem; // Includes MediaItem + size metadata
  onClick?: (item: MediaItem) => void;
  className?: string;
  index: number; // For staggered animation delay
}
```

**Behavior**:
- Displays single media item with assigned size
- Uses Next.js Image component with object-fit cover
- Applies Framer Motion animations (fade-in, scale-up)
- Handles click to trigger lightbox

### PortfolioClient Component Interface

**Props**:
```typescript
interface PortfolioClientProps {
  initialMedia: MediaItem[];
  categories: Category[];
  initialCategory?: string | null; // From URL searchParams
  logoUrl?: string;
  logoAlt?: string;
  contact?: Contact;
}
```

**Behavior**:
- Manages category filter state synchronized with URL
- Displays filter bar with category chips/buttons
- Renders BentoGrid with filtered media items
- Handles URL updates when filter changes
- Integrates with MediaLightbox for image viewing

### PortfolioPage (Server Component) Interface

**Props**: None (reads from URL searchParams)

**Behavior**:
- Reads `searchParams.category` from URL
- Fetches all media items and categories from Sanity
- Filters media items by category if URL parameter present
- Passes filtered data to PortfolioClient

**Route**: `/portfolio`
**Query Parameters**: `?category=bridal` (optional)

## Data Contracts

### Sanity Query Responses

All queries return typed responses as defined in `src/lib/sanity/queries.ts`:
- `getMediaItems()`: Returns `MediaItem[]`
- `getCategories()`: Returns `Category[]`
- `getMediaItemsByCategory(categoryId)`: Returns `MediaItem[]`

### MediaItem Type Contract

```typescript
type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  platform?: "instagram" | "youtube";
  categories: string[];
  caption?: string;
  isFeatured?: boolean;
  order?: number;
  _createdAt?: string;
};
```

### Category Type Contract

```typescript
type Category = {
  id: string;
  label: string;
  description?: string;
  order?: number;
};
```

## Navigation Contract

**Route**: `/portfolio`  
**Query Parameters**:
- `category` (optional): Category ID to filter (e.g., `/portfolio?category=bridal`)
- No category param: Show all media items

**Implementation**: Next.js App Router `searchParams` and `useSearchParams()` hook

**URL Updates**:
- Filter bar selection → URL updates via `useSearchParams().set()`
- Browser back/forward → URL changes trigger re-render with new filter
- Direct navigation → Server Component reads URL parameter and filters data

## Infinite Scroll Contract

**Trigger**: Intersection Observer detects scroll within 200px of bottom

**Loading**:
- Loads next batch of 20 items
- Appends to existing items array
- Applies size assignment to new items
- Animates new items in with Framer Motion

**States**:
- `loading`: Boolean indicating if more items are being loaded
- `hasMore`: Boolean indicating if more items are available
- `error`: Error state if loading fails

## Animation Contract

**Trigger**: Items enter viewport (via Intersection Observer or Framer Motion `useInView`)

**Animation Properties**:
- `opacity`: 0 → 1 (300ms ease-out)
- `scale`: 0.95 → 1 (200ms ease-out)
- `stagger`: 50ms delay between items

**Accessibility**:
- Respects `prefers-reduced-motion` media query
- If reduced motion enabled: Disable or minimize animations (opacity only, no scale)

## Error Handling Contracts

### Invalid Category ID

**Input**: URL contains invalid category ID (e.g., `/portfolio?category=invalid`)

**Behavior**: 
- Option 1: Show all items (graceful degradation)
- Option 2: Display error message "Category not found"
- Recommended: Option 1 (show all items, log warning)

### Image Load Failure

**Input**: Next.js Image fails to load

**Behavior**: Display fallback placeholder with error icon or message

### Sanity Query Failure

**Input**: `getMediaItems()` or `getCategories()` throws error

**Behavior**: Display error message to user, allow retry

## Performance Contracts

### LCP Target
- **Requirement**: < 2.5s
- **Measurement**: Largest Contentful Paint (first visible grid item)

### Animation Performance
- **Requirement**: 60fps during scrolling
- **Measurement**: Frame rate during infinite scroll and animations

### CLS Target
- **Requirement**: < 0.1
- **Measurement**: Cumulative Layout Shift (no layout shifts during image load)

## Accessibility Contracts

### Keyboard Navigation
- Filter bar items: Tab-accessible, Enter/Space to select
- Grid items: Tab-accessible, Enter/Space to open lightbox
- Focus indicators: Visible on all interactive elements

### Screen Reader Support
- Filter bar: ARIA labels for category buttons
- Grid items: ARIA labels with image alt text or caption
- Loading states: ARIA live regions for loading indicators

### Reduced Motion
- Check `prefers-reduced-motion` on component mount
- Disable or minimize animations if enabled
- Maintain functionality without animations

