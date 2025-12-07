# Feature Specification: Simplify Portfolio Category Selection

**Feature Branch**: `001-simplify-portfolio`  
**Created**: 2025-01-06  
**Status**: Draft  
**Input**: User description: "i want to simplify the current Portfolio

Explore by look, it is using a globe like image visualisation currently , but this should be used to have a simpler pinterest like carouse style category selection, where i can have a template image also provided , , in mobile show 3 slides with categor name in bottom of card, look and feel should match of site, follow shadcn design, components, make sure to update teh schema and style in sanity as wel"

## Clarifications

### Session 2025-01-06

- Q: When a user clicks a category card that is already selected, what should happen? → A: Selected category cards remain selected; add a separate "All" card to show all media
- Q: What should the "All" card look like in the carousel? → A: "All" card displays a collage or representative image from all categories
- Q: How should the "All" card collage/representative image be generated? → A: Automatically generate collage from featured media items across all categories
- Q: What happens when a user clicks a category card? → A: Clicking a category card navigates/redirects to the portfolio page (portfolio page display is separate spec)
- Q: What should each category card display? → A: Each category card displays a collage automatically generated from that category's media items in Sanity

### Session 2025-01-06 (Updated Requirements)

- Q: Should category cards use collages? → A: No, use a single template image per category card
- Q: How many cards should be visible on mobile? → A: 2 full cards + half of a third card (2.5 cards) to indicate scrollability
- Q: Should the category filter bar be shown above the carousel? → A: No, remove the category filter bar since all categories are now in the carousel
- Q: When selecting a template image for a category card, what should be the priority order? → A: Prioritize featured images (isFeatured=true) first, then fall back to most recent image
- Q: On desktop, how many category cards should be visible at once? → A: Show 4-5 cards fully visible with partial visibility of next card to indicate scrollability
- Q: For the "All" card template image, what should be the selection priority when multiple featured items exist? → A: Use the first featured item found
- Q: What aspect ratio should category cards use for the template image? → A: 4:5 (portrait)
- Q: When there are only 1-2 categories (plus "All" card), how should the carousel behave? → A: Disable scrolling when all cards fit on screen

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Portfolio by Category (Priority: P1)

A visitor wants to explore the portfolio by category from the homepage. They see a horizontal carousel of category cards on the homepage, each displaying a single template image and the category name. They can swipe or scroll through categories on mobile (showing 2 full cards + half of a third card), or use mouse/trackpad on desktop. When they tap or click a category card, they are navigated to the portfolio page where they will see all images from that category (portfolio page display is handled in a separate specification).

**Why this priority**: This is the core functionality - replacing the complex 3D globe visualization on the homepage with a simple, intuitive category navigation carousel that matches the site's design language and provides clear entry points to portfolio content.

