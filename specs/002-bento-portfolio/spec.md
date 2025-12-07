# Feature Specification: Bento Portfolio Page

**Feature Branch**: `002-bento-portfolio`  
**Created**: 2025-01-06  
**Status**: Draft  
**Input**: User description: "when i click on profile category i get to main profile page, with selected category filtered, i want to create a very visually appealing profile page replacing existing one both in sanity and ui, it should follow all rules, bento japanese style to show images, and a very subtle yet appealing animation"

## Clarifications

### Session 2025-01-06

- Q: What bento grid layout algorithm should be used? → A: Algorithmic size assignment (assign sizes based on image order/featured status, then arrange)
- Q: How should the bento grid handle very large numbers of images? → A: Infinite scroll (automatically loads more as user scrolls)
- Q: Should the portfolio page have a category filter UI? → A: Filter bar on portfolio page with ability to clear filter to see all items
- Q: How should the bento grid handle images with different aspect ratios? → A: Maintain aspect ratios with object-fit cover (fill grid cells, may crop edges)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Filtered Portfolio by Category (Priority: P1)

A visitor clicks on a category card from the homepage carousel and is navigated to the portfolio page. The portfolio page displays all media items filtered by the selected category in a visually appealing bento-style grid layout. The URL reflects the selected category (e.g., `/portfolio?category=bridal`), and the page shows only media items belonging to that category.

**Why this priority**: This is the core functionality - replacing the existing DomeGallery portfolio page with a new bento-style layout that properly handles category filtering from the homepage navigation.

**Independent Test**: Can be fully tested by navigating to `/portfolio?category=bridal` and verifying that only bridal category media items are displayed in the bento grid layout, and that the URL parameter correctly filters the content.

**Acceptance Scenarios**:

1. **Given** a visitor clicks a category card on the homepage, **When** they are navigated to the portfolio page, **Then** the URL contains the category query parameter (e.g., `?category=bridal`)
2. **Given** the portfolio page loads with a category query parameter, **When** the page renders, **Then** only media items belonging to that category are displayed in the bento grid
3. **Given** the portfolio page loads without a category query parameter, **When** the page renders, **Then** all media items are displayed in the bento grid
4. **Given** a visitor is viewing a filtered portfolio, **When** they change the category filter using the filter bar, **Then** the URL updates and the grid updates to show the new category's media items
5. **Given** a visitor is viewing a filtered portfolio, **When** they clear the filter (select "All"), **Then** the URL updates to remove the category parameter and all media items are displayed
6. **Given** a category has no media items, **When** the portfolio page loads with that category filter, **Then** an appropriate empty state message is displayed

---

### User Story 2 - Bento Grid Layout Display (Priority: P2)

A visitor views the portfolio page and sees media items arranged in a bento-style grid layout. The grid uses varying image sizes (some large, some small) arranged in an aesthetically pleasing pattern similar to a Japanese bento box. The layout is responsive, adapting to different screen sizes while maintaining visual appeal.

**Why this priority**: This defines the core visual presentation - the bento grid is the key differentiator from the previous DomeGallery implementation and provides the visually appealing layout requested.

**Independent Test**: Can be fully tested by viewing the portfolio page and verifying that media items are arranged in a bento-style grid with varying sizes, that the layout is responsive across mobile, tablet, and desktop, and that images maintain proper aspect ratios.

**Acceptance Scenarios**:

1. **Given** a visitor views the portfolio page, **When** the page loads, **Then** media items are displayed in a bento-style grid with varying sizes (some images larger, some smaller)
2. **Given** the bento grid is displayed, **When** viewed on mobile devices, **Then** the grid displays in a Pinterest-style masonry layout (2 columns with natural image heights) for optimal mobile browsing experience
3. **Given** the bento grid is displayed, **When** viewed on desktop devices, **Then** the grid shows multiple columns with varied image sizes creating an interesting visual pattern
4. **Given** media items are displayed in the bento grid, **When** images load, **Then** they maintain proper aspect ratios and don't distort
5. **Given** a visitor views the bento grid, **When** they scroll through the page, **Then** the grid layout remains stable without layout shifts

