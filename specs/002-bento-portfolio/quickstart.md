# Quickstart: Bento Portfolio Page

**Feature**: 002-bento-portfolio  
**Date**: 2025-01-06

## Overview

This guide provides a quick reference for implementing the bento-style portfolio page with algorithmic size assignment, infinite scroll, category filtering, and subtle animations.

## Implementation Steps

### 1. Create BentoGrid Component

**File**: `src/components/custom/BentoGrid/BentoGrid.tsx`

**Key Features**:
- Algorithmic size assignment utility (`src/lib/utils/bento-layout.ts`)
- CSS Grid layout with Tailwind utilities
- Infinite scroll with Intersection Observer
- Framer Motion animations

**Size Assignment Logic**:
```typescript
function assignSizes(items: MediaItem[]): BentoGridItem[] {
  return items.map((item, index) => {
    if (item.isFeatured) {
      return { ...item, size: "large", gridColSpan: 2, gridRowSpan: 2 };
    } else if (index % 2 === 0) {
      return { ...item, size: "small", gridColSpan: 1, gridRowSpan: 1 };
    } else {
      return { ...item, size: "wide", gridColSpan: 2, gridRowSpan: 1 };
    }
  });
}
```

### 2. Implement Infinite Scroll

**File**: `src/lib/utils/infinite-scroll.ts` or hook in BentoGrid component

**Key Features**:
- Intersection Observer API
- Load next batch when scroll within 200px of bottom
- Batch size: 20 items
- Smooth loading with Framer Motion animations

### 3. Add Category Filter Bar

**File**: `src/app/portfolio/PortfolioClient.tsx`

**Key Features**:
- Reuse existing `CategoryFilterBar` component
- Synchronize with URL via `useSearchParams()`
- Update URL when filter changes
- "All" option to clear filter

### 4. Implement Animations

**File**: `src/components/custom/BentoGrid/BentoGridItem.tsx`

**Key Features**:
- Framer Motion `motion.div` wrapper
- Fade-in (opacity 0→1, 300ms) and scale-up (0.95→1, 200ms)
- Staggered delay (50ms per item)
- Respect `prefers-reduced-motion`

### 5. Update Portfolio Page

**File**: `src/app/portfolio/page.tsx`

**Key Features**:
- Read `searchParams.category` from URL
- Filter media items server-side
- Pass filtered data to PortfolioClient

**File**: `src/app/portfolio/PortfolioClient.tsx`

**Key Features**:
- Replace DomeGallery with BentoGrid
- Integrate CategoryFilterBar
- Handle URL parameter updates
- Integrate MediaLightbox for image viewing

## Key Files to Create/Modify

### New Files
- `src/components/custom/BentoGrid/BentoGrid.tsx` - Main grid component
- `src/components/custom/BentoGrid/BentoGridItem.tsx` - Individual grid item
- `src/components/custom/BentoGrid/BentoGrid.spec.md` - Component specification
- `src/components/custom/BentoGrid/index.ts` - Exports
- `src/lib/utils/bento-layout.ts` - Size assignment utility

### Modified Files
- `src/app/portfolio/page.tsx` - Update to handle URL searchParams
- `src/app/portfolio/PortfolioClient.tsx` - Replace DomeGallery with BentoGrid
- `src/lib/sanity/queries.ts` - May add pagination support (optional)

## Design Principles

1. **Algorithmic Size Assignment**: Featured images get larger sizes (2x2), regular images get smaller sizes (1x1 or 2x1)
2. **Infinite Scroll**: Load 20 items per batch, trigger at 200px from bottom
3. **Animations**: Subtle fade-in and scale-up, respect prefers-reduced-motion
4. **Category Filtering**: URL is source of truth, filter bar reflects URL state
5. **Responsive Design**: 1-2 columns mobile, multiple columns desktop
6. **Performance**: LCP < 2.5s, 60fps animations, CLS < 0.1

## Testing Checklist

### Category Filtering
- [ ] URL parameter filters content correctly
- [ ] Filter bar updates URL when category selected
- [ ] "All" option clears filter and shows all items
- [ ] Browser back/forward works correctly
- [ ] Invalid category ID handled gracefully

### Bento Grid Layout
- [ ] Featured images display larger than regular images
- [ ] Grid layout is responsive (mobile/tablet/desktop)
- [ ] Images maintain aspect ratios with object-fit cover
- [ ] No layout shifts during image load (CLS < 0.1)

### Infinite Scroll
- [ ] Loads next batch when scrolling near bottom
- [ ] New items animate in smoothly
- [ ] Loading indicator shows during fetch
- [ ] "End of portfolio" shown when no more items
- [ ] Error handling for failed loads

### Animations
- [ ] Images fade in and scale up on scroll
- [ ] Animations respect prefers-reduced-motion
- [ ] 60fps maintained during scrolling
- [ ] Staggered animations create visual flow

### Performance
- [ ] LCP < 2.5s (first grid item visible)
- [ ] 60fps during scrolling and animations
- [ ] CLS < 0.1 (no layout shifts)
- [ ] Images lazy load below the fold

### Accessibility
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Screen reader announcements for loading states
- [ ] Reduced motion preferences respected

### Responsive Design
- [ ] Mobile layout (1-2 columns) works correctly
- [ ] Tablet layout adapts properly
- [ ] Desktop layout shows multiple columns
- [ ] Touch targets minimum 44x44px
- [ ] Grid recalculates on window resize

## Common Patterns

### Size Assignment
```typescript
const getSize = (item: MediaItem, index: number) => {
  if (item.isFeatured) return { colSpan: 2, rowSpan: 2 };
  if (index % 2 === 0) return { colSpan: 1, rowSpan: 1 };
  return { colSpan: 2, rowSpan: 1 };
};
```

### Infinite Scroll Hook
```typescript
const useInfiniteScroll = (onLoadMore: () => void) => {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [onLoadMore]);

  return loadMoreRef;
};
```

### Animation Variants
```typescript
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};
```

## Troubleshooting

### Images Not Loading
- Check Next.js Image `sizes` prop is set correctly
- Verify Sanity image URLs are valid
- Check `next.config.ts` for image domain configuration

### Infinite Scroll Not Triggering
- Verify Intersection Observer is set up correctly
- Check rootMargin threshold (200px)
- Ensure load more ref is attached to correct element

### Animations Not Smooth
- Check `prefers-reduced-motion` is not enabled
- Verify Framer Motion is using GPU-accelerated properties (opacity, transform)
- Check for layout recalculations during animation

### Category Filter Not Working
- Verify URL parameter is being read correctly in Server Component
- Check `useSearchParams()` is updating URL correctly
- Ensure filter bar state is synchronized with URL

## Next Steps

After implementation:
1. Test all scenarios from testing checklist
2. Verify performance targets (LCP, FPS, CLS)
3. Test accessibility with screen reader
4. Test responsive design on actual devices
5. Update component specification (BentoGrid.spec.md)

