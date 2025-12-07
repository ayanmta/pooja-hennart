# Implementation Plan: Bento Portfolio Page

**Branch**: `002-bento-portfolio` | **Date**: 2025-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-bento-portfolio/spec.md`

## Summary

Replace the existing DomeGallery portfolio page with a visually appealing bento-style grid layout. The new portfolio page displays media items in a Japanese bento box-inspired grid with varying image sizes, algorithmic size assignment based on featured status and order, infinite scroll for large collections, category filtering via URL parameters and filter bar UI, and subtle animations. The implementation follows all constitution principles: Sanity-driven content, Server Components by default, theme tokens, mobile-first responsive design, and accessibility standards.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode), React 19.2.0, Next.js 16.0.5  
**Primary Dependencies**: 
- Framer Motion 12.23.24 (animations and infinite scroll)
- shadcn/ui components (Button, Card, ScrollArea if needed)
- Next.js Image (optimized image display)
- next-sanity 11.6.10 (Sanity integration)
- Tailwind CSS 4 (styling with theme tokens)

**Storage**: Sanity CMS (headless CMS for media items and categories)  
**Testing**: Manual testing (no automated tests per project requirements)  
**Target Platform**: Web (Next.js App Router), responsive (mobile-first)  
**Project Type**: Web application (Next.js frontend)  
**Performance Goals**: 
- LCP < 2.5s (page load within 2 seconds)
- 60fps animations during scrolling
- CLS < 0.1 (no layout shifts)
- Infinite scroll loads smoothly without jank

**Constraints**: 
- Must use theme tokens only (no hard-coded colors)
- Must support dark/light mode via theme system
- Mobile-first responsive design (1-2 columns mobile, multiple columns desktop)
- Must use Server Components by default, Client Components only for interactivity
- All images via Next.js Image component with proper optimization
- Bento grid uses algorithmic size assignment (featured images get larger sizes)
- Infinite scroll implementation must be performant
- Category filtering via URL query parameters for shareability

**Scale/Scope**: 
- Single portfolio page replacement (`/portfolio` route)
- Bento grid component (~300-400 LOC)
- Category filter bar integration (reuse existing CategoryFilterBar or create new)
- Infinite scroll implementation (~100-150 LOC)
- Animation wrapper components (~100 LOC)
- No schema changes needed (use existing category/mediaItem structure)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check ✅

- ✅ **Sanity-Driven Content**: All data from Sanity CMS via GROQ queries (`getMediaItems()`, `getCategories()`)
- ✅ **Server Components**: Data fetching in Server Component (`page.tsx`), passed to Client Component
- ✅ **Type Safety**: Full TypeScript with strict mode, typed Sanity queries
- ✅ **Component Specs**: Will create `.spec.md` for BentoGrid component
- ✅ **Theme Tokens**: Using Tailwind theme tokens, no hard-coded colors
- ✅ **Mobile-First**: 1-2 columns mobile, responsive breakpoints
- ✅ **Performance**: Next.js Image, lazy loading, optimized queries
- ✅ **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

**Status**: All constitution principles satisfied. No violations detected.

### Post-Design Check

*To be re-evaluated after Phase 1 design artifacts are complete*

## Project Structure

### Documentation (this feature)

```text
specs/002-bento-portfolio/
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
│   └── portfolio/
│       ├── page.tsx                     # UPDATE: Server Component - fetch data, handle URL params
│       └── PortfolioClient.tsx           # REPLACE: New client component with bento grid
├── components/
│   ├── custom/
│   │   ├── BentoGrid/                    # NEW: Main bento grid component
│   │   │   ├── BentoGrid.tsx
│   │   │   ├── BentoGrid.spec.md
│   │   │   ├── BentoGridItem.tsx         # NEW: Individual grid item with animation
│   │   │   └── index.ts
│   │   ├── CategoryFilterBar/            # EXISTING: Reuse for filter bar on portfolio page
│   │   └── MediaLightbox/                # EXISTING: Reuse for image viewing
│   └── ui/                               # Existing shadcn/ui components
├── lib/
│   ├── sanity/
│   │   └── queries.ts                    # EXISTING: Use getMediaItems(), getCategories()
│   └── utils/
│       ├── bento-layout.ts               # NEW: Algorithmic size assignment utility
│       └── infinite-scroll.ts            # NEW: Infinite scroll hook/utility
└── types/
    └── media.ts                          # EXISTING: MediaItem type
