# Implementation Tasks: Bento Portfolio Page

**Feature**: 002-bento-portfolio  
**Date**: 2025-01-06  
**Status**: In Progress

## Phase 0: Setup

- [X] **TASK-001**: Verify project setup and dependencies (Framer Motion, Next.js Image, Tailwind CSS)
- [X] **TASK-002**: Update MediaItem type to include `isFeatured` and `order` fields
- [X] **TASK-003**: Update getMediaItems query to return `isFeatured` and `order` in transformed MediaItem

## Phase 1: Core Components

- [X] **TASK-004**: Create `src/lib/utils/bento-layout.ts` - Algorithmic size assignment utility
- [X] **TASK-005**: Create `src/components/custom/BentoGrid/BentoGridItem.tsx` - Individual grid item component with animations
- [X] **TASK-006**: Create `src/components/custom/BentoGrid/BentoGrid.tsx` - Main bento grid component with infinite scroll
- [X] **TASK-007**: Create `src/components/custom/BentoGrid/index.ts` - Component exports
- [X] **TASK-008**: Create `src/components/custom/BentoGrid/BentoGrid.spec.md` - Component specification

## Phase 2: Integration

- [X] **TASK-009**: Update `src/app/portfolio/page.tsx` - Handle URL searchParams.category for server-side filtering
- [X] **TASK-010**: Update `src/app/portfolio/PortfolioClient.tsx` - Replace DomeGallery with BentoGrid, integrate URL-based filtering

## Phase 3: Polish & Validation

- [ ] **TASK-011**: Test category filtering via URL parameters
- [ ] **TASK-012**: Test infinite scroll functionality
- [ ] **TASK-013**: Test animations and reduced motion preferences
- [ ] **TASK-014**: Test responsive layout (mobile/tablet/desktop)
- [ ] **TASK-015**: Verify performance targets (LCP, FPS, CLS)

---

## Task Details

### TASK-001: Verify project setup and dependencies
**File**: `package.json`  
**Action**: Verify Framer Motion, Next.js Image, Tailwind CSS are installed  
**Dependencies**: None

### TASK-002: Update MediaItem type
**File**: `src/lib/types/media.ts`  
**Action**: Add `isFeatured?: boolean` and `order?: number` fields to MediaItem type  
**Dependencies**: None

### TASK-003: Update getMediaItems query
**File**: `src/lib/sanity/queries.ts`  
**Action**: Include `isFeatured` and `order` in the transformed MediaItem return  
**Dependencies**: TASK-002

### TASK-004: Create bento-layout utility
**File**: `src/lib/utils/bento-layout.ts`  
**Action**: Create utility function that assigns grid sizes based on featured status and order  
**Algorithm**: Featured items → 2x2, Regular even order → 1x1, Regular odd order → 2x1  
**Dependencies**: TASK-002

### TASK-005: Create BentoGridItem component
**File**: `src/components/custom/BentoGrid/BentoGridItem.tsx`  
**Action**: Create component with Framer Motion animations (fade-in, scale-up), Next.js Image, respects prefers-reduced-motion  
**Dependencies**: TASK-004

### TASK-006: Create BentoGrid component
**File**: `src/components/custom/BentoGrid/BentoGrid.tsx`  
**Action**: Create main grid component with CSS Grid layout, infinite scroll (Intersection Observer), size assignment  
**Dependencies**: TASK-004, TASK-005

### TASK-007: Create BentoGrid index exports
**File**: `src/components/custom/BentoGrid/index.ts`  
**Action**: Export BentoGrid and BentoGridItem components  
**Dependencies**: TASK-005, TASK-006

### TASK-008: Create BentoGrid specification
**File**: `src/components/custom/BentoGrid/BentoGrid.spec.md`  
**Action**: Document component props, behavior, and usage  
**Dependencies**: TASK-006

### TASK-009: Update portfolio page (Server Component)
**File**: `src/app/portfolio/page.tsx`  
**Action**: Read searchParams.category, filter media items server-side, pass to PortfolioClient  
**Dependencies**: TASK-003

### TASK-010: Update PortfolioClient
**File**: `src/app/portfolio/PortfolioClient.tsx`  
**Action**: Replace DomeGallery with BentoGrid, integrate CategoryFilterBar with URL sync via useSearchParams  
**Dependencies**: TASK-006, TASK-009

### TASK-011: Test category filtering
**Action**: Manual testing - verify URL parameters filter content correctly, filter bar updates URL  
**Dependencies**: TASK-010

### TASK-012: Test infinite scroll
**Action**: Manual testing - verify scroll triggers load more, animations work smoothly  
**Dependencies**: TASK-010

### TASK-013: Test animations
**Action**: Manual testing - verify animations respect prefers-reduced-motion, 60fps maintained  
**Dependencies**: TASK-010

### TASK-014: Test responsive layout
**Action**: Manual testing - verify layout works on mobile/tablet/desktop breakpoints  
**Dependencies**: TASK-010

### TASK-015: Verify performance
**Action**: Performance testing - verify LCP < 2.5s, 60fps, CLS < 0.1  
**Dependencies**: TASK-010
