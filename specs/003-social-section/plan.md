# Implementation Plan: Social Section

**Branch**: `003-social-section` | **Date**: 2025-01-XX | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-social-section/spec.md`

## Summary

Replace the existing "Videos & Reels" section (VideoGrid component) with a new unified **Social Bits** section that provides an intuitive, responsive, and user-friendly experience for browsing Instagram Reels and YouTube videos. The new section uses a Pinterest-style masonry grid layout (same as portfolio page) to display both platforms together in a cohesive interface. Content is sorted chronologically (newest first), with subtle play buttons, platform badges, smooth hover interactions, and enhanced video modal with navigation. The implementation maintains the same data sources from Sanity CMS but presents content in a more modern, native-feeling interface.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode), React 19.2.0, Next.js 16.0.5  
**Primary Dependencies**: 
- Framer Motion 12.23.24 (carousel animations, swipe gestures)
- shadcn/ui components (Dialog, Card, Button, Tabs if needed)
- Next.js Image (optimized thumbnail display)
- next-sanity 11.6.10 (Sanity integration)
- Tailwind CSS 4 (styling with theme tokens)

**Storage**: Sanity CMS (headless CMS for video/reel media items)  
**Testing**: Manual testing (no automated tests per project requirements)  
**Target Platform**: Web (Next.js App Router), responsive (mobile-first)  
**Project Type**: Web application (Next.js frontend)  
**Performance Goals**: 
- LCP < 2.5s (section loads quickly)
- 60fps animations during carousel navigation
- Smooth swipe gestures on mobile (no jank)
- Lazy loading of video thumbnails and embeds

**Constraints**: 
- Must use theme tokens only (no hard-coded colors)
- Must support dark/light mode via theme system
- Mobile-first responsive design (Pinterest masonry: 2 columns mobile, 3 tablet, 4 desktop, 5 xl)
- Must use Server Components by default, Client Components only for interactivity
- All images via Next.js Image component with proper optimization
- Instagram Reels: Try embed on desktop, redirect on mobile
- Maintain existing data structure from Sanity
- Use CSS columns for masonry layout (same as portfolio)

**Scale/Scope**: 
- Replace VideoGrid component with SocialBitsSection
- New SocialBitsGrid component (~200-300 LOC) - Pinterest masonry using CSS columns
- New SocialBitsCard component (~200-250 LOC) - Card with platform badge, play button, hover states
- Enhanced SocialBitsModal component (~300-400 LOC) - Video modal with navigation arrows
- Optional PlatformFilter component (~100 LOC) - For /social page only
- Update HomeClient.tsx to use SocialBitsSection
- Replace /videos page with /social page
- No schema changes needed (use existing MediaItem structure)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Sanity-driven content**: Uses existing `getVideoItems()` from Sanity, no hard-coded content
- ✅ **Server Components by default**: Homepage page.tsx remains Server Component, SocialSection is Client Component for interactivity
- ✅ **Theme tokens only**: All colors, spacing, typography use theme tokens
- ✅ **Mobile-first responsive**: Responsive breakpoints: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- ✅ **Accessibility**: Keyboard navigation, ARIA labels, screen reader support, focus indicators
- ✅ **Performance**: Lazy loading, optimized images, efficient animations
- ✅ **Type safety**: TypeScript strict mode, proper MediaItem types

## Phase 0: Research & Analysis

### Current Implementation Analysis
- **VideoGrid Component**: Uses Tabs to separate YouTube and Reels, ReelsCarousel for scroll layout
- **ReelsCarousel Component**: Horizontal swipeable carousel with autoplay, supports both platforms
- **VideoModal Component**: Basic modal for video playback, handles YouTube embeds and Instagram redirects
- **Data Flow**: `getVideoItems()` → filters by platform → passes to VideoGrid → displays in tabs

### Key Improvements Needed
1. **Unified View**: Remove tab separation, show all content together in Pinterest masonry grid
2. **Pinterest Layout**: Use CSS columns for masonry layout (same as portfolio page)
3. **Card Design**: Unified cards with platform badges (top-left), centered play button, hover states
4. **Platform Filtering**: Optional filter controls on /social page only (not homepage)
5. **Enhanced Modal**: Better video player with navigation arrows, try Instagram embed on desktop
6. **Visual Polish**: Hover states with scale, title/caption overlay, play button visibility

### Technical Decisions
- **Layout**: Pinterest-style masonry using CSS columns (`columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5`)
- **Animation Library**: Framer Motion for card animations (fade-in, scale, staggered delays)
- **State Management**: React useState for filtering, URL params for filter state, useState/useRef for modal navigation
- **Video Handling**: YouTube embeds in modal, Instagram: try embed on desktop, redirect on mobile
- **Infinite Scroll**: Intersection Observer for loading more items on /social page (like portfolio)

## Phase 1: Design & Architecture

### Component Architecture

```
SocialBitsSection (Client Component)
├── PlatformFilter (optional, Client Component, /social page only)
│   └── Filter buttons (All, Instagram, YouTube)
├── SocialBitsGrid (Client Component)
│   ├── CSS Columns Container (columns-2 md:columns-3 lg:columns-4 xl:columns-5)
│   └── SocialBitsCard[] (Client Component)
│       ├── Thumbnail (Next.js Image, natural height)
│       ├── Platform Badge (top-left, 24px colored circle)
│       ├── Play Button (centered, 48px semi-transparent circle)
│       └── Title/Caption Overlay (on hover, gradient background)
└── SocialBitsModal (Client Component, enhanced VideoModal)
    ├── Video Player (YouTube embed or Instagram embed/redirect)
    ├── Navigation Arrows (previous/next video)
    ├── Video Metadata (title, caption, platform)
    └── Close Button
