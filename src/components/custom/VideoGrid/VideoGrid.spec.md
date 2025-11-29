# VideoGrid Component Specification

## Overview
A tabbed video gallery component with two tabs: "Reels" (Instagram) and "YouTube". Reels display in a square grid (Instagram-style), YouTube videos in a 16:9 stacked layout.

## Props
- `reels` (MediaItem[], required): Array of Instagram reel items
- `youtubeVideos` (MediaItem[], required): Array of YouTube video items
- `onVideoClick` (function, optional): Callback fired when a video is clicked. Receives `item: MediaItem`

## Visual Design
- Tabs component (shadcn/ui) for switching between Reels and YouTube
- Reels: Square grid (2 columns mobile, 3-4 desktop)
- YouTube: Stacked 16:9 thumbnails (1 column mobile, 2 desktop)
- Video thumbnails with play icon overlay
- Hover effect: slight scale

## States
- Default: Shows active tab content
- Loading: Skeleton grids
- Empty: Message per tab if no content

## Accessibility
- Semantic tabs with proper ARIA
- Keyboard navigation between tabs
- Focus management

## Usage
```tsx
<VideoGrid 
  reels={instagramReels}
  youtubeVideos={youtubeItems}
  onVideoClick={(item) => openVideoModal(item)}
/>
```

## Constraints
- Must use Tabs component from shadcn/ui
- Must use Next.js Image component
- Mobile-first responsive
- No inline styles

