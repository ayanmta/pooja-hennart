# FeaturedLooks Component Specification

## Overview
A horizontal scrolling gallery of curated featured looks. Displays 6-8 best works in a card-based horizontal scroll. Each card opens a lightbox on tap/click.

## Props
- `items` (MediaItem[], required): Array of featured media items
- `onItemClick` (function, optional): Callback fired when an item is clicked. Receives `item: MediaItem`

## Visual Design
- Horizontal scroll container (mobile-first)
- Cards with aspect ratio 4:5 (portrait)
- Smooth horizontal scrolling
- Card shows thumbnail image
- Hover effect: slight scale and overlay
- Scroll indicators (optional)

## States
- Default: Shows all featured items
- Loading: Skeleton cards
- Empty: Message "No featured looks available"

## Accessibility
- Semantic `<section>` with `aria-label`
- Scrollable container with proper ARIA attributes
- Keyboard navigation (arrow keys for horizontal scroll)
- Focus management for lightbox

## Usage
```tsx
<FeaturedLooks 
  items={featuredMedia}
  onItemClick={(item) => openLightbox(item)}
/>
```

## Constraints
- Must use ScrollArea from shadcn/ui
- Must use Card component for items
- Mobile-first: horizontal scroll on all devices
- No inline styles

