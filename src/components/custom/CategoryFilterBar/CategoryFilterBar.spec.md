# CategoryFilterBar Component Specification

## Overview
A filter bar component that allows users to filter content by category.

## Props
- `categories` (Category[], required): Array of category objects with `id` and `label`
- `onCategoryChange` (function, optional): Callback fired when category selection changes. Receives `categoryId: string | null`
- `defaultCategory` (string | null, optional): Initially selected category ID. Default: null (shows "All")

## Category Interface
```typescript
interface Category {
  id: string;
  label: string;
}
```

## Usage
```tsx
const categories = [
  { id: "bridal", label: "Bridal" },
  { id: "editorial", label: "Editorial" },
  { id: "special-events", label: "Special Events" },
];

<CategoryFilterBar 
  categories={categories}
  onCategoryChange={(categoryId) => console.log(categoryId)}
  defaultCategory="bridal"
/>
```

## Behavior
- Clicking a category selects it (highlighted state)
- Clicking the same category again deselects it (shows "All")
- "All" button clears the selection
- Selected category is highlighted with primary colors
- Unselected categories use muted colors