---

### User Story 3 - Subtle Animation Effects (Priority: P3)

A visitor views the portfolio page and experiences subtle, appealing animations as they interact with the page. Images fade in or scale up gently as they come into view during scrolling. The animations are smooth, performant, and enhance the visual experience without being distracting.

**Why this priority**: This adds polish and visual appeal to the portfolio page, creating a premium, editorial feel that matches the site's aesthetic while maintaining performance.

**Independent Test**: Can be fully tested by scrolling through the portfolio page and verifying that images animate smoothly as they enter the viewport, that animations respect user motion preferences, and that performance remains smooth (60fps target).

**Acceptance Scenarios**:

1. **Given** a visitor scrolls through the portfolio page, **When** images enter the viewport, **Then** they fade in or scale up with a subtle animation
2. **Given** animations are playing, **When** the user has `prefers-reduced-motion` enabled, **Then** animations are disabled or minimized
3. **Given** images are animating, **When** the page is scrolled, **Then** animations remain smooth without jank or stuttering (target: 60fps)
4. **Given** a visitor clicks on an image in the bento grid, **When** the lightbox opens, **Then** the transition is smooth and visually appealing
5. **Given** category filter changes, **When** the grid updates, **Then** the transition between filtered states is smooth and visually appealing

---

### Edge Cases

- What happens when a category has no media items? (Display empty state message)
- What happens when there are no media items at all? (Display appropriate empty state)
- What happens when an invalid category ID is in the URL? (Show all items or handle gracefully)
- How does the bento grid handle very large numbers of images? (Infinite scroll - automatically loads more images as user scrolls)
- What happens when images fail to load? (Display fallback placeholder or error state)
- How does the layout handle images with different aspect ratios? (Maintain aspect ratios with object-fit cover - fill grid cells, may crop edges)
- What happens when a user navigates directly to `/portfolio` without a category parameter? (Show all items)
- How does the bento grid adapt when window is resized? (Responsive breakpoints, recalculate layout)
- How does the mobile layout differ from desktop? (Mobile: Pinterest-style masonry with 2 columns and natural heights, Desktop: Bento grid with varied sizes and fixed aspect ratios)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display portfolio media items in a bento-style grid layout with varying image sizes
- **FR-002**: System MUST filter media items by category when a category query parameter is present in the URL (e.g., `?category=bridal`)
- **FR-003**: System MUST display all media items when no category query parameter is present
- **FR-004**: System MUST update the URL when category filter changes (browser history support)
- **FR-017**: System MUST display a category filter bar on the portfolio page with category chips/buttons
- **FR-018**: System MUST provide an "All" option in the filter bar to clear the filter and show all media items
- **FR-005**: System MUST support clicking on images to open them in a lightbox/modal view
- **FR-006**: System MUST display images using Next.js Image component with proper optimization
- **FR-007**: System MUST animate images as they enter the viewport during scrolling (fade-in or scale-up)
- **FR-008**: System MUST respect `prefers-reduced-motion` user preference for animations
- **FR-009**: System MUST maintain responsive layout across mobile, tablet, and desktop breakpoints
- **FR-019**: System MUST display Pinterest-style masonry layout on mobile devices (2 columns, natural image heights)
- **FR-020**: System MUST display horizontally scrollable category filter bar on mobile devices
- **FR-016**: System MUST implement infinite scroll for large numbers of images (automatically load more as user scrolls)
- **FR-010**: System MUST display appropriate empty states when no media items are available for a category
- **FR-011**: System MUST fetch all data from Sanity CMS via GROQ queries (no hard-coded content)
- **FR-012**: System MUST use theme tokens for all styling (no hard-coded colors)
- **FR-013**: System MUST support dark and light themes via theme system
- **FR-014**: System MUST maintain accessibility standards (ARIA labels, keyboard navigation, semantic HTML)
- **FR-015**: System MUST replace the existing portfolio page implementation (DomeGallery)

