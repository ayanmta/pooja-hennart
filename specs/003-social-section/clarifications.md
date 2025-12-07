# Clarifications: Social Bits Section

**Feature**: 003-social-section  
**Date**: 2025-01-XX

## User Requirements Summary

Based on user feedback:

1. **Title**: "Social Bits" (not "Social" or "Videos & Reels")
2. **Content Sorting**: Newest first (chronological)
3. **Card Design**: Unified design with platform badges
4. **Autoplay**: NO autoplay - subtle play button instead
5. **Homepage Display**: Max 8 videos with "View all" link
6. **Layout**: Pinterest-style masonry (CSS columns) - same as portfolio page
7. **Aspect Ratios**: Maintain native ratios (1:1 reels, 16:9 YouTube), adjust grid accordingly
8. **Modal**: Redirect to Instagram, play YouTube in modal (try Instagram embed if possible)
9. **Desktop**: Grid layout (not carousel) - Pinterest masonry
10. **Overall**: Best native experience

## Deep Dive Questions

### Q1: Play Button Design & Placement
**Question**: How should the subtle play button look and where should it be positioned?
- A) Centered overlay on thumbnail (like YouTube/Instagram) - semi-transparent circle with play icon
- B) Bottom-right corner (small, unobtrusive)
- C) Top-right corner with platform badge
- D) Appears on hover only (hidden by default)
- E) Always visible but very subtle (low opacity, becomes more visible on hover)

**Visual Considerations**:
- Should it have a background (circle/rounded square)?
- What size? (Small: 32px, Medium: 48px, Large: 64px)
- Should it match platform colors (Instagram pink, YouTube red) or be neutral?

**Recommendation**: Option A - Centered overlay, semi-transparent white/black circle (40-48px), visible but subtle (60% opacity, 100% on hover), neutral color to work with both platforms.

---

### Q2: Platform Badge Design & Placement
**Question**: How should platform badges (Instagram/YouTube icons) be displayed?
- A) Top-left corner of card (small icon, 24-32px)
- B) Top-right corner (with play button if placed elsewhere)
- C) Bottom-left corner (overlay on thumbnail)
- D) As part of hover overlay (appears with title/caption)
- E) Small badge next to play button (if centered)

**Visual Considerations**:
- Should badges have background (colored circle/square) or be icon-only?
- Instagram: Pink gradient or solid pink?
- YouTube: Red circle or just icon?
- Size: Small (20px), Medium (24px), or Larger (32px)?

**Recommendation**: Option A - Top-left corner, small colored badge (24px) with platform icon, Instagram pink gradient, YouTube red circle, subtle but clear.

---

### Q3: Card Hover States
**Question**: What should happen when user hovers over a card?
- A) Show title/caption overlay (like portfolio cards) + play button becomes more visible
- B) Just play button becomes more visible, no text overlay
- C) Slight scale-up (1.02-1.05x) + play button visibility
- D) All of the above (scale + text overlay + play button)

**Current Portfolio Behavior**: Shows title/caption overlay on hover with gradient background.

**Recommendation**: Option D - Slight scale (1.02x), show title/caption overlay if available, play button becomes fully opaque, smooth transitions.

---

### Q4: Instagram Embed Strategy
**Question**: For Instagram Reels in modal, should we:
- A) Always try to embed first, if embed fails/not supported → show preview with "Watch on Instagram" button
- B) Always redirect to Instagram (current behavior) - simpler, more reliable
- C) Try embed on desktop, redirect on mobile (mobile embeds are problematic)
- D) Show preview thumbnail with "Watch on Instagram" button (no embed attempt)

**Technical Note**: Instagram embeds can be unreliable, especially on mobile. Many sites use redirect approach.

**Recommendation**: Option C - Try embed on desktop (better UX if it works), redirect on mobile (more reliable), with clear "Watch on Instagram" button as fallback.

---

### Q5: Modal Navigation Between Videos
**Question**: In the video modal, should users be able to:
- A) Navigate to next/previous video with arrows (carousel within modal)
- B) Close modal to return to grid (no navigation in modal)
- C) Both - navigation arrows but can also close

**User Experience Consideration**: Navigation in modal provides seamless browsing, but adds complexity.

**Recommendation**: Option C - Add left/right arrow buttons in modal for navigation, but keep close button and ESC key functionality. Smooth experience for browsing multiple videos.

---

### Q6: Full Page Infinite Scroll
**Question**: On the `/social` page, should we:
- A) Use infinite scroll (load more as user scrolls, like portfolio page)
- B) Pagination (load pages of content)
- C) Show all content at once (if reasonable number of videos)
- D) "Load More" button (user clicks to load next batch)

**Current Portfolio**: Uses infinite scroll with Intersection Observer.

**Recommendation**: Option A - Infinite scroll for seamless browsing experience, consistent with portfolio page, load 20 items at a time.

---

### Q7: Platform Filtering on Full Page
**Question**: On the `/social` page, should we have:
- A) Platform filter (All, Instagram, YouTube) - like category filter on portfolio
- B) No filtering (show all content together)
- C) Optional filter (small, unobtrusive toggle)

**User Experience**: Filtering helps users find specific content, but unified view is primary goal.

**Recommendation**: Option C - Small, unobtrusive filter buttons above grid (similar to portfolio category filter), default to "All", URL parameter support (`/social?platform=instagram`).

---

### Q8: Card Caption/Title Visibility
**Question**: Should video titles/captions be:
- A) Always visible on card (below thumbnail or overlay)
- B) Only visible on hover (like portfolio cards)
- C) Never shown on card (only in modal)
- D) Shown for YouTube, hidden for Instagram (different platforms, different needs)

