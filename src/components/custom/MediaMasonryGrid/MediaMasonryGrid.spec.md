# MediaMasonryGrid Component Specification

## Overview
A responsive masonry grid layout for displaying portfolio images. 2 columns on mobile, 3-4 columns on desktop. Each item opens in a lightbox on click/tap.

## Props
- `items` (MediaItem[], required): Array of media items to display
- `onItemClick` (function, optional): Callback fired when an item is clicked. Receives `item: MediaItem`
- `columns` (number, optional): Number of columns. Default: responsive (2 mobile, 3 tablet, 4 desktop)

## Visual Design
- Masonry/Pinterest-style grid layout
- Variable height images (maintain aspect ratio)
- Gap between items
- Hover effect: slight scale and overlay
- Smooth transitions

## States
- Default: Shows all filtered items
- Loading: Skeleton grid
- Empty: Message "No items to display"

## Accessibility
- Semantic `<section>` with `aria-label`
- Grid with proper ARIA roles
- Keyboard navigation
- Focus management

## Usage
```tsx
<MediaMasonryGrid 
  items={filteredMedia}
  onItemClick={(item) => openLightbox(item)}
/>
```

## Constraints
- Must use CSS Grid (Tailwind grid utilities)
- Must use Next.js Image component
- Mobile-first: 2 columns base, responsive breakpoints
- No inline styles