```

### Data Flow

```
Server Component (page.tsx)
  ↓ (fetch from Sanity)
getVideoItems()
  ↓ (filter by platform)
reels: MediaItem[]
youtubeVideos: MediaItem[]
  ↓ (pass as props)
HomeClient (Client Component)
  ↓ (combine and sort)
SocialSection (Client Component)
  ↓ (render)
SocialCarousel → SocialCard[]
```

### Responsive Breakpoints (Pinterest Masonry)

- **Mobile (< 640px)**: 
  - 2 columns (CSS columns)
  - Natural image heights (maintain aspect ratios)
  - Cards with platform badges and play buttons
  - Touch-friendly interactions
  
- **Tablet (640px - 1024px)**: 
  - 3 columns
  - Same card design, more content visible
  - Hover states work on touch devices
  
- **Desktop (1024px - 1280px)**: 
  - 4 columns
  - Hover states with scale (1.02x) and title/caption overlay
  - Play button becomes fully visible on hover
  
- **XL Desktop (> 1280px)**: 
  - 5 columns
  - Maximum content density while maintaining readability

### Animation Strategy

- **Entrance**: Fade-in with scale (0.95 → 1.0) when card enters viewport (useInView from Framer Motion)
- **Staggered Delays**: 0.05s delay per card for polished appearance
- **Card Hover**: Scale (1.0 → 1.02x) with smooth transition (200ms)
- **Play Button**: Opacity transition (60% → 100%) on hover (200ms ease)
- **Title Overlay**: Fade-in on hover (opacity 0 → 1) with gradient background (300ms)
- **Modal**: Smooth open/close (200-300ms, ease-out)
- **Modal Navigation**: Smooth slide transitions when navigating between videos (300ms)

## Phase 2: Implementation

### Step 1: Create SocialBitsSection Component
- **File**: `src/components/custom/SocialBitsSection/SocialBitsSection.tsx`
- **Props**: `reels: MediaItem[]`, `youtubeVideos: MediaItem[]`, `onVideoClick?: (item: MediaItem) => void`, `maxItems?: number` (for homepage limit)
- **Features**: 
  - Combine and sort reels + YouTube videos (newest first)
  - Limit items for homepage (max 8)
  - Optional platform filtering (for /social page)
  - Render SocialBitsGrid
  - Handle empty states (hide section on homepage if no content)

### Step 2: Create SocialBitsGrid Component
- **File**: `src/components/custom/SocialBitsSection/SocialBitsGrid.tsx`
- **Props**: `items: MediaItem[]`, `onItemClick?: (item: MediaItem, index: number) => void`, `initialBatchSize?: number`, `loadMoreBatchSize?: number`
- **Features**:
  - Pinterest-style masonry using CSS columns (`columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5`)
  - Infinite scroll with Intersection Observer (for /social page)
  - Progressive loading with skeleton cards
  - Cards use `break-inside-avoid` to prevent splitting

### Step 3: Create SocialBitsCard Component
- **File**: `src/components/custom/SocialBitsSection/SocialBitsCard.tsx`
- **Props**: `item: MediaItem`, `onClick?: (item: MediaItem) => void`, `index: number`
- **Features**:
  - Platform badge (top-left, 24px colored circle - Instagram pink gradient, YouTube red)
  - Optimized thumbnail (Next.js Image, natural height, maintains aspect ratio)
  - Play button (centered, 48px semi-transparent circle, 60% opacity, 100% on hover)
  - Title/caption overlay (on hover, gradient background from black/80)
  - Hover states: scale (1.02x), overlay fade-in, play button opacity increase
  - Framer Motion animations (fade-in with scale, staggered delays)

### Step 4: Create SocialBitsModal Component
- **File**: `src/components/custom/SocialBitsSection/SocialBitsModal.tsx`
- **Props**: `items: MediaItem[]`, `initialIndex: number`, `open: boolean`, `onOpenChange: (open: boolean) => void`
- **Features**:
  - YouTube embed with full controls (standard and Shorts support)
  - Instagram: Try embed on desktop, redirect on mobile, with "Watch on Instagram" fallback button
  - Navigation arrows (previous/next video) - left/right buttons
  - Video metadata display (title, caption, platform badge)
  - Keyboard accessibility (ESC to close, arrow keys for navigation)
  - Responsive sizing (handles both 16:9 and 9:16 aspect ratios)
  - Smooth transitions when navigating between videos

### Step 5: Create PlatformFilter Component (Optional)
- **File**: `src/components/custom/SocialSection/PlatformFilter.tsx`
- **Props**: `onFilterChange: (platform: 'all' | 'instagram' | 'youtube') => void`, `currentFilter: string`
- **Features**:
  - Filter buttons (All, Instagram, YouTube)
  - Active state styling
  - URL parameter sync (optional)

### Step 6: Update HomeClient
- **File**: `src/app/(site)/HomeClient.tsx`
- **Changes**:
  - Replace `VideoGrid` import with `SocialBitsSection`
  - Replace `<VideoGrid>` with `<SocialBitsSection maxItems={8} />`
  - Update section title to "Social Bits" with subtitle "See the looks in motion"
  - Maintain same data props (reels, youtubeVideos)
  - Update "View all" link to point to `/social` instead of `/videos`

### Step 7: Replace /videos Page
- **File**: `src/app/videos/page.tsx` → `src/app/social/page.tsx`
- **Changes**:
  - Rename route from `/videos` to `/social`
  - Update page title and metadata
  - Use SocialSection instead of VideoGrid
  - Add redirect from `/videos` to `/social` (optional, for backward compatibility)

### Step 8: Update Navigation Links
- **Files**: Various components that link to `/videos`
- **Changes**: Update links to point to `/social` instead of `/videos`

## Phase 3: Integration & Testing

### Integration Checklist
- [ ] SocialBitsSection renders on homepage (max 8 items)
- [ ] SocialBitsSection renders on /social page (all items, infinite scroll)
- [ ] Pinterest masonry grid works correctly (CSS columns)
- [ ] Cards maintain native aspect ratios (1:1 reels, 16:9 YouTube)
- [ ] Platform badges display correctly (top-left, colored circles)
- [ ] Play buttons are subtle and visible (centered, 60% opacity)
- [ ] Hover states work (scale, overlay, play button visibility)
- [ ] Platform filtering works on /social page (All/Instagram/YouTube)
- [ ] Video modal opens and plays correctly
- [ ] YouTube videos embed properly in modal
- [ ] Instagram Reels: embed on desktop, redirect on mobile
- [ ] Modal navigation arrows work (previous/next video)
- [ ] Infinite scroll works on /social page
- [ ] Empty states display correctly
- [ ] Responsive design works across breakpoints (2/3/4/5 columns)
- [ ] Keyboard navigation works (modal, filtering)
- [ ] Screen reader announces correctly
- [ ] Performance is smooth (60fps animations, lazy loading)

### Testing Scenarios
1. **Masonry Grid Test**: Verify CSS columns layout works, cards don't split across columns
2. **Aspect Ratio Test**: Verify reels (1:1) and YouTube (16:9) maintain native ratios
3. **Hover States Test**: Verify scale, overlay, and play button visibility on hover
4. **Platform Badge Test**: Verify badges display correctly (top-left, colored circles)
5. **Play Button Test**: Verify subtle play button (60% opacity) becomes fully visible on hover
6. **Video Playback Test**: Click various videos, verify modal opens and plays
7. **Modal Navigation Test**: Use arrow buttons in modal to navigate between videos
8. **Instagram Embed Test**: Verify embed works on desktop, redirect on mobile
9. **Platform Filter Test**: Filter by platform on /social page, verify content updates
10. **Infinite Scroll Test**: Scroll on /social page, verify more items load
11. **Responsive Test**: Resize browser, verify column count adapts (2/3/4/5)
12. **Accessibility Test**: Navigate with keyboard, verify screen reader support
13. **Performance Test**: Check animation smoothness (60fps), lazy loading works

## Phase 4: Polish & Optimization

### Performance Optimization
- Lazy load video thumbnails (use Next.js Image with loading="lazy")
- Progressive loading with skeleton cards for initial load
- Infinite scroll with Intersection Observer (load 20 items at a time)
- Debounce resize handlers (if needed for responsive adjustments)
- Cleanup video players when modal closes
- Optimize animation performance (use transform, will-change for scale animations)
- Use CSS columns (native browser optimization) instead of JavaScript masonry

### Visual Polish
- Refine card hover states
- Improve platform badge design
- Enhance empty state messaging
- Add loading states for video thumbnails
- Refine animation timings

### Accessibility Enhancements
- Add ARIA labels to all interactive elements
- Ensure keyboard focus indicators are visible
- Test with screen readers (VoiceOver, NVDA)
- Verify color contrast ratios
- Add skip links if needed

## Success Criteria

1. ✅ SocialBitsSection displays unified content (reels + YouTube videos) in Pinterest masonry grid
2. ✅ Cards maintain native aspect ratios (1:1 reels, 16:9 YouTube) in CSS columns layout
3. ✅ Platform badges display correctly (top-left, colored circles)
4. ✅ Play buttons are subtle (60% opacity) and become fully visible on hover
5. ✅ Hover states work smoothly (scale, overlay, play button visibility)
6. ✅ Video modal opens and plays correctly with navigation arrows
7. ✅ Instagram embeds work on desktop, redirects work on mobile
8. ✅ Platform filtering works on /social page
9. ✅ Infinite scroll works on /social page
10. ✅ Responsive design works across all breakpoints (2/3/4/5 columns)
11. ✅ Accessibility requirements met (keyboard navigation, screen readers)
12. ✅ Performance targets achieved (60fps animations, lazy loading)
13. ✅ User experience feels intuitive, native, and easy to use

## Rollout Plan

1. **Development**: Implement on `003-social-section` branch
2. **Testing**: Manual testing across devices and browsers
3. **Review**: Code review and design review
4. **Deploy**: Merge to main, deploy to staging
5. **Monitor**: Check analytics, user feedback
6. **Iterate**: Make improvements based on feedback
