# Quick Start: Social Section

**Feature**: 003-social-section  
**Date**: 2025-01-XX

## Overview

Replace the existing "Videos & Reels" section with a new unified **Social Section** that displays Instagram Reels and YouTube videos together in a more intuitive, responsive interface. The section maintains the same data sources but provides a better user experience with improved mobile gestures, desktop navigation, and optional platform filtering.

## Key Components

### SocialSection
- **Location**: `src/components/custom/SocialSection/SocialSection.tsx`
- **Purpose**: Main section component that replaces VideoGrid
- **Props**: 
  - `reels`: Array of Instagram Reels (MediaItem[])
  - `youtubeVideos`: Array of YouTube videos (MediaItem[])
  - `onVideoClick`: Handler for video/reel clicks
- **Features**: Unified content display, optional platform filtering, empty state handling

### SocialCarousel
- **Location**: `src/components/custom/SocialSection/SocialCarousel.tsx`
- **Purpose**: Responsive carousel container for social content
- **Props**:
  - `items`: Combined array of reels and videos
  - `onItemClick`: Handler for item clicks
- **Features**: 
  - Mobile: Horizontal swipeable carousel (1-1.5 cards visible)
  - Desktop: 3-4 cards visible with arrow navigation
  - Smooth animations with Framer Motion
  - Keyboard navigation support

### SocialCard
- **Location**: `src/components/custom/SocialSection/SocialCard.tsx`
- **Purpose**: Individual video/reel card component
- **Props**:
  - `item`: MediaItem (reel or video)
  - `onClick`: Click handler
  - `width`: Card width (for carousel)
- **Features**: 
  - Platform badge (Instagram/YouTube icon)
  - Optimized thumbnail (Next.js Image)
  - Play button overlay
  - Hover states and interactions

### SocialModal
- **Location**: `src/components/custom/SocialSection/SocialModal.tsx`
- **Purpose**: Video playback modal (enhanced VideoModal)
- **Props**:
  - `video`: MediaItem to play
  - `open`: Modal open state
  - `onOpenChange`: Handler for open state changes
- **Features**: 
  - YouTube embed with proper controls
  - Instagram redirect handling
  - Video metadata display
  - Keyboard accessibility

## Data Flow

```
Sanity CMS
  ↓ (GROQ queries)
Server Component (page.tsx)
  ↓ (getVideoItems())
reels: MediaItem[]
youtubeVideos: MediaItem[]
  ↓ (pass as props)
HomeClient (Client Component)
  ↓ (combine and sort)
SocialSection (Client Component)
  ↓ (render)
SocialCarousel → SocialCard[]
  ↓ (user clicks)
SocialModal (video playback)
```

## Implementation Steps

1. **Create SocialSection component**
   - Combine reels and YouTube videos
   - Add optional platform filtering
   - Handle empty states

2. **Create SocialCarousel component**
   - Implement responsive carousel layout
   - Add Framer Motion swipe gestures (mobile)
   - Add arrow button navigation (desktop)
   - Add keyboard navigation support

3. **Create SocialCard component**
   - Design card with platform badge
   - Add optimized thumbnail
   - Add play button overlay
   - Implement hover states

4. **Enhance SocialModal component**
   - Improve YouTube embed handling
   - Better Instagram redirect messaging
   - Add video metadata display
   - Enhance accessibility

5. **Update HomeClient**
   - Replace VideoGrid with SocialSection
   - Update section title if needed
   - Maintain same data props

6. **Replace /videos page**
   - Create /social page
   - Use SocialSection component
   - Add redirect from /videos (optional)

7. **Update navigation links**
   - Update all links to /videos to point to /social

## Key Features

- **Unified View**: Both Instagram Reels and YouTube videos displayed together
- **Platform Indicators**: Clear badges/icons showing content source
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Gestures**: Native-feeling swipe on mobile
- **Desktop Navigation**: Arrow buttons and keyboard support
- **Optional Filtering**: Filter by platform (All, Instagram, YouTube)
- **Enhanced Modal**: Better video playback experience
- **Accessibility**: Full keyboard navigation and screen reader support

## Responsive Behavior

- **Mobile (< 640px)**: 1-1.5 cards visible, swipe gestures
- **Tablet (640-1024px)**: 2-3 cards visible, swipe or buttons
- **Desktop (> 1024px)**: 3-4 cards visible, arrow buttons, keyboard

## Testing Checklist

- [ ] SocialSection renders on homepage
- [ ] Carousel works on mobile (swipe)
- [ ] Carousel works on desktop (buttons, keyboard)
- [ ] Video modal opens and plays
- [ ] Platform filtering works (if implemented)
- [ ] Responsive design works
- [ ] Keyboard navigation works
- [ ] Performance is smooth
