# Implementation Plan: Simplify Portfolio Category Selection

**Branch**: `001-simplify-portfolio` | **Date**: 2025-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-simplify-portfolio/spec.md`

## Summary

Replace the current DomeGallery (3D globe visualization) on the homepage "Explore by look" section with a horizontal Pinterest-style category carousel. Each category card displays a single template image selected from that category's media items in Sanity, with category name at the bottom. Cards navigate to the portfolio page when clicked. The carousel supports mobile (2.5 cards visible - 2 full + half) and desktop (4-5 cards with partial next card) with fast, responsive feedback. Design follows shadcn/ui principles with full dark/light theme support, maintaining the artistic, editorial aesthetic of the site.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode), React 19.2.0, Next.js 16.0.5  
**Primary Dependencies**: 
- Framer Motion 12.23.24 (carousel animations)
- shadcn/ui components (Card, ScrollArea, AspectRatio)
- Next.js Image (optimized image display)
- next-sanity 11.6.10 (Sanity integration)
- Tailwind CSS 4 (styling with theme tokens)

**Storage**: Sanity CMS (headless CMS for categories and media items)  
**Testing**: Manual testing (no automated tests per project requirements)  
**Target Platform**: Web (Next.js App Router), responsive (mobile-first)  
**Project Type**: Web application (Next.js frontend)  
**Performance Goals**: 
- Carousel loads and becomes interactive within 1 second on standard mobile connections
- Category selection/navigation responds within 100ms (fast responsive feedback)
- 60fps animations for smooth carousel scrolling
- LCP < 2.5s for category cards

**Constraints**: 
- Must use theme tokens only (no hard-coded colors)
- Must support dark/light mode via theme system
- Mobile-first responsive design (2.5 cards on mobile, 4-5 on desktop)
- Must use Server Components by default, Client Components only for interactivity
- All images via Next.js Image component with proper optimization
- Template image selection must be performant (prioritize featured, then recent)

**Scale/Scope**: 
- Homepage section replacement (single component)
- Category carousel component (~200-300 LOC)
- Template image selection utility (~50-100 LOC)
- Sanity query updates (extend existing queries)
- No schema changes needed (use existing category/mediaItem structure)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check ✅

- ✅ **Sanity-Driven Content**: All data from Sanity CMS via GROQ queries
- ✅ **Server Components**: Data fetching in Server Component, passed to Client Component
- ✅ **Type Safety**: Full TypeScript with strict mode, typed Sanity queries
- ✅ **Component Specs**: Will create `.spec.md` for CategoryCarousel component
- ✅ **Theme Tokens**: Using Tailwind theme tokens, no hard-coded colors
- ✅ **Mobile-First**: 2.5 cards mobile, responsive breakpoints
- ✅ **Performance**: Next.js Image, lazy loading, optimized queries
- ✅ **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

**Status**: All constitution principles satisfied. No violations detected.

### Post-Design Check

*To be re-evaluated after Phase 1 design artifacts are complete*

## Project Structure

### Documentation (this feature)

```text
specs/001-simplify-portfolio/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A (no API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (site)/
│       └── HomeClient.tsx                    # Update: Replace DomeGallery with CategoryCarousel, remove CategoryFilterBar
├── components/
│   ├── custom/
│   │   ├── CategoryCarousel/                  # NEW: Main carousel component
│   │   │   ├── CategoryCarousel.tsx
│   │   │   ├── CategoryCarousel.spec.md
│   │   │   ├── CategoryCard.tsx                # NEW: Individual category card
│   │   │   └── index.ts
│   │   └── [existing components unchanged]
│   └── ui/                                    # Existing shadcn/ui components
│       ├── card.tsx                           # Used by CategoryCard
│       └── aspect-ratio.tsx                   # Used for card images
├── lib/
│   ├── sanity/
│   │   ├── queries.ts                         # UPDATE: Add template image selection helpers
│   │   └── image.ts                           # Existing: urlFor helper
│   └── utils/
│       ├── template-image.ts                  # NEW: Template image selection utilities
│       └── cn.ts                              # Existing: className utility
└── types/
    └── category.ts                            # UPDATE: Update CategoryCard type (single image, not collage)
```

**Structure Decision**: Single Next.js application structure. New components in `src/components/custom/CategoryCarousel/`. Template image selection utilities in `src/lib/utils/template-image.ts`. Updates to existing HomeClient component and Sanity queries.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All implementation follows constitution principles.

---

## Phase 0: Research ✅

**Status**: Complete

All technical unknowns resolved in `research.md`:
- Template image selection approach: Prioritize featured images, fallback to most recent
- Carousel pattern: Framer Motion for drag/swipe, responsive card width calculation
- Fast feedback: CSS transitions for instant hover feedback (<16ms), Framer Motion for animations
- Theme support: Theme tokens exclusively for dark/light mode
- Mobile layout: Fixed card width calculation for 2.5-card mobile layout (2 full + half)
- Desktop layout: 4-5 cards with partial next card visibility
- Scroll behavior: Disable scrolling when all cards fit on screen

**Research File**: `specs/001-simplify-portfolio/research.md`

---

## Phase 1: Design & Contracts ✅

**Status**: Complete

### Data Model

**File**: `specs/001-simplify-portfolio/data-model.md`

**Entities Defined**:
- `Category`: Sanity category document (id, label, order)
- `MediaItem`: Sanity media item document (with categories, isFeatured)
- `CategoryCard`: Frontend entity for category cards with single template image
- `AllCard`: Frontend entity for "All" card with single template image

**Key Relationships**:
- Categories have many MediaItems (via categories array)
- CategoryCards reference Category and contain 1 MediaItem for template image
- AllCard contains 1 featured MediaItem from all categories

### Contracts

**File**: `specs/001-simplify-portfolio/contracts/README.md`

**Component Contracts**:
- `CategoryCarousel` props interface defined
- `CategoryCard` props interface defined
- Navigation contract: `/portfolio?category={id}`

**Data Contracts**:
- Sanity query return types defined
- Helper functions needed: `selectTemplateImage()`, `selectAllCardImage()`

### Quick Start Guide

**File**: `specs/001-simplify-portfolio/quickstart.md`

**Key Implementation Steps**:
1. Update CategoryCard to display single template image (not collage)
2. Update CategoryCarousel for 2.5 cards mobile, 4-5 cards desktop
3. Create template image selection utility
4. Update Sanity queries if needed
5. Update HomeClient component (remove CategoryFilterBar, update carousel)
6. Update component specification

### Agent Context Updated

**File**: `.cursor/rules/specify-rules.mdc`

Updated with:
- TypeScript 5+ (strict mode), React 19.2.0, Next.js 16.0.5
- Sanity CMS integration
- Web application structure

---

## Phase 1: Constitution Check (Post-Design) ✅

*Re-evaluated after Phase 1 design artifacts*

- ✅ **Sanity-Driven Content**: All data from Sanity via GROQ queries (queries defined)
- ✅ **Server Components**: Data fetching in Server Component, passed to Client Component (pattern defined)
- ✅ **Type Safety**: Full TypeScript interfaces defined for all entities
- ✅ **Component Specs**: Will create `.spec.md` for CategoryCarousel (documented in quickstart)
- ✅ **Theme Tokens**: All styling via theme tokens (design approach defined)
- ✅ **Mobile-First**: 2.5 cards mobile layout defined with responsive breakpoints
- ✅ **Performance**: Next.js Image, lazy loading, optimized queries (approach defined)
- ✅ **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation (requirements defined)

**Status**: All constitution principles satisfied. Design artifacts comply with all principles.

---

## Implementation Details

### Component Architecture

**CategoryCarousel** (Client Component):
- Uses Framer Motion for carousel animations and drag/swipe
- Calculates card width dynamically for mobile (2.5 cards) and desktop (4-5 cards)
- Handles swipe gestures (mobile) and scroll (desktop)
- Manages keyboard navigation
- Fast hover/active feedback via CSS transitions
- Disables scrolling when all cards fit on screen

**CategoryCard** (Client Component):
- Uses shadcn/ui Card component as base
- Displays single template image with 4:5 aspect ratio
- Category name overlay at bottom
- Theme-aware styling (dark/light mode)
- Navigation on click/tap

**Template Image Selection** (Utility):
- Selects 1 image from category's media items
- Prioritizes featured items (isFeatured=true)
- Falls back to most recent if no featured items
- Handles fallback for empty categories
- Generates "All" card image from first featured item across all categories

### Design Considerations

**Artistic Aesthetic**:
- Editorial, premium feel
- Subtle gradients and overlays (theme-aware)
- Elegant shadows and spacing
- Smooth transitions and animations

**Fast Responsive Feedback**:
- CSS transitions for hover states (<16ms)
- CSS transitions for active/pressed states (<50ms)
- Framer Motion for carousel scroll (60fps)
- Optimized image loading (priority for visible cards)

**shadcn/ui Integration**:
- Card component for category cards
- AspectRatio for image containers
- All components use theme tokens

**Theme Support**:
- All colors via theme tokens (bg-card, text-foreground, etc.)
- Overlays use opacity with theme colors (bg-background/XX)
- Shadows and borders use theme utilities
- Works seamlessly in dark and light modes

---

## Next Steps

**Ready for**: `/speckit.tasks` - Break down implementation into actionable tasks

**Key Implementation Areas**:
1. Update CategoryCard component (single image instead of collage)
2. Update CategoryCarousel component (2.5 cards mobile, 4-5 desktop)
3. Create template image selection utility
4. Update HomeClient (remove CategoryFilterBar, update carousel integration)
5. Update component specification documentation
