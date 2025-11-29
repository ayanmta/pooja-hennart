# HeroSection Component Specification

## Overview
A full-screen editorial hero section for the homepage. Premium, cinematic, inspired by evagher.com style. Uses large typography, full-screen imagery, and minimal text.

## Props
- `title` (string, required): Main heading text (e.g., "POOJA")
- `subtitle` (string, optional): Subheading text below the title (e.g., "HennArt & Makeover")
- `backgroundImage` (string, optional): URL or path to full-screen background image
- `scrollCue` (boolean, optional): Show scroll indicator. Default: true

## Visual Design
- Full viewport height (100vh) on mobile and desktop
- Large, bold typography (text-6xl to text-9xl)
- Centered content with vertical alignment
- Dark overlay on background image for text readability
- Smooth scroll indicator at bottom (if enabled)

## States
- Default: Shows title, subtitle, and background image
- Loading: Skeleton state (if image is loading)
- Error: Fallback to solid background color

## Accessibility
- Semantic `<section>` with `role="banner"`
- Proper heading hierarchy (h1 for title)
- ARIA labels for scroll indicator
- Keyboard accessible

## Usage
```tsx
<HeroSection 
  title="POOJA"
  subtitle="HennArt & Makeover"
  backgroundImage="/images/hero-bridal.jpg"
  scrollCue={true}
/>
```

## Constraints
- Must use theme tokens only (no inline styles)
- Must support dark/light mode
- Mobile-first responsive design
- No hard-coded colors