### Key Entities *(include if feature involves data)*

- **PortfolioPage**: The main portfolio page component that displays media items in a bento grid layout
- **BentoGrid**: Component responsible for arranging media items in a bento-style grid with varying sizes. Uses algorithmic size assignment based on image order and featured status (featured images receive larger sizes, then all images are arranged in the grid)
- **MediaItem**: Individual media item (image) displayed in the grid (from Sanity CMS)
- **CategoryFilter**: Filter state and URL parameter handling for category-based filtering. Includes filter bar UI component with category chips/buttons and "All" option to clear filter
- **ImageAnimation**: Animation wrapper for individual images in the grid (fade-in, scale-up effects)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view filtered portfolio by category within 2 seconds of page load (LCP < 2.5s)
- **SC-002**: Portfolio page maintains 60fps during scrolling and animations
- **SC-003**: Bento grid layout is visually appealing and maintains proper aspect ratios for all images
- **SC-004**: Category filtering works correctly 100% of the time (URL parameter matches displayed content)
- **SC-005**: Portfolio page is fully responsive and usable on mobile devices (touch targets minimum 44x44px, Pinterest-style masonry layout on mobile)
- **SC-006**: Images load progressively with smooth animations without causing layout shifts (CLS < 0.1)
- **SC-007**: Portfolio page follows all constitution principles (Sanity-driven, Server Components, theme tokens, accessibility)
- **SC-008**: Users can navigate between categories smoothly with visual feedback

## Assumptions

- Bento grid pattern will use algorithmic size assignment: sizes are assigned to images based on their order and featured status (e.g., featured images get larger sizes, then images are arranged in the grid)
- Animation style will be fade-in with slight scale-up effect (can be refined during implementation)
- Category filtering will use URL query parameters (`?category=bridal`) for shareability and browser history support
- Lightbox functionality already exists in the codebase (`MediaLightbox` component) and can be reused
- Existing Sanity queries for media items and categories can be extended/used
- Bento grid will use infinite scroll for large numbers of images (automatically loads more as user scrolls)
- Images will maintain their original aspect ratios in the bento grid using object-fit cover (fill grid cells, may crop edges to fit)
- Portfolio page will replace the existing `/portfolio` route and `PortfolioClient` component
- Mobile devices will use Pinterest-style masonry layout (2 columns, natural image heights) for better mobile browsing experience
- Category filter bar will be horizontally scrollable on mobile devices for better UX

## Dependencies

- Existing Sanity CMS schema for `mediaItem` and `category` documents
- Existing `MediaLightbox` component for image viewing
- Existing `getMediaItems()` and `getCategories()` queries from `src/lib/sanity/queries.ts`
- Next.js App Router for routing and Server Components
- Framer Motion or CSS animations for subtle animation effects
- shadcn/ui components for base UI elements (if needed)

## Constraints

- Must follow all constitution principles (Sanity-driven, Server Components by default, TypeScript strict, theme tokens only, mobile-first, accessibility)
- Must replace existing portfolio page implementation (DomeGallery)
- Must maintain performance targets (LCP < 2.5s, 60fps animations, CLS < 0.1)
- Must support dark/light themes via theme system
- Must be fully responsive (mobile-first design)
- Must use Next.js Image component for all images
- Must respect `prefers-reduced-motion` for accessibility
- Must maintain existing URL structure (`/portfolio` with optional `?category=id` query parameter)

## Out of Scope

- Video items in the bento grid (focus on images only for this feature)
- Advanced filtering beyond category (e.g., date, featured status)
- Search functionality within portfolio
- Image editing or manipulation features
- Social sharing buttons on individual images
- User-generated content or comments
- Analytics tracking implementation (can be added separately)