```

**Structure Decision**: Single Next.js application structure. New components in `src/components/custom/BentoGrid/`. Utilities for bento layout algorithm and infinite scroll in `src/lib/utils/`. Updates to existing portfolio page route.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All implementation follows constitution principles.

---

## Phase 0: Research ✅

**Status**: Complete

All technical unknowns resolved in `research.md`:
- Bento grid layout algorithm: Algorithmic size assignment (assign sizes based on order/featured status, then arrange in grid)
- Infinite scroll implementation: Intersection Observer API with Framer Motion for smooth loading
- Animation approach: Framer Motion with fade-in and scale-up, respecting prefers-reduced-motion
- Category filtering: URL query parameters with Next.js useSearchParams, filter bar UI for user interaction
- Image aspect ratio handling: object-fit cover to maintain ratios while filling grid cells

**Research File**: `specs/002-bento-portfolio/research.md`

---

## Phase 1: Design & Contracts ✅

**Status**: Complete

### Data Model

**File**: `specs/002-bento-portfolio/data-model.md`

**Entities Defined**:
- `MediaItem`: Sanity media item document (existing, reused)
- `Category`: Sanity category document (existing, reused)
- `BentoGridItem`: Frontend entity for grid items with size assignment
- `CategoryFilterState`: Filter state with URL synchronization

**Key Relationships**:
- MediaItem belongs to zero or more Categories
- BentoGridItem wraps MediaItem with size metadata
- CategoryFilterState manages active filter and URL sync

### Component Contracts

**File**: `specs/002-bento-portfolio/contracts/README.md`

**Component Interfaces**:
- `BentoGrid`: Props for media items, category filter, infinite scroll configuration
- `BentoGridItem`: Props for individual item with size, animation configuration
- `PortfolioClient`: Props for media items, categories, URL search params

**Data Contracts**:
- Sanity queries return typed MediaItem[] and Category[]
- URL query parameters: `?category=bridal` for filtering
- Infinite scroll: Loads next batch when scroll threshold reached

### Quickstart

**File**: `specs/002-bento-portfolio/quickstart.md`

**Implementation Steps**:
1. Create BentoGrid component with algorithmic size assignment
2. Implement infinite scroll with Intersection Observer
3. Add category filter bar integration
4. Implement subtle animations with Framer Motion
5. Replace PortfolioClient with new bento grid implementation
6. Update portfolio page to handle URL query parameters

**Testing Checklist**:
- Category filtering via URL works correctly
- Filter bar updates URL and grid
- Infinite scroll loads more images smoothly
- Animations respect prefers-reduced-motion
- Responsive layout works on mobile/tablet/desktop
- Performance targets met (LCP < 2.5s, 60fps, CLS < 0.1)

---

## Phase 2: Tasks

**Status**: Pending `/speckit.tasks` command

Tasks will be generated by `/speckit.tasks` command based on this plan and the feature specification.

---

## Notes

- Existing `CategoryFilterBar` component can be reused for filter UI on portfolio page
- Existing `MediaLightbox` component can be reused for image viewing
- Bento grid size assignment algorithm: Featured images get larger sizes (e.g., 2x2 grid cells), regular images get smaller sizes (e.g., 1x1 or 1x2 cells)
- Infinite scroll threshold: Load next batch when user scrolls within 200px of bottom
- Animation timing: Fade-in 300ms, scale-up 200ms, staggered delay 50ms per item
