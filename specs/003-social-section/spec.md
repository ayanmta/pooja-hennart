# Feature Specification: Social Section

**Feature Branch**: `003-social-section`  
**Created**: 2025-01-XX  
**Status**: Draft  
**Input**: User description: "i want to plan a new Social section replacing the videos and reels, the functionality will almost be the same and data coming in as well, i want it to feel more intuitive, responsive, easy to use"

## Overview

Replace the existing "Videos & Reels" section on the homepage and `/videos` page with a new unified **Social Bits** section that provides an intuitive, responsive, and user-friendly experience for browsing Instagram Reels and YouTube videos. The section uses a Pinterest-style masonry grid layout (same as portfolio page) to display both platforms together in a cohesive, modern interface. Content is sorted chronologically (newest first), with subtle play buttons, platform badges, and smooth hover interactions. The section maintains native video aspect ratios while providing a clean, native-feeling browsing experience.

## Clarifications

### Session 2025-01-XX

**Confirmed Decisions:**
- **Section Title**: "Social Bits" (not "Social" or "Videos & Reels")
- **Content Sorting**: Newest first (chronological, most recent first)
- **Layout**: Pinterest-style masonry grid (CSS columns) - same as portfolio page
- **Card Design**: Unified design with platform badges (top-left, 24px colored circles)
- **Play Button**: Centered overlay, 48px semi-transparent circle, 60% opacity (100% on hover), always visible
- **Autoplay**: NO autoplay - subtle play button instead
- **Homepage Display**: Max 8 videos with "View all" link to `/social`
- **Aspect Ratios**: Maintain native ratios (1:1 reels, 16:9 YouTube), CSS columns handle layout
- **Hover States**: Scale (1.02x) + title/caption overlay + play button becomes fully visible
- **Instagram Modal**: Try embed on desktop, redirect on mobile, with "Watch on Instagram" fallback button
- **YouTube Modal**: Play in modal with full YouTube embed controls
- **Modal Navigation**: Add next/previous arrow buttons for seamless browsing
- **Full Page**: Infinite scroll (like portfolio) + optional platform filter (All/Instagram/YouTube)
- **Column Count**: Same as portfolio - 2 mobile, 3 tablet, 4 desktop, 5 xl
- **Animations**: Same as portfolio - fade-in with scale, staggered delays
- **Loading States**: Progressive loading with skeleton cards
- **Empty States**: Hide section on homepage if no content, show message on full page if filtered

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Social Content View (Priority: P1)

A visitor views the homepage and sees a new "Social" section that displays both Instagram Reels and YouTube videos in a unified, visually appealing interface. The content is presented in a way that feels cohesive and easy to browse, without requiring separate tabs or platform switching.

**Why this priority**: This is the core differentiator - moving from a tabbed interface to a unified view that feels more intuitive and modern.

**Independent Test**: Can be fully tested by viewing the homepage Social section and verifying that both reels and YouTube videos are displayed together in a unified interface, with clear visual indicators for platform type.

**Acceptance Scenarios**:

1. **Given** a visitor views the homepage, **When** they scroll to the Social section, **Then** they see both Instagram Reels and YouTube videos displayed together in a unified carousel/grid
2. **Given** the Social section displays mixed content, **When** each item is rendered, **Then** it shows a clear platform indicator (Instagram or YouTube icon/badge) so users know the source
3. **Given** the Social section has both reels and videos, **When** content is displayed, **Then** items are sorted by recency or relevance (most recent first)
4. **Given** a visitor wants to filter by platform, **When** they interact with filter controls, **Then** they can optionally filter to show only Instagram Reels or only YouTube videos
5. **Given** the Social section loads, **When** there are no items available, **Then** an appropriate empty state message is displayed

---

### User Story 2 - Improved Mobile Experience (Priority: P1)

A mobile user interacts with the Social section and experiences smooth, intuitive gestures for browsing content. The interface feels native and responsive, with clear visual feedback and easy navigation.

**Why this priority**: Mobile is likely the primary device for viewing social content, so the experience must be excellent.

**Independent Test**: Can be fully tested on mobile devices by swiping through the Social section carousel and verifying smooth gestures, clear visual feedback, and intuitive navigation.

**Acceptance Scenarios**:

1. **Given** a mobile user views the Social section, **When** they swipe horizontally, **Then** content smoothly scrolls with momentum and snap-to-card behavior
2. **Given** a mobile user swipes through content, **When** they reach the end, **Then** they see a subtle indicator that more content is available (if applicable) or that they've reached the end
3. **Given** a mobile user taps a video/reel, **When** the modal opens, **Then** the video player is optimized for mobile viewing with appropriate sizing and controls
4. **Given** a mobile user views the Social section, **When** content loads, **Then** thumbnails are optimized for mobile with appropriate sizing and aspect ratios
5. **Given** a mobile user scrolls vertically past the Social section, **When** they return, **Then** the section maintains its scroll position or resets appropriately

---

### User Story 3 - Enhanced Desktop Experience (Priority: P2)

A desktop user views the Social section and experiences an elegant, spacious layout that makes browsing social content feel premium and engaging. Navigation is clear and intuitive with keyboard and mouse support.

**Why this priority**: Desktop provides more screen real estate, so we should take advantage of it while maintaining the intuitive feel.

**Independent Test**: Can be fully tested on desktop by viewing the Social section and verifying the layout, navigation controls, and interaction patterns work well with mouse and keyboard.

**Acceptance Scenarios**:

1. **Given** a desktop user views the Social section, **When** the section loads, **Then** multiple items are visible at once in a responsive grid or carousel layout
2. **Given** a desktop user hovers over a video/reel card, **When** they hover, **Then** they see a subtle preview or enhanced visual feedback (e.g., play button, hover state)
3. **Given** a desktop user wants to navigate, **When** they use arrow keys, **Then** the carousel navigates left/right with smooth animations
4. **Given** a desktop user clicks a video/reel, **When** the modal opens, **Then** the video player is appropriately sized for desktop with full controls
5. **Given** a desktop user views the Social section, **When** they resize the browser window, **Then** the layout adapts responsively while maintaining visual appeal

---

### User Story 4 - Video Playback & Modal Experience (Priority: P2)

A user clicks on a video or reel in the Social section and experiences a smooth, polished modal experience for viewing the content. The modal provides clear controls, platform-appropriate playback, and easy navigation.

**Why this priority**: The playback experience is critical - users need to easily view and navigate between videos.

**Independent Test**: Can be fully tested by clicking various videos/reels and verifying the modal opens correctly, playback works, and navigation is intuitive.

**Acceptance Scenarios**:

1. **Given** a user clicks a YouTube video, **When** the modal opens, **Then** the YouTube player loads with appropriate controls and autoplay behavior (if enabled)
2. **Given** a user clicks an Instagram Reel, **When** the modal opens, **Then** they see appropriate handling (embed or redirect to Instagram) with clear messaging
3. **Given** a user is viewing a video in the modal, **When** they want to close it, **Then** they can easily close via close button, ESC key, or clicking outside
4. **Given** a user views multiple videos, **When** they close and reopen the modal, **Then** the modal remembers or appropriately resets the video state
5. **Given** a user views a video, **When** the video metadata is available, **Then** they see title, caption, and platform information clearly displayed

---

### User Story 5 - Platform Filtering & Navigation (Priority: P3)

A user wants to filter the Social section to show only Instagram Reels or only YouTube videos. They can easily toggle between "All", "Instagram", and "YouTube" views with clear visual feedback.

**Why this priority**: While unified view is primary, some users may want to filter by platform - this should be easy but not required.

**Independent Test**: Can be fully tested by using filter controls and verifying that content updates appropriately, URL reflects filter state (if applicable), and visual feedback is clear.

**Acceptance Scenarios**:

1. **Given** a user views the Social section, **When** they see filter controls, **Then** they can select "All", "Instagram", or "YouTube" to filter content
2. **Given** a user selects a platform filter, **When** the filter is applied, **Then** only content from that platform is displayed
3. **Given** a user filters by platform, **When** they clear the filter (select "All"), **Then** all content is displayed again
4. **Given** a user applies a filter, **When** the filtered view has no results, **Then** an appropriate empty state message is shown
5. **Given** a user navigates to `/social?platform=instagram`, **When** the page loads, **Then** the filter is pre-applied and only Instagram content is shown

---

## Functional Requirements

### FR-001: Unified Content Display
- **Description**: Display both Instagram Reels and YouTube videos in a single, unified interface without requiring tab switching
- **Priority**: P1
- **Acceptance Criteria**:
  - Both reels and YouTube videos appear together in the same view
  - Platform indicators (icons/badges) clearly show the source of each item
  - Content is sorted by recency (most recent first) or relevance
  - Empty states are handled gracefully

