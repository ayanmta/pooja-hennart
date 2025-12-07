# Contracts: Simplify Portfolio Category Selection

**Feature**: 001-simplify-portfolio  
**Date**: 2025-01-06

## Overview

This feature is frontend-only (Next.js component). No API contracts are required as:
- Data comes from Sanity CMS via existing GROQ queries
- Navigation uses Next.js routing (no API endpoints)
- No external API integrations needed

## Component Contracts

### CategoryCarousel Component Interface

**Props**:
```typescript
interface CategoryCarouselProps {
  categories: CategoryCard[];
  allCard: AllCard;
  className?: string;
}
```

**Behavior**:
- Renders horizontal carousel of category cards
- Supports swipe gestures (mobile) and scroll (desktop)
- Navigates to portfolio page on card click
- Accessible via keyboard navigation

### CategoryCard Component Interface

**Props**:
```typescript
interface CategoryCardProps {
  category: CategoryCard;
  onClick: (href: string) => void;
  className?: string;
}
```

**Behavior**:
- Displays collage of 2-4 images
- Shows category name at bottom
- Provides hover/active visual feedback
- Navigates on click/tap

## Data Contracts

### Sanity Query Responses

All queries return typed responses as defined in `src/lib/sanity/queries.ts`:
- `getCategories()`: Returns `SanityCategory[]`
- `getMediaItems()`: Returns `MediaItem[]`
- `getMediaItemsByCategory(categoryId)`: Returns `MediaItem[]`
- `getFeaturedMediaItems(limit)`: Returns `MediaItem[]`

## Navigation Contract

**Route**: `/portfolio`  
**Query Parameters**:
- `category` (optional): Category ID to filter (e.g., `/portfolio?category=bridal`)
- No category param: Show all media items

**Implementation**: Next.js `Link` component or `useRouter().push()`

