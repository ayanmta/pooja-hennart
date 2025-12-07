# Research: Bento Portfolio Page

**Feature**: 002-bento-portfolio  
**Date**: 2025-01-06

## Overview

This document captures research findings and technical decisions for implementing the bento-style portfolio page with algorithmic size assignment, infinite scroll, category filtering, and subtle animations.

## Research Questions & Decisions

### 1. Bento Grid Layout Algorithm

**Question**: How should the bento grid assign sizes to images and arrange them in the grid?

**Decision**: Algorithmic size assignment based on image order and featured status, then arrange in grid.

**Rationale**:
- Featured images should be visually prominent (larger sizes)
- Order-based assignment ensures consistent layout patterns
- Algorithmic approach allows for dynamic content without hard-coded patterns
- Maintains visual interest while being predictable

**Implementation Approach**:
1. Assign size classes to images based on:
   - Featured status: Featured images get larger sizes (e.g., `col-span-2 row-span-2`)
   - Order: Regular images get smaller sizes (e.g., `col-span-1 row-span-1` or `col-span-2 row-span-1`)
2. Arrange images in CSS Grid with auto-flow
3. Use Tailwind CSS Grid utilities for responsive sizing

**Alternatives Considered**:
- Fixed repeating pattern: Too rigid, doesn't adapt to content
- Pure masonry layout: Doesn't provide the bento box aesthetic with intentional size variation
- Random assignment: Unpredictable, may not highlight featured content

**References**:
- CSS Grid auto-flow documentation
- Bento box design patterns in modern web design

---

### 2. Infinite Scroll Implementation

**Question**: How should infinite scroll be implemented for large numbers of images?

**Decision**: Intersection Observer API with Framer Motion for smooth loading and animations.

**Rationale**:
- Intersection Observer is performant and native browser API
- Framer Motion provides smooth animations for newly loaded items
- Better UX than pagination for portfolio browsing
- Aligns with modern web patterns

**Implementation Approach**:
1. Use Intersection Observer to detect when user scrolls near bottom (200px threshold)
2. Load next batch of images from Sanity (e.g., 20 items per batch)
3. Animate new items in with Framer Motion fade-in/scale-up
4. Maintain scroll position during loading

**Performance Considerations**:
- Lazy load images below the fold
- Use Next.js Image component with proper `sizes` prop
- Debounce scroll events if needed
- Cancel pending requests if user navigates away

**Alternatives Considered**:
- Pagination: More explicit but breaks flow
- "Load More" button: Hybrid approach, but infinite scroll is more seamless
- Virtual scrolling: Overkill for portfolio use case, adds complexity

**References**:
- MDN Intersection Observer API
- Framer Motion scroll-triggered animations
- Next.js Image optimization best practices

---

### 3. Animation Approach

**Question**: How should subtle animations be implemented for images entering the viewport?

**Decision**: Framer Motion with fade-in and scale-up effects, respecting prefers-reduced-motion.

**Rationale**:
- Framer Motion is already in the project dependencies
- Provides smooth, performant animations
- Easy to respect accessibility preferences
- Supports staggered animations for visual appeal

**Implementation Approach**:
1. Use Framer Motion's `motion.div` wrapper for grid items
2. Animate `opacity` (0 → 1) and `scale` (0.95 → 1) on mount/scroll
3. Use `useInView` hook or Intersection Observer to trigger animations
4. Check `prefers-reduced-motion` and disable/minimize animations if enabled
5. Stagger animations: 50ms delay between items for visual flow

**Animation Timing**:
- Fade-in: 300ms ease-out
- Scale-up: 200ms ease-out
- Stagger delay: 50ms per item

**Alternatives Considered**:
- CSS transitions: Simpler but less flexible for complex animations
- GSAP: More powerful but adds dependency, Framer Motion sufficient
- No animations: Would reduce visual appeal and premium feel

**References**:
- Framer Motion documentation
- WCAG animation guidelines
- prefers-reduced-motion media query

---

### 4. Category Filtering Implementation

**Question**: How should category filtering work with URL parameters and filter bar UI?

**Decision**: Next.js `useSearchParams` for URL synchronization, filter bar UI for user interaction.