### FR-002: Pinterest-Style Masonry Grid Layout
- **Description**: Implement a responsive Pinterest-style masonry grid layout using CSS columns, same as portfolio page
- **Priority**: P1
- **Acceptance Criteria**:
  - Mobile: 2 columns with natural image heights
  - Tablet: 3 columns
  - Desktop: 4 columns
  - XL screens: 5 columns
  - Layout uses CSS columns (`columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5`)
  - Cards maintain native aspect ratios (1:1 for reels, 16:9 for YouTube videos)
  - Layout adapts smoothly to window resizing
  - Cards use `break-inside-avoid` to prevent splitting across columns

### FR-003: Platform Filtering
- **Description**: Allow users to optionally filter content by platform (All, Instagram, YouTube)
- **Priority**: P3
- **Acceptance Criteria**:
  - Filter controls are easily accessible but not intrusive
  - Filter state can be reflected in URL parameters (`/social?platform=instagram`)
  - Filter changes update content smoothly without page reload
  - Empty states for filtered views are clear

### FR-004: Video Modal/Player
- **Description**: Provide a polished modal experience for viewing videos and reels
- **Priority**: P2
- **Acceptance Criteria**:
  - Modal opens smoothly with appropriate animations
  - YouTube videos: Full iframe embed with native YouTube controls (play/pause, volume, fullscreen, etc.)
  - YouTube videos load paused (no autoplay) - user must click play
  - Instagram Reels: Try embed on desktop, redirect on mobile, with "Watch on Instagram" fallback button
  - Navigation arrows (previous/next) for browsing videos within modal
  - Modal is keyboard accessible (ESC to close, arrow keys for navigation between videos)
  - Video metadata (title, caption, platform) displayed clearly below player
  - Smooth transitions when navigating between videos in modal

### FR-005: Card Interactions & Hover States
- **Description**: Implement smooth card interactions with hover states matching portfolio page
- **Priority**: P1
- **Acceptance Criteria**:
  - Cards scale slightly on hover (1.02x) with smooth transition
  - Title/caption overlay appears on hover with gradient background (if available)
  - Play button becomes fully opaque on hover (60% → 100% opacity)
  - All transitions are smooth (200-300ms)
  - Touch targets are appropriately sized (minimum 44x44px for mobile)
  - Hover states work on both desktop and mobile (touch)

### FR-006: Video Modal with Navigation
- **Description**: Provide polished modal experience with navigation between videos
- **Priority**: P2
- **Acceptance Criteria**:
  - Modal opens smoothly with appropriate animations
  - YouTube videos play with full embed controls in modal
  - Instagram Reels: Try embed on desktop, redirect on mobile, with fallback button
  - Next/previous arrow buttons for navigating between videos
  - Close button and ESC key functionality
  - Video metadata (title, caption, platform) displayed clearly
  - Modal is keyboard accessible (ESC to close, arrow keys for navigation)

### FR-007: Performance Optimization
- **Description**: Ensure the Social section loads quickly and performs well
- **Priority**: P2
- **Acceptance Criteria**:
  - Images/videos load lazily as user scrolls
  - Initial load shows content quickly (progressive loading)
  - Smooth animations (60fps) without jank
  - Efficient memory usage (cleanup of video players when not in view)
  - Appropriate image sizes for different viewports

### FR-008: Accessibility
- **Description**: Ensure the Social section is accessible to all users
- **Priority**: P2
- **Acceptance Criteria**:
  - Keyboard navigation works throughout
  - Screen reader announcements are appropriate
  - ARIA labels and roles are correct
  - Focus indicators are visible
  - Color contrast meets WCAG AA standards

---

## Technical Requirements

### TR-001: Component Architecture
- **Components**:
  - `SocialSection` - Main section component (replaces VideoGrid)
  - `SocialCarousel` - Carousel/grid container for social content
  - `SocialCard` - Individual video/reel card component
  - `SocialModal` - Video playback modal (can enhance existing VideoModal)
  - `PlatformFilter` - Optional platform filter controls
- **Data Flow**: Same as current implementation - receives `reels` and `youtubeVideos` as props from `HomeClient`

### TR-002: Data Structure
- **Input**: 
  - `reels: MediaItem[]` - Instagram Reels from Sanity
  - `youtubeVideos: MediaItem[]` - YouTube videos from Sanity
- **Processing**: 
  - Combine arrays and sort by date/relevance
  - Maintain platform information for filtering and display
- **Output**: Unified array with platform metadata for rendering

### TR-003: Styling & Responsive Design
- **Mobile (< 640px)**: 
  - 2 columns (CSS columns)
  - Natural image heights (maintain aspect ratios)
  - Cards with platform badges and play buttons
