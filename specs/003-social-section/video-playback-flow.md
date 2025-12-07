# Video Playback Flow: Social Bits Section

**Feature**: 003-social-section  
**Date**: 2025-01-XX

## Overview

This document explains how video playback, play/pause controls, and the video player work within the Social Bits section.

## User Flow

### 1. Card Interaction (Grid View)

```
User sees card in Pinterest masonry grid
  ↓
Card shows:
  - Thumbnail image
  - Platform badge (top-left)
  - Play button (centered, 60% opacity)
  ↓
User clicks anywhere on card OR clicks play button
  ↓
Modal opens (smooth animation)
  ↓
Video player loads in modal
```

**Important**: The play button on the card is **NOT** a functional video player - it's a visual indicator. Clicking it (or the card) opens the modal where the actual video plays.

---

## Video Player Implementation

### YouTube Videos

#### How It Works:
1. **Card Click** → Opens modal
2. **Modal Opens** → YouTube iframe embed loads
3. **YouTube Player** → Full YouTube player with all controls appears

#### YouTube Embed Details:
```typescript
// YouTube embed URL format
https://www.youtube.com/embed/{VIDEO_ID}?controls=1&rel=0&modestbranding=1

// For YouTube Shorts (vertical videos)
https://www.youtube.com/embed/{VIDEO_ID}?controls=1&rel=0
// Aspect ratio: 9:16 (handled automatically)
```

#### Play/Pause Controls:
- **Built-in YouTube Controls**: The iframe includes YouTube's native player controls
  - Play/Pause button (center overlay when paused)
  - Progress bar (seekable)
  - Volume control
  - Fullscreen button
  - Settings menu
  - Quality selector
  - Speed controls
- **No Custom Controls Needed**: YouTube's embed handles everything
- **Keyboard Support**: 
  - Spacebar: Play/Pause (when iframe is focused)
  - Arrow keys: Seek forward/backward
  - M: Mute/unmute
  - F: Fullscreen

#### Autoplay Behavior:
- **NO autoplay** (as per requirements)
- Video loads paused
- User must click play button in YouTube player to start
- This respects user preferences and data usage

---

### Instagram Reels

#### How It Works (Desktop):
1. **Card Click** → Opens modal
2. **Modal Opens** → Attempts to load Instagram embed
3. **Embed Attempt**:
   - If embed works → Instagram player appears with controls
   - If embed fails → Shows fallback with "Watch on Instagram" button

#### Instagram Embed Details:
```typescript
// Instagram embed URL format
https://www.instagram.com/p/{POST_ID}/embed/

// For Reels
https://www.instagram.com/reel/{REEL_ID}/embed/
```

#### Play/Pause Controls (If Embed Works):
- **Instagram's Native Controls**: If embed loads successfully, Instagram provides:
  - Play/Pause button
  - Volume control
  - Fullscreen option
  - Basic playback controls
- **Limitations**: Instagram embeds are less reliable than YouTube, especially on mobile

#### Fallback Behavior:
- **If Embed Fails** (or on mobile):
  - Shows preview thumbnail
  - Displays "Watch on Instagram" button
  - Clicking button opens Instagram in new tab/app
  - User watches video on Instagram platform

---

## Modal Structure

### Modal Layout:
```
┌─────────────────────────────────────┐
│                          [X] Close  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │   [YouTube/Instagram Player]  │ │
│  │   (with native controls)      │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  [← Prev]              [Next →]    │ ← Navigation arrows
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [Platform Icon] Video Title   │ │ ← Metadata
│  │ Video caption/description...  │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Modal Features:

1. **Video Player Area**:
   - YouTube: Full iframe with all controls
   - Instagram: Embed iframe (if available) or redirect button
   - Responsive sizing (16:9 for YouTube, 9:16 for Shorts/Reels)

2. **Navigation Arrows**:
   - Left arrow: Previous video
   - Right arrow: Next video
   - Keyboard: Arrow keys also work
   - Smooth transitions when switching videos

3. **Close Button**:
   - Top-right corner
   - ESC key also closes
   - Clicking outside modal closes (optional)

4. **Video Metadata**:
   - Platform icon (Instagram/YouTube)
   - Video title/caption
   - Displayed below player

---

## Technical Implementation

### YouTube Player (Modal)

```typescript
// YouTube iframe embed
<iframe
  src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1`}
  title={video.caption || "YouTube video"}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="h-full w-full rounded-lg"
/>

// Key Parameters:
// - controls=1: Show YouTube controls (play/pause, volume, etc.)
// - rel=0: Don't show related videos
// - modestbranding=1: Hide YouTube logo
// - NO autoplay parameter: Video loads paused
```

### Instagram Player (Modal - Desktop)

```typescript
// Instagram embed attempt
<iframe
  src={`https://www.instagram.com/reel/${reelId}/embed/`}
  title={video.caption || "Instagram Reel"}
  allow="encrypted-media"
  className="h-full w-full rounded-lg"
