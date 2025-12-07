# Sanity Category Description Implementation

## Overview

Added support for category descriptions that appear on category cards in a Pinterest-style overlay.

## Sanity Schema Update

**File**: `sanity/schemas/category.ts`

Added a new `description` field to the category schema:

```typescript
defineField({
  name: "description",
  title: "Description",
  type: "text",
  description: "Short description for the category (shown on category cards)",
  rows: 2,
  validation: (Rule) => Rule.max(120).warning("Keep descriptions short for best display"),
}),
```

## Field Details

- **Type**: `text` (multi-line text input)
- **Rows**: 2 (compact input)
- **Validation**: Max 120 characters (warning only, not enforced)
- **Optional**: Yes (description is optional - cards will show only category name if no description provided)

## Usage in Sanity Studio

1. Navigate to any category document in Sanity Studio
2. You'll see a new "Description" field below the "Display Order" field
3. Enter a short, descriptive text (recommended: 60-120 characters)
4. The description will appear below the category name on category cards

## Example Descriptions

- **Bridal**: "Elegant bridal makeup and hairstyling for your special day"
- **Mehendi**: "Intricate henna designs for hands and feet"
- **Party**: "Glamorous looks for parties and special events"
- **Editorial**: "Creative editorial makeup and styling"

## Frontend Implementation

### Type Updates

**File**: `src/lib/types/category.ts`

```typescript
export interface CategoryCard {
  categoryId: string;
  categoryLabel: string;
  description?: string;  // NEW: Optional description
  templateImage: CollageImage;
  href: string;
  order: number;
}
```

### Query Update

**File**: `src/lib/sanity/queries.ts`

The `getCategories()` query now includes the description field:

```groq
*[_type == "category"] | order(order asc) {
  id,
  label,
  description,  // NEW
  order
}
```

### Component Display

**File**: `src/components/custom/CategoryCarousel/CategoryCard.tsx`

The category card now displays:
- Category name (always shown, bold, white text)
- Description (shown if provided, smaller text, white with slight transparency)

The overlay uses a Pinterest-style gradient (dark overlay from bottom) for readability.

## Visual Design

- **Overlay**: Dark gradient (`from-black/70 via-black/50 to-transparent`) for text readability
- **Category Name**: White, semibold, 18px, single line (truncated if too long)
- **Description**: White with 90% opacity, 14px, up to 2 lines (truncated if too long)
- **Position**: Bottom of card with padding
- **Text Shadow**: Subtle drop shadow for better readability

## Migration Notes

- Existing categories without descriptions will continue to work (only name will show)
- No breaking changes - description is optional
- After deploying schema changes, restart Sanity Studio to see the new field