**Rationale**:
- URL query parameters enable shareable links and browser history
- Filter bar provides immediate visual feedback
- Next.js App Router provides built-in search params handling
- Maintains existing URL structure (`/portfolio?category=bridal`)

**Implementation Approach**:
1. Server Component (`page.tsx`) reads `searchParams.category` from URL
2. Filter media items server-side based on category parameter
3. Pass filtered media to Client Component
4. Client Component (`PortfolioClient`) uses `useSearchParams` to update URL on filter change
5. Filter bar component updates URL via `useRouter().push()` or `useSearchParams().set()`
6. URL updates trigger re-render with new filtered data

**State Management**:
- URL is the source of truth for active filter
- Filter bar reflects current URL parameter
- No separate client-side filter state needed

**Alternatives Considered**:
- Client-side only filtering: Loses shareability and browser history
- Separate filter state: Adds complexity, URL should be source of truth
- Server Actions: Overkill for simple filtering, current approach sufficient

**References**:
- Next.js App Router searchParams documentation
- Next.js useSearchParams hook
- URL-based state management patterns

---

### 5. Image Aspect Ratio Handling

**Question**: How should the bento grid handle images with different aspect ratios?

**Decision**: Maintain aspect ratios with `object-fit: cover` (fill grid cells, may crop edges).

**Rationale**:
- Preserves image composition and visual quality
- Fills grid cells completely for clean layout
- Common pattern in portfolio/masonry layouts
- Better than letterboxing which wastes space

**Implementation Approach**:
1. Use Next.js Image component with `fill` prop
2. Set `object-fit: cover` via Tailwind class
3. Grid cells have fixed aspect ratios (e.g., 1:1 for small, 2:1 for large)
4. Images maintain their natural aspect ratio within cells
5. Edges may be cropped to fit cell dimensions

**Grid Cell Sizes**:
- Small items: 1x1 (square) or 1x2 (portrait)
- Large items: 2x2 (square) or 2x1 (landscape)
- Responsive: Adjust cell sizes on mobile (1 column, smaller cells)

**Alternatives Considered**:
- Crop to fit: May cut off important parts of images
- Letterbox/pillarbox: Wastes space, creates inconsistent visual density
- Force aspect ratios: Distorts images, reduces quality

**References**:
- CSS object-fit property
- Next.js Image fill mode
- Portfolio layout best practices

---

## Technical Stack Decisions

### Animation Library
- **Chosen**: Framer Motion 12.23.24
- **Reason**: Already in dependencies, provides smooth animations, supports accessibility

### Grid Layout
- **Chosen**: CSS Grid with Tailwind utilities
- **Reason**: Native browser support, flexible, responsive, aligns with Tailwind-first approach

### Infinite Scroll
- **Chosen**: Intersection Observer API
- **Reason**: Native browser API, performant, no additional dependencies

### URL State Management
- **Chosen**: Next.js useSearchParams
- **Reason**: Built-in App Router support, handles browser history automatically

## Performance Considerations

1. **Image Loading**: Use Next.js Image with lazy loading, proper `sizes` prop
2. **Infinite Scroll**: Load in batches (20 items) to avoid overwhelming browser
3. **Animations**: Use `will-change` sparingly, prefer transform/opacity for GPU acceleration
4. **Grid Recalculation**: Minimize layout recalculations on resize (debounce if needed)
5. **Memory Management**: Clean up Intersection Observer on unmount

## Accessibility Considerations

1. **Reduced Motion**: Check `prefers-reduced-motion` and disable/minimize animations
2. **Keyboard Navigation**: Ensure filter bar and grid items are keyboard accessible
3. **Focus Management**: Maintain focus indicators on interactive elements
4. **Screen Readers**: Proper ARIA labels for filter bar and grid items
5. **Image Alt Text**: Use Sanity image alt text or captions for accessibility

## Browser Support

- Modern browsers with CSS Grid support (all current browsers)
- Intersection Observer API (all current browsers, polyfill not needed)
- Framer Motion (React 19 compatible)

## Open Questions (Resolved)

All technical unknowns have been resolved. No open questions remain.

