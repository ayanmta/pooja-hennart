# Quick Start: Simplify Portfolio Category Selection

**Feature**: 001-simplify-portfolio  
**Date**: 2025-01-06

## Overview

Replace the DomeGallery component on the homepage "Explore by look" section with a horizontal Pinterest-style category carousel. Each category card displays a single template image selected from that category's media items and navigates to the portfolio page when clicked. Remove the CategoryFilterBar since all categories are now accessible via the carousel.

## Key Components

### CategoryCarousel
- **Location**: `src/components/custom/CategoryCarousel/CategoryCarousel.tsx`
- **Purpose**: Main carousel component displaying category cards
- **Props**: 
  - `categories`: Array of CategoryCard entities
  - `allCard`: AllCard entity
  - `className?`: Optional styling
- **Features**: Horizontal scroll, swipe gestures, keyboard navigation

### CategoryCard
- **Location**: `src/components/custom/CategoryCarousel/CategoryCard.tsx`
- **Purpose**: Individual category card with single template image
- **Props**:
  - `category`: CategoryCard entity
  - `onClick`: Navigation handler
- **Features**: Single template image (4:5 aspect ratio), category name overlay, hover effects, theme support

## Data Flow

```
Sanity CMS
  ↓ (GROQ queries)
Server Component (HomeClient)
  ↓ (data transformation)
CategoryCarousel (Client Component)
  ↓ (renders)
CategoryCard components
  ↓ (user clicks)
Navigation to /portfolio?category={id}
```

## Implementation Steps

1. **Update CategoryCarousel component**
   - Update card width calculation for mobile (2.5 cards - 2 full + half)
   - Update desktop layout (4-5 cards with partial next card)
   - Add logic to disable scrolling when all cards fit on screen
   - Ensure keyboard navigation works

2. **Update CategoryCard component**
   - Replace collage layout with single template image
   - Use 4:5 aspect ratio for template image
   - Add category name overlay at bottom
   - Implement hover/active states
   - Ensure theme support (dark/light)

3. **Create template image selection utility**
   - `src/lib/utils/template-image.ts`
   - Function to select single template image (prioritize featured, fallback to recent)
   - Handle "All" card template image selection (first featured item)

4. **Update Sanity queries** (if needed)
   - Existing helpers should work: `getMediaItemsByCategory(categoryId)`
   - Existing helpers should work: `getFeaturedMediaItems(limit)`
   - Verify queries return isFeatured flag

5. **Update HomeClient**
   - Remove CategoryFilterBar component
   - Update CategoryCarousel integration (use template image selection)
   - Transform Sanity data to CategoryCard entities with single template image
   - Generate "All" card entity with single template image
   - Pass data to CategoryCarousel

6. **Update component specification**
   - `CategoryCarousel.spec.md` - update to reflect single template image

## Key Files to Create/Modify

### New Files
- `src/lib/utils/template-image.ts` - Template image selection utility

### Modified Files
- `src/components/custom/CategoryCarousel/CategoryCarousel.tsx` - Update for 2.5 cards mobile, 4-5 desktop
- `src/components/custom/CategoryCarousel/CategoryCard.tsx` - Update for single template image
- `src/components/custom/CategoryCarousel/CategoryCarousel.spec.md` - Update documentation
- `src/lib/types/category.ts` - Update CategoryCard type (single image, not collage)
- `src/app/(site)/HomeClient.tsx` - Remove CategoryFilterBar, update CategoryCarousel integration
- `src/lib/utils/collage.ts` - May be removed or repurposed (check if used elsewhere)

## Design Principles

- **shadcn/ui**: Use Card, AspectRatio components
- **Theme Support**: All colors via theme tokens (bg-card, text-foreground, etc.)
- **Artistic Aesthetic**: Editorial, premium feel with subtle gradients and shadows
- **Fast Feedback**: CSS transitions for hover (<16ms), Framer Motion for scroll
- **Mobile-First**: 2.5 cards on mobile (2 full + half), 4-5 cards on desktop with partial next

## Performance Targets

- Carousel interactive: <1s on mobile
- Hover feedback: <16ms
- Click navigation: <100ms
- 60fps animations

## Testing Checklist

- [ ] Carousel displays correctly on mobile (2.5 cards visible - 2 full + half)
- [ ] Carousel displays correctly on desktop (4-5 cards with partial next card)
- [ ] Category cards show single template image from Sanity media items
- [ ] Template images prioritize featured items, fallback to recent
- [ ] "All" card shows template image from first featured item
- [ ] Clicking category card navigates to portfolio page
- [ ] CategoryFilterBar is removed from homepage
- [ ] Scrolling disabled when all cards fit on screen
- [ ] Dark mode displays correctly
- [ ] Light mode displays correctly
- [ ] Keyboard navigation works (arrow keys, tab)
- [ ] Swipe gestures work on mobile
- [ ] Horizontal scroll works on desktop
- [ ] Fallback displays when category has no media items
- [ ] Images load with proper optimization (4:5 aspect ratio)

