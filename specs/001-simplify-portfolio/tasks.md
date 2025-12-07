# Tasks: Simplify Portfolio Category Selection

**Input**: Design documents from `/specs/001-simplify-portfolio/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No automated tests per project constitution (testing removed from requirements).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create template image selection utility file at `src/lib/utils/template-image.ts`
- [x] T002 [P] Update type definitions for CategoryCard and AllCard entities in `src/lib/types/category.ts` to use single template image instead of collage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create template image selection utility functions in `src/lib/utils/template-image.ts`:
  - `selectTemplateImage(mediaItems: MediaItem[]): MediaItem | null` - Selects single template image (prioritize featured, fallback to most recent)
  - `selectAllCardImage(allMedia: MediaItem[]): MediaItem | null` - Selects first featured item for "All" card (fallback to most recent)
  - Handle edge cases: empty arrays, no featured items, no items at all

- [x] T004 Update CategoryCard type definition in `src/lib/types/category.ts`:
  - Change `collageImages: CollageImage[]` to `templateImage: CollageImage` (single image)
  - Update AllCard type: Change `collageImages: CollageImage[]` to `templateImage: CollageImage`
  - Ensure types match new single-image approach

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Navigate to Portfolio by Category (Priority: P1) 🎯 MVP

**Goal**: Replace DomeGallery with horizontal category carousel that navigates to portfolio page on click, displaying single template images per category card

**Independent Test**: Display category cards in carousel format on homepage, verify clicking navigates to portfolio page, ensure visual design matches site aesthetic, verify 2.5 cards visible on mobile and 4-5 cards on desktop.

### Implementation for User Story 1

- [x] T005 [US1] Update CategoryCard component at `src/components/custom/CategoryCarousel/CategoryCard.tsx`:
  - Replace collage layout (CSS Grid with multiple images) with single template image display
  - Use 4:5 aspect ratio for template image (AspectRatio component)
  - Display single template image using Next.js Image component
  - Show category name overlay at bottom with gradient background
  - Implement hover/active states with CSS transitions (<16ms feedback)
  - Support dark/light theme via theme tokens
  - Handle click navigation via Link component

- [x] T006 [US1] Update CategoryCarousel component at `src/components/custom/CategoryCarousel/CategoryCarousel.tsx`:
  - Update card width calculation for mobile: Calculate to show 2.5 cards (2 full + half of third)
  - Update desktop layout: Show 4-5 full cards with partial visibility of next card
  - Add logic to disable scrolling when all cards fit within viewport (check total width vs container width)
  - Ensure Framer Motion drag/swipe works correctly
  - Ensure keyboard navigation (arrow keys) works
  - Display "All" card as first card
  - Display category cards in horizontal layout

- [x] T007 [US1] Update HomeClient component at `src/app/(site)/HomeClient.tsx`:
  - Remove CategoryFilterBar import and usage
  - Update CategoryCarousel integration to use template image selection utility
  - Transform Sanity categories to CategoryCard entities using `selectTemplateImage()` for each category
  - Generate "All" card entity using `selectAllCardImage()` for template image
  - Pass updated CategoryCard entities (with single template image) to CategoryCarousel
  - Remove any collage-related transformation logic

- [x] T008 [US1] Update component specification at `src/components/custom/CategoryCarousel/CategoryCarousel.spec.md`:
  - Update documentation to reflect single template image approach (not collage)
  - Update mobile layout description (2.5 cards instead of 3)
  - Update desktop layout description (4-5 cards with partial next)
  - Update props documentation for single template image
  - Update visual design guidelines for 4:5 aspect ratio

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can view category carousel on homepage with single template images, navigate to portfolio page by clicking category cards, and see correct card visibility on mobile (2.5 cards) and desktop (4-5 cards).

---

## Phase 4: User Story 2 - Dynamic Category Card Template Images (Priority: P2)

**Goal**: Ensure template images are automatically selected from category's media items, prioritizing featured items

**Independent Test**: Verify category cards display single template image from their associated media items, and that featured items are prioritized over non-featured items.

### Implementation for User Story 2

- [x] T009 [US2] Enhance template image selection utility in `src/lib/utils/template-image.ts`:
  - Ensure `selectTemplateImage()` prioritizes featured items (`isFeatured === true`) first
  - Fall back to most recent item (by order or _createdAt) if no featured items
  - Handle edge case: category with no media items (return null for fallback)
  - Ensure proper type handling for MediaItem with isFeatured flag

- [x] T010 [US2] Update HomeClient data transformation logic:
  - Ensure template image selection uses `selectTemplateImage()` for each category
  - Verify "All" card uses `selectAllCardImage()` (first featured item)
  - Add fallback placeholder logic for categories with no media items
  - Ensure template images update when media items change in Sanity (data refresh)

- [x] T011 [US2] Add fallback placeholder display in CategoryCard component:
  - Display gradient background with category name when no template image available
  - Use theme tokens for gradient colors (dark/light mode support)
  - Ensure placeholder still allows navigation
  - Maintain 4:5 aspect ratio for placeholder

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Category cards automatically display single template images from Sanity media items with proper prioritization (featured first, then recent), with proper fallbacks.

---

## Phase 5: User Story 3 - Responsive Category Carousel Navigation (Priority: P3)

**Goal**: Ensure carousel is accessible and intuitive across all device types with smooth navigation

**Independent Test**: Interact with carousel on mobile (swipe gestures) and desktop (mouse/trackpad scrolling), verify smooth navigation and visual feedback, verify scroll is disabled when all cards fit.

### Implementation for User Story 3

- [x] T012 [US3] Enhance CategoryCarousel mobile swipe gestures:
  - Ensure swipe left/right scrolls carousel smoothly
  - Add momentum scrolling for natural feel
  - Prevent vertical scroll interference during horizontal swipe
  - Add visual feedback during swipe (partial card visibility maintained)

- [x] T013 [US3] Enhance CategoryCarousel desktop scrolling:
  - Support mouse wheel horizontal scrolling
  - Support trackpad horizontal scroll gestures
  - Support click-and-drag scrolling
  - Add smooth scroll animations (60fps target)
  - Show partial visibility of adjacent cards to indicate more content

- [x] T014 [US3] Enhance keyboard navigation:
  - Arrow keys (left/right) scroll carousel
  - Tab navigation focuses category cards
  - Enter/Space activates focused card
  - Ensure focus indicators are visible (theme-aware)

- [x] T015 [US3] Implement scroll disable logic:
  - Calculate total carousel width vs container width
  - Disable drag/scroll when all cards fit on screen
  - Ensure cards are still clickable when scroll is disabled
  - Update drag constraints dynamically based on content width

- [x] T016 [US3] Add visual indicators for scrollable content:
  - Show partial visibility of next/previous cards when scrollable
  - Add subtle fade/gradient at edges (theme-aware)
  - Ensure indicators work in both dark and light modes
  - Hide indicators when scroll is disabled

**Checkpoint**: All user stories should now be independently functional. Carousel provides smooth, intuitive navigation across all device types with proper scroll behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 [P] Performance optimization:
  - Ensure Next.js Image components use proper `sizes` prop for responsive images
  - Add `priority` prop to visible category cards (above fold)
  - Lazy load below-fold cards
  - Optimize template image loading (preload visible cards)

- [x] T018 [P] Accessibility enhancements:
  - Add ARIA labels to carousel container
  - Add ARIA labels to category cards
  - Ensure proper heading hierarchy
  - Add keyboard navigation announcements (if needed)
  - Test with screen reader (manual testing)

- [x] T019 [P] Theme consistency:
  - Verify all colors use theme tokens (no hard-coded colors)
  - Test dark mode thoroughly
  - Test light mode thoroughly
  - Ensure gradients and overlays work in both themes

- [x] T020 [P] Responsive design validation:
  - Test mobile layout (2.5 cards visible - 2 full + half)
  - Test tablet layout (responsive breakpoints)
  - Test desktop layout (4-5 cards with partial next card)
  - Verify touch targets are minimum 44x44px
  - Test on actual mobile devices if possible

- [x] T021 [P] Edge case handling:
  - Test with no categories (empty state)
  - Test with single category (no scroll needed)
  - Test with categories having no media items (fallback display)
  - Test with very long category names (truncation/wrapping)
  - Test image load failures (Next.js Image error handling)
  - Test scroll disable when all cards fit

- [x] T022 [P] Code cleanup and refactoring:
  - Remove unused collage utility functions if not used elsewhere
  - Remove CategoryFilterBar import if completely removed
  - Ensure all components follow constitution principles
  - Add comments for complex logic only
  - Verify no console.logs in production code

- [x] T023 [P] Run quickstart.md validation:
  - Verify all implementation steps from quickstart.md are complete
  - Test all scenarios from quickstart.md testing checklist
  - Ensure component specification is complete and accurate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 template image selection
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 carousel navigation

### Within Each User Story

- Component updates before integration
- Core implementation before enhancements
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Polish tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 (can start after US1 CategoryCard basics)
   - Developer C: User Story 3 (can start after US1 carousel basics)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Follow constitution principles: Server Components by default, theme tokens only, mobile-first, accessibility standards
- Note: Components already exist from previous implementation - tasks focus on updating for new requirements (single template image, 2.5 cards mobile, 4-5 desktop, remove CategoryFilterBar)
