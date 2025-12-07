# Research: Simplify Portfolio Category Selection

**Feature**: 001-simplify-portfolio  
**Date**: 2025-01-06

## Research Questions & Findings

### 1. Template Image Selection Approach

**Question**: How should category card template images be selected from media items?

**Decision**: Select a single template image per category card, prioritizing featured images (isFeatured=true), then falling back to most recent image.

**Rationale**: 
- Simpler implementation than collage approach
- Faster loading (single image per card)
- Maintains Next.js Image optimization benefits
- Clear visual hierarchy
- Easier to maintain and update

**Alternatives Considered**:
- Collage with multiple images: Rejected - user preference for single template image
- Server-side image compositing: Rejected - adds complexity, not needed for single image
- Random image selection: Rejected - doesn't prioritize featured content

**Implementation Approach**:
- Select 1 image from category's media items
- Prioritize featured items (isFeatured=true) first
- Fall back to most recent image if no featured items
- Use Next.js Image component with 4:5 aspect ratio
- Display single image with category name overlay

**References**:
- Next.js Image optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images
- CSS Grid for layouts: Standard web technology
- Pinterest-style layouts: Common pattern in modern web design

---

### 2. shadcn/ui Carousel Patterns

**Question**: What's the best shadcn/ui compatible pattern for horizontal carousels with fast feedback?

**Decision**: Use Framer Motion for carousel animations with shadcn/ui Card and ScrollArea components for structure.

**Rationale**:
- Framer Motion already in project dependencies
- Provides smooth, performant animations (60fps target)
- Works seamlessly with shadcn/ui components
- Supports touch gestures (swipe) and mouse interactions
- Can implement instant visual feedback on interactions

**Alternatives Considered**:
- Pure CSS scroll-snap: Rejected - less control over animations, harder to implement swipe gestures
- Embla Carousel: Rejected - additional dependency, Framer Motion sufficient
- Radix UI Carousel (if exists): Rejected - not part of shadcn/ui, Framer Motion more flexible

**Implementation Approach**:
- Use Framer Motion's `motion.div` with `drag="x"` for swipe gestures
- Use `useMotionValue` and `useTransform` for smooth scrolling
- Implement instant hover/active states with CSS transitions (not animations) for <100ms feedback
- Use shadcn/ui Card component as base for category cards
- Use ScrollArea for desktop horizontal scrolling with proper scrollbar styling

**References**:
- Framer Motion drag: https://www.framer.com/motion/gestures/#drag
- Existing ReelsCarousel component in project uses similar pattern
- shadcn/ui components: https://ui.shadcn.com/

---

### 3. Fast Responsive Feedback Patterns

**Question**: How to achieve <100ms responsive feedback for category card interactions?

**Decision**: Use CSS transitions for immediate visual feedback, Framer Motion for complex animations, and optimize image loading.

**Rationale**:
- CSS transitions are GPU-accelerated and provide instant feedback (<16ms)
- Separate immediate feedback (hover states, active states) from complex animations (carousel scroll)
- Optimize image loading with priority and proper sizing
- Use `will-change` CSS property for performance hints

**Alternatives Considered**:
- All animations via Framer Motion: Rejected - adds latency for simple state changes
- No animations: Rejected - doesn't meet "fast responsive feedback" requirement

**Implementation Approach**:
- Hover states: CSS transitions (scale, opacity, shadow) - <16ms response
- Active/pressed states: CSS transitions - instant feedback
- Carousel scroll: Framer Motion animations - smooth but not blocking
- Image loading: Priority loading for visible cards, lazy loading for off-screen
- Use `transform` and `opacity` for animations (GPU-accelerated properties)

**Performance Targets**:
- Hover feedback: <16ms (single frame at 60fps)
- Click feedback: <50ms (perceived as instant)
- Carousel scroll: 60fps smooth animation
- Image load: Priority images load first, others lazy load

**References**:
- CSS performance: https://web.dev/animations-guide/
- Framer Motion performance: https://www.framer.com/motion/performance/
- Next.js Image optimization: Already in project

---

### 4. Dark/Light Theme Implementation for Artistic Cards

**Question**: How to ensure category cards look flawless in both dark and light themes while maintaining artistic aesthetic?

**Decision**: Use theme tokens exclusively, implement subtle artistic touches via gradients and overlays that adapt to theme.

**Rationale**:
- Theme tokens automatically adapt to dark/light mode
- Artistic elements (gradients, overlays) can use theme-aware colors
- Maintains editorial, premium aesthetic in both themes
- No hard-coded colors ensures consistency

**Alternatives Considered**:
- Separate designs for dark/light: Rejected - violates DRY principle, harder to maintain
- Fixed colors with high contrast: Rejected - doesn't maintain artistic aesthetic

**Implementation Approach**:
- Card background: `bg-card` (theme token)
- Card border: `border-border` (theme token)
- Text: `text-foreground` and `text-muted-foreground` (theme tokens)
- Overlays/gradients: Use `bg-background/XX` with opacity for theme-aware overlays
- Shadows: Use theme-aware shadow utilities
- Category name background: `bg-background/90` with backdrop-blur for readability
- Hover states: Use theme-aware hover colors (e.g., `hover:bg-accent`)

**Artistic Touches**:
- Subtle gradient overlays on images (theme-aware)
- Elegant shadows that work in both themes
- Smooth transitions between states
- Premium spacing and typography (editorial style)

**References**:
- shadcn/ui theme system: https://ui.shadcn.com/docs/theming
- Existing theme implementation in project (ThemeProvider)
- Tailwind CSS theme tokens: Already configured in globals.css

---

### 5. Mobile 2.5-Card Layout Implementation

**Question**: How to ensure 2 full cards + half of a third card (2.5 cards) are visible on mobile?

**Decision**: Use fixed card width calculations based on viewport width with proper padding, ensuring 2.5 cards visible to indicate scrollability.

**Rationale**:
- Fixed approach provides consistent UX
- Matches specification requirement (2.5 cards - 2 full + half)
- Partial visibility of third card clearly indicates scrollability
- Works with horizontal scroll pattern
- Similar to existing FeaturedLooks component pattern

**Implementation Approach**:
- Calculate card width: `(viewportWidth - containerPadding - gapSpacing) / 2.5`
- Use `min-width` and `max-width` constraints for card sizing
- Ensure proper gap between cards (16px-24px)
- Use Framer Motion drag for swipe gestures
- Partial visibility of third card indicates more content

**Breakpoints**:
- Mobile (<640px): 2.5 cards visible (2 full + half), card width calculated dynamically
- Desktop (1024px+): 4-5 cards visible with partial next card, card width ~320px

**References**:
- Existing FeaturedLooks component uses similar pattern
- CSS scroll-snap: Standard web technology
- Responsive design patterns in project

---

## Summary

All technical unknowns resolved. Key decisions:
1. Single template image selection (prioritize featured, fallback to recent)
2. Framer Motion + shadcn/ui for carousel (existing dependencies)
3. CSS transitions for instant feedback, Framer Motion for animations
4. Theme tokens exclusively for dark/light mode support
5. Fixed card width calculation for mobile 2.5-card layout (2 full + half)
6. Desktop 4-5 cards with partial next card visibility
7. Disable scrolling when all cards fit on screen

No additional research needed. Ready for Phase 1 design.