**Independent Test**: Can be fully tested by displaying category cards in a carousel format on the homepage, verifying that clicking a category navigates to the portfolio page, and ensuring the visual design matches the site's aesthetic.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they view the "Explore by look" section, **Then** they see a horizontal carousel starting with an "All" card (showing a template image) followed by category cards with single template images and labels
2. **Given** a category card is displayed, **When** the visitor clicks or taps it, **Then** they are navigated to the portfolio page (portfolio page will display that category's images - separate spec)
3. **Given** a visitor is on mobile, **When** they view the category carousel, **Then** they see 2 full category cards + half of a third card (2.5 cards) with category names displayed at the bottom of each card
4. **Given** a visitor is on desktop, **When** they view the category carousel, **Then** they can see 4-5 full category cards with partial visibility of the next card, and can scroll horizontally through them
5. **Given** the "All" card is clicked, **When** the visitor interacts with it, **Then** they are navigated to the portfolio page showing all images (portfolio page display - separate spec)
6. **Given** each category card, **When** the page loads, **Then** it displays a single template image from that category's media items stored in Sanity
7. **Given** a visitor views the portfolio section, **When** the page loads, **Then** they do not see a category filter bar above the carousel (all categories are accessible via the carousel)

---

### User Story 2 - Dynamic Category Card Template Images (Priority: P2)

The system automatically selects a template image for each category card from media items associated with that category in Sanity. When media items are added, updated, or removed in a category, the category card template image can be updated to reflect the current content.

**Why this priority**: This ensures category cards show relevant content from each category, maintaining the Sanity-driven content architecture while using a simpler single-image approach.

**Independent Test**: Can be fully tested by verifying that category cards display a single template image from their associated media items, and that the image updates when media items change in Sanity.

**Acceptance Scenarios**:

1. **Given** a category has media items in Sanity, **When** the homepage loads, **Then** the category card displays a single template image selected from those media items
2. **Given** a category has no media items, **When** the homepage loads, **Then** the category card displays a fallback placeholder image
3. **Given** media items are added to a category in Sanity, **When** the homepage is refreshed, **Then** the category card template image can be updated to reflect new items (if template selection logic is implemented)

---

### User Story 3 - Responsive Category Carousel Navigation (Priority: P3)

A visitor wants to navigate through all available categories. On mobile, they can swipe horizontally through the carousel to see different categories. On desktop, they can use mouse wheel, trackpad gestures, or click-and-drag to scroll. The carousel provides visual indicators (such as partial visibility of adjacent cards) that more categories are available.

**Why this priority**: This ensures the carousel is accessible and intuitive across all device types, maintaining the mobile-first design principle while providing enhanced desktop experience.

**Independent Test**: Can be fully tested by interacting with the carousel on mobile (swipe gestures) and desktop (mouse/trackpad scrolling), verifying smooth navigation and visual feedback.

**Acceptance Scenarios**:

1. **Given** a visitor is on mobile, **When** they swipe left or right on the category carousel, **Then** the carousel scrolls to reveal adjacent categories
2. **Given** a visitor is on desktop, **When** they scroll horizontally (mouse wheel or trackpad), **Then** the carousel scrolls smoothly to reveal more categories
3. **Given** there are more categories than can fit on screen, **When** a visitor views the carousel, **Then** they can see partial visibility of adjacent cards indicating more content is available

---

### Edge Cases

- What happens when a category has no media items for a template image? (Display fallback/placeholder)
- What happens when there are no featured media items for the "All" card template image? (Fall back to most recent media item, or display fallback placeholder if no items exist)
- What happens when a category has no associated media items? (Show empty state or hide category)
- What happens when there are no categories defined? (Show appropriate empty state)
- How does the carousel handle a single category? (Display all cards without scroll when they fit on screen)
- What happens when a category is selected but has no media? (Show "No items in this category" message)
- How does the system handle very long category names? (Truncate with ellipsis or wrap appropriately)
- What happens when media items fail to load for template image? (Display fallback image or placeholder)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace the current DomeGallery (globe-like 3D visualization) with a horizontal carousel-style category selection interface
- **FR-002**: System MUST display category cards in a Pinterest-like carousel layout with horizontal scrolling
- **FR-002a**: System MUST include a separate "All" card as the first card in the carousel to show all media items
- **FR-002b**: The "All" card MUST display a single template image from featured media items across all categories
- **FR-002c**: The "All" card template image MUST be selected from media items marked as featured (isFeatured flag), using the first featured item found. If no featured items exist, fall back to the most recent item
- **FR-003**: Each category card MUST display a single template image selected from that category's media items (from Sanity) and the category name
- **FR-003a**: Category cards MUST use a 4:5 (portrait) aspect ratio for the template image
- **FR-004**: On mobile devices, the carousel MUST display 2 full category cards + half of a third card (2.5 cards visible) to indicate scrollability
- **FR-004a**: On desktop devices, the carousel MUST display 4-5 full category cards with partial visibility of the next card to indicate scrollability
- **FR-005**: Category names MUST be displayed at the bottom of each category card
- **FR-006**: System MUST allow users to navigate to the portfolio page by clicking or tapping a category card
- **FR-006a**: Clicking a category card MUST navigate to the portfolio page (portfolio page display is handled in a separate specification)
- **FR-007**: Clicking the "All" card MUST navigate to the portfolio page showing all images (portfolio page display is handled in a separate specification)
- **FR-008**: System MUST support horizontal scrolling/swiping through category cards on both mobile and desktop
- **FR-008a**: System MUST disable scrolling when all category cards fit within the visible viewport (no scroll needed)
- **FR-009**: Category card template images MUST be selected from media items in that category stored in Sanity
- **FR-009a**: Template image selection MUST prioritize featured images (isFeatured=true), then fall back to most recent image if no featured images are available
- **FR-010**: If a category has no media items, the system MUST display a fallback image or placeholder
- **FR-011**: The template image selection MUST use media items from the category's associated media items in Sanity
- **FR-017**: System MUST NOT display a category filter bar above the carousel (all categories are accessible via the carousel)
- **FR-012**: The carousel design MUST match the site's existing look and feel (editorial, premium aesthetic)
- **FR-013**: The carousel MUST use shadcn/ui components and design patterns
- **FR-014**: System MUST navigate to portfolio page with appropriate category parameter/state when a category card is clicked
- **FR-015**: The carousel MUST be accessible via keyboard navigation (arrow keys, tab navigation)
- **FR-016**: System MUST handle edge cases gracefully (no categories, no template images, empty categories)

### Key Entities *(include if feature involves data)*

- **Category**: Represents a portfolio category (e.g., Bridal, Mehendi, Party). Key attributes: id (unique identifier), label (display name), order (display order), associated media items (from Sanity mediaItem documents)
- **Category Card**: Visual representation of a category in the homepage carousel. Contains a single template image selected from category's media items and category name, clickable to navigate to portfolio page
- **Portfolio Page**: Separate page (handled in different specification) that displays filtered media items based on selected category

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view and select a category from the carousel in under 2 seconds from page load
- **SC-002**: Category carousel displays correctly on mobile devices (2.5 cards visible - 2 full + half) and desktop (4-5 full cards with partial next card visible)
- **SC-003**: 100% of categories with media items display a single template image correctly selected from those items on their cards
- **SC-004**: Users can successfully navigate to the portfolio page by clicking a category card (100% success rate for navigation)
- **SC-005**: The carousel interface loads and becomes interactive within 1 second on standard mobile connections
- **SC-006**: Category card template images can be updated when media items are added or removed from categories in Sanity
- **SC-007**: The new carousel interface maintains visual consistency with the rest of the site (matches existing design system)

## Assumptions

- Category card template images will be selected from media items already stored in Sanity (no new schema fields needed for template images)
- Template image selection prioritizes featured images (isFeatured=true) first, then falls back to most recent image if no featured images are available
- The existing category schema structure (id, label, order) remains unchanged
- Media items in Sanity are already associated with categories via the categories field
- The portfolio page exists and can receive category parameters via URL or state (portfolio page implementation is separate specification)
- The homepage "Explore by look" section currently uses DomeGallery and will be replaced with the category carousel
- Mobile breakpoint is defined as screens under 640px width
- Desktop breakpoint is defined as screens 1024px and above
- The carousel will use existing animation libraries (Framer Motion) already in the project
- Category cards will use shadcn/ui Card component as the base
- Category cards will use a 4:5 (portrait) aspect ratio for template images
- The carousel will replace the DomeGallery component entirely (not coexist)

## Dependencies

- Existing category data structure in Sanity
- Existing media items in Sanity with category associations
- Portfolio page route exists (implementation details in separate specification)
- shadcn/ui component library (Card, ScrollArea components)
- Framer Motion for carousel animations (already in project)
- Next.js Image component for optimized image display
- Next.js navigation (Link or router) for category card clicks

## Out of Scope

- Portfolio page display implementation (bento/masonry grid - separate specification)
- Changes to individual media item display or lightbox functionality on portfolio page
- Category management features in Sanity (using existing category structure)
- Performance optimizations beyond standard Next.js Image optimization
- Analytics tracking for category navigation (can be added later)
- Template image selection algorithm details (implementation detail for planning phase)
