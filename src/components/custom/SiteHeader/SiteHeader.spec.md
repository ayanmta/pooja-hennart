# SiteHeader Component Specification

## Overview
Site header with overlay variant (for hero) and solid variant (for inner pages). Includes logo, language toggle, and mobile menu.

## Props
- `variant` ("overlay" | "solid"): Visual style variant
- `logoText` (string, optional): Logo text to display
- `showLanguageToggle` (boolean, optional): Show language toggle button
- `currentLanguage` (string, optional): Current language code
- `onLanguageChange` (function, optional): Language change handler

## Visual Design
- Overlay: Transparent background, white text, positioned absolutely over hero
- Solid: Background color, standard text, fixed position
- Mobile: Hamburger menu (Sheet component)
- Desktop: Horizontal navigation

## States
- Default: Shows logo and menu
- Mobile: Hamburger menu opens Sheet
- Language toggle: Switches between languages

## Accessibility
- Semantic nav element
- ARIA labels for menu buttons
- Keyboard navigation

## Usage
```tsx
<SiteHeader 
  variant="overlay"
  logoText="Pooja HennArt & Makeover"
  showLanguageToggle={true}
/>
```

