# AboutPoojaSection Component Specification

## Overview
A section displaying information about Pooja. Features an image and short bio (2-3 lines). Highlights expertise and experience. Minimal, editorial style.

## Props
- `image` (string, optional): URL or path to Pooja's image
- `name` (string, required): Name to display
- `bio` (string, required): Short bio text (2-3 lines)
- `expertise` (string[], optional): Array of expertise areas (e.g., ["Bridal Makeup", "Mehendi", "Party Makeup"])

## Visual Design
- Split layout: Image on one side, text on the other
- Mobile: Stacked (image top, text bottom)
- Desktop: Side-by-side
- Large, readable typography
- Minimal styling, premium feel

## States
- Default: Shows image and bio
- Loading: Skeleton state

## Accessibility
- Semantic `<section>` with proper heading
- Alt text for image
- Proper text hierarchy

## Usage
```tsx
<AboutPoojaSection 
  image="/images/pooja.jpg"
  name="Pooja HennArt"
  bio="Professional bridal makeup and mehendi artist with over 10 years of experience..."
  expertise={["Bridal Makeup", "Mehendi", "Party Makeup"]}
/>
```

## Constraints
- Must use theme tokens only
- Mobile-first responsive
- No inline styles

