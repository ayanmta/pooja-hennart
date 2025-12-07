# CategoryCarousel Component Specification

**Component**: `CategoryCarousel`  
**Location**: `src/components/custom/CategoryCarousel/CategoryCarousel.tsx`  
**Type**: Client Component  
**Created**: 2025-01-06

## Overview

The `CategoryCarousel` component is a horizontal carousel that displays category cards for portfolio navigation. It replaces the previous DomeGallery (3D globe visualization) with a simpler, Pinterest-style category selection interface. Each category card displays a single template image selected from that category's media items and navigates to the portfolio page when clicked.

## Purpose

- Provide intuitive category-based navigation to portfolio content
- Display category cards with single template images selected from Sanity media items
- Support mobile (2.5 cards visible - 2 full + half) and desktop (4-5 cards with partial next) layouts
- Enable fast, responsive user interaction with smooth animations

## Props

```typescript
interface CategoryCarouselProps {
  categories: CategoryCard[];
  allCard: AllCard;
  className?: string;
}
```

### Props Description

- **`categories`** (required): Array of `CategoryCard` entities representing portfolio categories. Each card contains category metadata and a single template image.
- **`allCard`** (required): `AllCard` entity representing the "All" option, displayed as the first card in the carousel with a single template image.
- **`className`** (optional): Additional CSS classes for custom styling.

## Visual Design Guidelines

### Layout
- **Mobile (< 640px)**: Displays 2.5 category cards visible (2 full + half of third) to indicate scrollability
- **Desktop (≥ 640px)**: Displays 4-5 full cards with partial visibility of next card
- Cards are arranged horizontally with 16px gaps between them
- Container has 16px horizontal padding
- Scrolling is disabled when all cards fit within the viewport

### Styling
- Uses shadcn/ui design principles
- All colors via theme tokens (no hard-coded colors)
- Supports dark/light mode automatically via theme system
- Smooth transitions and animations (60fps target)
- Fast hover feedback (<16ms via CSS transitions)

### Card Dimensions
- Mobile: Calculated dynamically to show 2.5 cards (2 full + half)
- Desktop: Fixed width of 320px per card
- Aspect ratio: 4:5 (portrait orientation) for template images

## States

### Default State
- Carousel displays all category cards horizontally
- "All" card appears first
- Cards are scrollable/swipeable
- No card is selected (navigation happens on click)

### Loading State
- Not applicable (data is passed as props, loading handled by parent)

### Error State
- If no categories provided, carousel renders empty (parent should handle empty state)
- If category has no media items, CategoryCard displays fallback placeholder

### Empty State
- If `categories` array is empty, only "All" card is displayed
- If both categories and allCard are empty, component renders nothing (parent should handle)

## Accessibility Requirements

### ARIA Labels
- Carousel container has `role="region"` and `aria-label="Category selection carousel"`
- Category cards have `aria-label` with category name (handled by CategoryCard)

### Keyboard Navigation
- **Arrow Left/Right**: Scrolls carousel horizontally
- **Tab**: Focuses individual category cards
- **Enter/Space**: Activates focused card (navigates to portfolio page)

### Focus Management
- Focus indicators visible on all interactive elements
- Focus styles use theme tokens for consistency
- Keyboard navigation works smoothly with arrow keys

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy (category names as headings)
- Alt text for all images (handled by CategoryCard)

## Usage Examples

### Basic Usage

```tsx
import { CategoryCarousel } from "@/components/custom/CategoryCarousel";
import { selectTemplateImage, selectAllCardImage } from "@/lib/utils/template-image";
import type { CollageImage } from "@/lib/types/category";

// Transform categories to CategoryCard entities
const categoryCards = categories.map((cat) => {
  // Filter media items by category
  const categoryMedia = allMedia.filter((item) =>
    item.categories.includes(cat.id)
  );
  
  // Select single template image
  const selectedMedia = selectTemplateImage(categoryMedia);
  
  // Transform to CollageImage format
  const templateImage: CollageImage = selectedMedia
    ? {
        id: selectedMedia.id,
        src: selectedMedia.thumbnail || selectedMedia.src,
        alt: selectedMedia.caption || `Image from ${cat.label} category`,
        thumbnail: selectedMedia.thumbnail,
      }
    : {
        id: `placeholder-${cat.id}`,
        src: "",
        alt: `${cat.label} placeholder`,
      };
  
  return {
    categoryId: cat.id,
    categoryLabel: cat.label,
    templateImage,
    href: `/portfolio?category=${cat.id}`,
    order: 0,
  };
});

// Generate "All" card
const selectedAllMedia = selectAllCardImage(allMedia);
const allCard = {
  label: "All",
  templateImage: selectedAllMedia
    ? {
        id: selectedAllMedia.id,
        src: selectedAllMedia.thumbnail || selectedAllMedia.src,
        alt: selectedAllMedia.caption || "Featured image",
        thumbnail: selectedAllMedia.thumbnail,
      }
    : {
        id: "placeholder-all",
        src: "",
        alt: "All categories placeholder",
      },
  href: "/portfolio",
};

// Render carousel
<CategoryCarousel categories={categoryCards} allCard={allCard} />
```

### With Custom Styling

```tsx
<CategoryCarousel
  categories={categoryCards}
  allCard={allCard}
  className="my-8"
/>
```

## Constraints and Requirements

### Technical Constraints
- Must be a Client Component (`"use client"`) due to interactivity (drag, keyboard navigation)
- Requires Framer Motion for animations
- Uses Next.js Image component for optimized images (handled by CategoryCard)
- All styling via Tailwind CSS theme tokens

### Performance Requirements
- Carousel becomes interactive within 1 second on standard mobile connections
- Category selection/navigation responds within 100ms
- 60fps animations for smooth carousel scrolling
- Images lazy-loaded (except visible cards which use `priority`)

### Design Requirements
- Must match site's existing look and feel (editorial, premium aesthetic)
- Must use shadcn/ui components and design patterns
- Must support dark/light theme seamlessly
- Mobile-first responsive design

### Data Requirements
- Categories must be transformed to `CategoryCard` entities before passing to component
- "All" card must be generated separately using `selectAllCardImage()`
- Template images are selected from Sanity media items (prioritize featured, fallback to recent)

## Dependencies

- **Framer Motion**: For drag/swipe animations and smooth scrolling
- **CategoryCard**: Child component for individual category cards
- **Type Definitions**: `CategoryCard` and `AllCard` from `@/lib/types/category`
- **Template Image Utilities**: `selectTemplateImage()` and `selectAllCardImage()` from `@/lib/utils/template-image`

## Related Components

- **CategoryCard**: Individual category card component (child of CategoryCarousel)
- **HomeClient**: Parent component that uses CategoryCarousel
- **SanityImage**: Used by CategoryCard for image display

## Notes

- Carousel uses Framer Motion's `drag` prop for touch/mouse drag interactions
- Keyboard navigation updates the motion value directly for smooth scrolling
- Card width is calculated dynamically on mobile to ensure 2.5 cards are visible (2 full + half)
- Desktop shows 4-5 cards with partial next card visibility
- Drag constraints are calculated based on content width to prevent over-scrolling
- Scrolling is disabled when all cards fit within the viewport