- **Tablet (640px - 1024px)**: 
  - 3 columns
  - Same card design, more content visible
- **Desktop (1024px - 1280px)**: 
  - 4 columns
  - Hover states with scale and overlay
- **XL Desktop (> 1280px)**: 
  - 5 columns
  - Maximum content density while maintaining readability

### TR-004: Animation & Transitions
- **Entrance**: Subtle fade-in when section enters viewport
- **Card Interactions**: Smooth hover/active states
- **Carousel Navigation**: Smooth slide transitions (300-400ms)
- **Modal**: Smooth open/close animations
- **Performance**: Use CSS transforms and GPU acceleration where possible

### TR-005: Integration Points
- **Homepage**: Replace `VideoGrid` in `HomeClient.tsx` with `SocialSection`
- **Videos Page**: Replace `/videos` page with `/social` page using `SocialSection`
- **Data Fetching**: Use existing `getVideoItems()` from Sanity queries
- **Modal**: Enhance or replace `VideoModal` for better social content handling

---

## Design Considerations

### Visual Design
- **Unified Aesthetic**: Cards should feel cohesive regardless of platform
- **Platform Indicators**: Clear but subtle badges/icons (Instagram pink, YouTube red)
- **Typography**: Consistent with site-wide typography standards
- **Spacing**: Generous padding and margins for breathing room
- **Colors**: Use theme colors, maintain contrast for accessibility

### User Experience
- **Progressive Disclosure**: Show essential info first, details on interaction
- **Clear Hierarchy**: Most important content (videos) is prominent
- **Feedback**: Clear visual feedback for all interactions
- **Error Handling**: Graceful handling of missing thumbnails, broken links, etc.
- **Loading States**: Appropriate loading indicators during content fetch

### Mobile-First Approach
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Gesture Support**: Native-feeling swipe gestures
- **Performance**: Optimize for mobile performance (lazy loading, efficient rendering)
- **Viewport**: Proper handling of mobile viewport and safe areas

---

## Assumptions

1. **Data Source**: Same Sanity CMS data structure for videos/reels will be used
2. **Platform Support**: Instagram Reels may require redirect to Instagram (embed limitations)
3. **Browser Support**: Modern browsers with ES6+ and CSS Grid/Flexbox support
4. **Performance**: Users expect smooth 60fps animations on modern devices
5. **Accessibility**: Keyboard navigation and screen reader support are required
6. **SEO**: Social content is primarily for engagement, not SEO (videos are external)

---

## Out of Scope

1. **Video Upload**: No ability to upload videos directly in the UI
2. **Comments/Likes**: No social engagement features (likes, comments, shares)
3. **Video Editing**: No video editing or manipulation capabilities
4. **Analytics**: No built-in analytics tracking (can be added separately)
5. **Playlists**: No custom playlist creation or management
6. **Live Streaming**: No support for live video streams

---

## Success Metrics

1. **User Engagement**: Increased time spent in Social section vs. previous Videos section
2. **Mobile Usage**: Smooth mobile experience with high swipe gesture success rate
3. **Performance**: Page load time < 2s, smooth 60fps animations
4. **Accessibility**: 100% keyboard navigation coverage, WCAG AA compliance
5. **User Feedback**: Positive feedback on intuitiveness and ease of use

---

## Dependencies

- **Existing Components**: Can leverage `ReelsCarousel`, `VideoModal` with enhancements
- **Framer Motion**: For animations and gestures (already in project)
- **Next.js Image**: For optimized image loading (already in project)
- **Sanity CMS**: Existing video/reel data structure
- **shadcn/ui**: For UI components (Dialog, Card, etc.)

---

## Risks & Mitigations

1. **Risk**: Instagram embed limitations may require redirects
   - **Mitigation**: Clear messaging and smooth redirect experience
2. **Risk**: Performance issues with many videos
   - **Mitigation**: Lazy loading, virtualization, efficient rendering
3. **Risk**: Complex gesture handling on mobile
   - **Mitigation**: Use proven libraries (Framer Motion), thorough testing
4. **Risk**: Breaking changes to existing `/videos` route
   - **Mitigation**: Proper redirects, URL migration strategy

---

## Future Enhancements (Post-MVP)

1. **Infinite Scroll**: Auto-load more content as user scrolls
2. **Video Previews**: Hover/tap previews before full modal
3. **Social Sharing**: Share buttons for individual videos
4. **Search/Filter**: Search within social content
5. **Collections**: Curated collections of videos/reels
6. **Analytics Integration**: Track video views and engagement