/>

// Fallback if embed fails:
<div className="flex items-center justify-center">
  <Button onClick={() => window.open(video.src, "_blank")}>
    Watch on Instagram
  </Button>
</div>
```

### Instagram Player (Modal - Mobile)

```typescript
// Always redirect on mobile (embeds are unreliable)
<div className="flex items-center justify-center">
  <div className="text-center">
    <Instagram className="h-12 w-12" />
    <p>Watch this reel on Instagram</p>
    <Button onClick={() => window.open(video.src, "_blank")}>
      Open on Instagram
    </Button>
  </div>
</div>
```

---

## Play/Pause Control Details

### YouTube Player Controls:

1. **Play Button**:
   - Appears in center when video is paused
   - Large, prominent button
   - Click to play

2. **Pause Button**:
   - Appears in center when video is playing
   - Click to pause
   - Also accessible via bottom control bar

3. **Control Bar** (bottom of player):
   - Play/Pause toggle
   - Progress bar (clickable to seek)
   - Current time / Total time
   - Volume control
   - Settings menu
   - Fullscreen button

4. **Keyboard Controls** (when iframe focused):
   - `Space`: Play/Pause
   - `←` / `→`: Seek backward/forward (10 seconds)
   - `↑` / `↓`: Volume up/down
   - `M`: Mute/unmute
   - `F`: Fullscreen
   - `0-9`: Jump to percentage (0% to 90%)

### Instagram Player Controls (If Embed Works):

1. **Play/Pause**:
   - Center overlay button
   - Basic playback control

2. **Volume**:
   - Volume control available
   - May be limited compared to YouTube

3. **Fullscreen**:
   - May or may not be available (depends on Instagram embed)

**Note**: Instagram embed controls are more limited and less reliable than YouTube.

---

## Navigation Between Videos

### How It Works:

1. **User clicks video card** → Modal opens with that video
2. **User clicks next/previous arrow** → Modal transitions to next/previous video
3. **Video player resets** → New video loads (paused, ready to play)
4. **User clicks play** → New video starts playing

### Navigation Implementation:

```typescript
// Modal receives array of all videos
const [currentIndex, setCurrentIndex] = useState(initialIndex);

// Navigate to next video
const handleNext = () => {
  if (currentIndex < items.length - 1) {
    setCurrentIndex(currentIndex + 1);
    // Video player iframe src updates automatically
  }
};

// Navigate to previous video
const handlePrev = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  }
};
```

### Smooth Transitions:

- When navigating between videos, the modal smoothly transitions
- Old video stops playing
- New video loads (paused)
- User can click play to start new video
- Animation: Fade or slide transition (300ms)

---

## Key Points Summary

### ✅ What Works:
1. **Card Play Button**: Visual indicator only - opens modal
2. **Modal Video Player**: Full-featured player with native controls
3. **YouTube**: Full controls (play/pause, volume, fullscreen, etc.)
4. **Instagram**: Embed on desktop (if works), redirect on mobile
5. **Navigation**: Arrow buttons to browse videos in modal
6. **Keyboard**: ESC to close, arrow keys for navigation

### ❌ What Doesn't Work:
1. **No Inline Playback**: Videos don't play directly in the grid
2. **No Autoplay**: Videos load paused (user must click play)
3. **No Custom Controls**: We use platform-native controls (YouTube/Instagram)
4. **Instagram Limitations**: Embeds may not work on all devices/browsers

### 🎯 User Experience:
1. **Click card** → Modal opens
2. **Click play in modal** → Video plays
3. **Use native controls** → Play/pause, volume, fullscreen
4. **Navigate with arrows** → Browse other videos
5. **Close modal** → Return to grid

---

## Future Enhancements (Post-MVP)

1. **Video Previews**: Hover over card to see short preview (if technically feasible)
2. **Autoplay Option**: User preference to autoplay videos in modal
3. **Playlist Mode**: Auto-play next video when current ends
4. **Picture-in-Picture**: Continue watching while browsing grid
5. **Custom Controls**: Build custom player UI for more control

---

## Questions & Answers

**Q: Can videos play directly in the grid without opening modal?**  
A: No, not in the initial implementation. All videos play in the modal for consistency and better UX.

**Q: Can we add custom play/pause buttons?**  
A: We use platform-native controls (YouTube/Instagram) for reliability. Custom controls would require YouTube/Instagram APIs and are more complex.

**Q: Will videos autoplay when modal opens?**  
A: No, videos load paused. User must click play to start (respects user preferences and data usage).

**Q: Can we control playback programmatically?**  
A: Limited. YouTube iframe API allows some control, but we're using simple embeds for reliability. Instagram embeds have very limited API access.

**Q: What happens if Instagram embed doesn't work?**  
A: Fallback shows "Watch on Instagram" button that opens Instagram in new tab/app.
