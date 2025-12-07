# Pooja HennArt Portfolio Constitution

## Core Principles

### I. Sanity-Driven Content Architecture (NON-NEGOTIABLE)
All content, media, and configuration must be managed through Sanity CMS. No hard-coded content in components. All data fetching must use centralized GROQ queries in `src/lib/sanity/queries.ts`. Content updates should be possible without code changes. Sanity schemas define the single source of truth for all content types.

### II. Server Components by Default
Use Next.js Server Components as the default. Client Components (`"use client"`) only when necessary for:
- Interactivity (onClick, onChange, form handling)
- Browser APIs (localStorage, window, document)
- React Hooks (useState, useEffect, useContext)
- Third-party libraries requiring client-side execution

All data fetching happens in Server Components. Client Components receive data as props.

### III. Type Safety & TypeScript Strict Mode
All code must be fully typed. No `any` types without explicit justification. Use TypeScript strict mode. Sanity query results must be typed using exported types from queries. Component props must have explicit interfaces. Use Zod schemas for runtime validation (forms, API routes).

### IV. Component Specification Documentation
Every custom component must have a corresponding `.spec.md` file documenting:
- Overview and purpose
- Props with types and descriptions
- Visual design guidelines
- States (default, loading, error, empty)
- Accessibility requirements
- Usage examples
- Constraints and requirements

Specifications are living documents updated when components change.

### V. Theme Tokens Only (No Hard-Coded Styles)
All styling must use Tailwind CSS theme tokens from `globals.css`. No inline styles, no hard-coded colors, no magic numbers. Colors must reference CSS variables (`--background`, `--foreground`, etc.). Support dark/light mode through theme system. Use `cn()` utility for conditional classes.

### VI. Mobile-First Responsive Design
All components must be designed mobile-first. Breakpoints: mobile (default), tablet (640px+), desktop (1024px+). Use responsive Tailwind utilities. Test on actual mobile devices. Touch targets minimum 44x44px. Horizontal scroll areas must be clearly indicated.

### VII. Performance Optimization
- Use Next.js `Image` component for all images (never `<img>`)
- Sanity images must use `SanityImage` wrapper with proper sizing
- Implement `priority` prop for above-the-fold images
- Use `sizes` prop for responsive images
- Lazy load below-the-fold content
- Minimize client-side JavaScript bundles
- Use React Compiler optimizations where applicable

### VIII. Accessibility Standards
- Semantic HTML elements (`<section>`, `<nav>`, `<article>`, etc.)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management in modals and carousels
- Alt text for all images
- Proper heading hierarchy (h1 → h2 → h3)

## Technology Stack Constraints

### Core Stack (Fixed)
- **Framework**: Next.js 16 App Router (no Pages Router)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4 (theme tokens only)
- **CMS**: Sanity 4.x (headless, GROQ queries)
- **UI Base**: shadcn/ui components (extend, don't replace)
- **Forms**: react-hook-form + Zod validation
- **Animations**: Framer Motion (preferred) or CSS transitions

### Font System
- **Sans-serif**: Inter (body text, UI)
- **Serif**: Playfair Display (headings, titles)
- **Serif Alt**: Cormorant Garamond (accents)
- All fonts loaded via `next/font` with proper fallbacks

### Image Handling
- Sanity images: Use `SanityImage` component with `urlFor()` helper
- External images: Configure hostnames in `next.config.ts` `remotePatterns`
- All images: Must use Next.js `Image` component
- Thumbnails: Auto-generate for YouTube videos when not provided

## Component Architecture

### Structure
```
src/components/
  ├── custom/          # Project-specific components
  │   └── ComponentName/
  │       ├── ComponentName.tsx
  │       ├── ComponentName.spec.md
  │       └── index.ts
  ├── ui/              # shadcn/ui base components
  └── providers/       # React context providers
```

### Component Patterns
- **Server Components**: Default, fetch data, pass to Client Components
- **Client Components**: Mark with `"use client"`, handle interactivity
- **Composition**: Prefer composition over configuration
- **Props**: Explicit interfaces, optional props with defaults
- **Styling**: Tailwind classes via `className`, use `cn()` for conditionals

### Data Flow
1. Server Component fetches from Sanity via `get*()` functions
2. Data transformed to component-friendly types
3. Passed as props to Client Components
4. Client Components handle presentation and interactivity

## Development Workflow

### Code Quality
- ESLint: Next.js core-web-vitals + TypeScript rules
- Type checking: `tsc --noEmit` must pass
- No console.logs in production code (use proper logging)
- Meaningful variable and function names
- Comments for complex logic only

### Git Workflow
- Feature branches from `main`
- Descriptive commit messages
- PRs require review before merge
- Update component specs when components change

## Design System

### Visual Style
- **Aesthetic**: Editorial, premium, minimal
- **Typography**: Serif for headings, sans-serif for body
- **Spacing**: Consistent spacing scale (Tailwind defaults)
- **Borders**: Subtle, use theme border colors
- **Shadows**: Minimal, use theme shadow utilities

### Color Usage
- Background: `bg-background`
- Text: `text-foreground`
- Muted text: `text-muted-foreground`
- Borders: `border-border`
- Accents: Use theme accent colors sparingly

### Animation Guidelines
- Subtle, purposeful animations only
- Respect `prefers-reduced-motion`
- Use Framer Motion for complex animations
- CSS transitions for simple state changes
- Performance: 60fps target

## Sanity Integration

### Query Organization
- All GROQ queries in `src/lib/sanity/queries.ts`
- Use query fragments for reusable projections
- Export typed results for component usage
- Handle null/undefined gracefully

### Schema Management
- Schemas defined in `sanity/schemas/`
- Schema changes require migration plan
- Document schema decisions in code comments

### Image Optimization
- Use `urlFor()` helper for all Sanity images
- Specify width/height for performance
- Quality: 90 for hero images, 80 for thumbnails
- Responsive sizes via `sizes` prop

## Performance Standards

### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Requirements
- Code splitting: Automatic via Next.js
- Image optimization: All images via Next.js Image
- Font loading: Optimize with `next/font`
- Bundle size: Monitor and minimize client JS
- Lazy loading: Below-fold components and images

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance
- Color contrast: Minimum 4.5:1 for text
- Keyboard navigation: All interactive elements
- Focus indicators: Visible on all focusable elements
- ARIA: Use when semantic HTML insufficient

## Governance

### Constitution Authority
This constitution supersedes all other development practices and style guides. All code must comply with these principles.

### Amendment Process
New principles can be added to this constitution following this process:
1. Document rationale for the new principle
2. Review impact on existing codebase
3. Add principle to appropriate section (Core Principles, Design System, etc.)
4. Update constitution with version number and amendment date
5. Update affected components/specs if needed

Principles should follow the same format: numbered/lettered, clear title, detailed description with bullet points or structured content.

### Compliance Verification
- Code reviews must verify constitution compliance
- New components must include `.spec.md` files
- Type errors must be resolved before merge
- Performance regressions must be addressed
- Accessibility issues are blockers
- All principles must be followed; new principles added via amendment process

### Exceptions
Exceptions to principles require:
- Written justification
- Team approval
- Documentation in code comments
- Update to this constitution if permanent

---

**Note**: This constitution is a living document. Additional principles can be added following the Amendment Process outlined above. All principles should be documented in the same structured format for consistency.

**Version**: 1.0.1 | **Ratified**: 2025-01-06 | **Last Amended**: 2025-01-06