**Current Portfolio**: Titles/captions shown on hover with gradient overlay.

**Recommendation**: Option B - Show on hover for clean grid appearance, consistent with portfolio. If caption is long, truncate with ellipsis.

---

### Q9: Column Count for Masonry Layout
**Question**: How many columns should the masonry grid have?
- A) Same as portfolio: 2 mobile, 3 tablet, 4 desktop, 5 xl
- B) Fewer columns (2 mobile, 2 tablet, 3 desktop) - larger cards
- C) More columns (3 mobile, 4 tablet, 5 desktop, 6 xl) - more content visible
- D) Responsive based on content (auto-adjust)

**Current Portfolio**: `columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5`

**Recommendation**: Option A - Same as portfolio for consistency. Videos may have different aspect ratios, but CSS columns will handle it naturally.

---

### Q10: Loading States & Skeleton
**Question**: How should loading states be handled?
- A) Skeleton cards (placeholder cards with shimmer effect)
- B) Simple loading spinner
- C) Progressive loading (show cards as they load)
- D) No loading state (content loads fast enough)

**Recommendation**: Option C - Progressive loading with skeleton cards for initial load, then smooth appearance as images load. Better perceived performance.

---

### Q11: Empty States
**Question**: What should empty states show?
- A) Simple message: "No social content available"
- B) Platform-specific messages: "No Instagram Reels" / "No YouTube videos"
- C) Encouraging message with illustration/icon
- D) Hide section entirely if no content

**Recommendation**: Option D for homepage (hide if no content), Option A for full page (show message if filters result in no content).

---

### Q12: Animation & Transitions
**Question**: What animations should we use?
- A) Same as portfolio: Fade-in with scale, staggered delays
- B) Simpler: Just fade-in (no scale)
- C) More dramatic: Slide-in from sides
- D) Minimal: No entrance animations (instant)

**Current Portfolio**: Fade-in with slight scale (0.95 → 1.0), staggered delays (0.05s per item).

**Recommendation**: Option A - Consistent with portfolio page, provides polished feel without being distracting.

---

### Q13: Video Thumbnail Quality
**Question**: How should we handle video thumbnails?
- A) Use provided thumbnails from Sanity (if available)
- B) Auto-generate YouTube thumbnails (from video ID)
- C) Use first frame of video (if possible)
- D) Fallback to placeholder image if no thumbnail

**Current**: Sanity provides thumbnails, YouTube thumbnails can be auto-generated.

**Recommendation**: Option B + A - Use Sanity thumbnails if available, auto-generate YouTube thumbnails (`https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`), placeholder as last resort.

---

### Q14: Modal Video Player Controls
**Question**: For YouTube videos in modal, should we:
- A) Full YouTube player with all controls (current, recommended)
- B) Minimal controls (play/pause, volume only)
- C) Custom controls (build our own player UI)
- D) Autoplay when modal opens (muted, user can unmute)

**Recommendation**: Option A - Full YouTube embed with all controls. Most reliable, familiar to users, handles all edge cases.

---

### Q15: Section Spacing & Padding
**Question**: How should the section be spaced on homepage?
- A) Same as other sections (py-12 md:py-14 lg:py-16)
- B) More spacing (py-16 md:py-20) - emphasize importance
- C) Less spacing (py-8 md:py-10) - compact
- D) Match portfolio section spacing exactly

**Recommendation**: Option A - Consistent with other homepage sections for visual rhythm.

---

## Visual Design Mockup Considerations

### Card Structure (Pinterest Masonry)
```
┌─────────────────┐
│ [IG Badge]      │  ← Top-left platform badge
│                 │
│                 │
│   [▶ Play]      │  ← Centered play button (subtle)
│                 │
│                 │
│                 │
│ Title/Caption   │  ← On hover overlay (gradient)
└─────────────────┘
```

### Grid Layout
- **Mobile**: 2 columns, natural heights
- **Tablet**: 3 columns
- **Desktop**: 4 columns
- **XL**: 5 columns
- Gap: 16px (gap-4)

### Play Button Specs
- Size: 48px circle
- Background: Semi-transparent white/black (rgba(255,255,255,0.9) or rgba(0,0,0,0.7))
- Icon: Play triangle (lucide-react Play icon)
- Position: Centered, absolute
- Opacity: 60% default, 100% on hover
- Transition: 200ms ease

### Platform Badge Specs
- Size: 24px circle/square
- Instagram: Pink gradient background (#E4405F to #C13584)
- YouTube: Red circle (#FF0000)
- Icon: White, 16px
- Position: Top-left, 8px from edges
- Shadow: Subtle drop shadow for visibility

---

## Implementation Priorities

### Phase 1: Core Functionality (MVP)
1. Pinterest masonry grid layout
2. Unified card design with platform badges
3. Subtle play button
4. Modal with YouTube embed
5. Instagram redirect handling
6. Homepage: Max 8 items + "View all" link

### Phase 2: Enhanced UX
1. Hover states (title/caption overlay)
2. Modal navigation (next/previous arrows)
3. Platform filtering on full page
4. Infinite scroll on full page
5. Loading states

### Phase 3: Polish
1. Animations and transitions
2. Empty states
3. Error handling
4. Performance optimization
5. Accessibility enhancements

---

## Next Steps

Once these questions are answered, update:
1. `spec.md` - Finalize all functional requirements
2. `plan.md` - Update implementation plan with specific design decisions
3. `data-model.md` - Update sorting and display logic
4. Create visual mockup/wireframe if needed
