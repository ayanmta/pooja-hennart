# Data Model: Simplify Portfolio Category Selection

**Feature**: 001-simplify-portfolio  
**Date**: 2025-01-06

## Entities

### Category

Represents a portfolio category (e.g., Bridal, Mehendi, Party).

**Source**: Sanity CMS `category` document type

**Attributes**:
- `id` (string, required): Unique identifier (e.g., "bridal", "mehendi") - lowercase, alphanumeric with hyphens
- `label` (string, required): Display name (e.g., "Bridal", "Mehendi")
- `order` (number, optional): Display order (lower numbers appear first, default: 0)

**Relationships**:
- Has many `MediaItem` documents (via `mediaItem.categories[]` field)
- Media items reference categories via array of category IDs

**Validation Rules**:
- `id` must be lowercase, alphanumeric with hyphens only
- `label` is required and must be non-empty
- `order` defaults to 0 if not provided

**State Transitions**: None (static content managed in Sanity)

---

### MediaItem

Represents a portfolio media item (image or video).

**Source**: Sanity CMS `mediaItem` document type

**Attributes**:
- `_id` (string, required): Sanity document ID
- `title` (string, optional): Media title
- `caption` (string, optional): Media caption/description
- `image` (image asset, required): Main image asset reference
- `thumbnail` (image asset, optional): Thumbnail image asset reference
- `categories` (array of category references, optional): Array of category IDs this item belongs to
- `isFeatured` (boolean, optional): Whether item is featured (used for "All" card collage)
- `order` (number, optional): Display order
- `platform` (string, optional): Platform identifier (e.g., "instagram", "youtube")

**Relationships**:
- Belongs to zero or more `Category` documents (via `categories[]` field)

**Validation Rules**:
- `image` asset is required
- `categories` array can be empty (uncategorized items)
- `isFeatured` defaults to false

**State Transitions**: None (static content managed in Sanity)

---

### CategoryCard (Frontend Entity)

Visual representation of a category in the carousel (not stored in Sanity).

**Attributes**:
- `categoryId` (string, required): Category ID
- `categoryLabel` (string, required): Category display name
- `templateImage` (MediaItem, required): Single media item for template image display
- `href` (string, required): Navigation URL to portfolio page (e.g., "/portfolio?category=bridal")
- `order` (number, required): Display order from category

**Relationships**:
- References one `Category` entity
- Contains 1 `MediaItem` entity for template image

**Derived Data**:
- Template image selected from category's media items (prioritize featured items, fallback to most recent)
- Navigation URL generated from category ID

---

### AllCard (Frontend Entity)

Special "All" card for showing all media items (not stored in Sanity).

**Attributes**:
- `label` (string, constant): "All"
- `templateImage` (MediaItem, required): Single featured media item from all categories
- `href` (string, constant): "/portfolio" (portfolio page without category filter)

**Relationships**:
- Contains 1 featured `MediaItem` entity from all categories

**Derived Data**:
- Template image selected from first featured media item across all categories (fallback to most recent if no featured items)

---

## Data Flow

### Homepage Category Carousel Data Flow

1. **Server Component** (`HomeClient` or page component):
   - Fetches categories via `getCategories()` from `src/lib/sanity/queries.ts`
   - Fetches all media items via `getMediaItems()` 
   - Groups media items by category
   - Selects collage images for each category (2-4 items, prioritize featured)
   - Selects collage images for "All" card (featured items across all categories)

2. **Data Transformation**:
   - Transform Sanity categories to `CategoryCard` entities
   - Generate "All" card entity
   - Create navigation URLs for each card

3. **Client Component** (`CategoryCarousel`):
   - Receives array of `CategoryCard` and `AllCard` entities as props
   - Renders carousel with cards
   - Handles navigation on card click

### Collage Image Selection Logic

**For Category Cards**:
1. Filter media items by category ID
2. Prioritize items with `isFeatured === true`
3. Select up to 4 items (or all if less than 4)
4. If no items in category, use fallback placeholder

**For "All" Card**:
1. Filter all media items where `isFeatured === true`
2. Select up to 6 items (or fewer if less available)
3. If no featured items, select recent items (by `order` or `_createdAt`)
4. If no items at all, use fallback placeholder

---

## Type Definitions

### TypeScript Interfaces

```typescript
// Category from Sanity
interface SanityCategory {
  id: string;
  label: string;
  order?: number;
}

// MediaItem from Sanity (simplified for collage)
interface SanityMediaItem {
  _id: string;
  imageUrl: string;
  imageAlt?: string;
  thumbnailUrl?: string;
  categories: string[];
  isFeatured?: boolean;
  order?: number;
}

// CategoryCard for frontend
interface CategoryCard {
  categoryId: string;
  categoryLabel: string;
  collageImages: Array<{
    id: string;
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  href: string;
  order: number;
}

// AllCard for frontend
interface AllCard {
  label: string;
  collageImages: Array<{
    id: string;
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  href: string;
}
```

---

## Query Requirements

### New/Updated GROQ Queries

**Category Query** (existing, no changes needed):
- Query: `getCategories()` - already exists
- Returns: Array of categories with id, label, order

**Media Items Query** (existing, may need extension):
- Query: `getMediaItems(featuredOnly?: boolean)` - already exists
- May need: Helper to get media items by category ID
- Returns: Array of media items with image URLs, categories, isFeatured flag

**New Helper Functions Needed**:
- `getMediaItemsByCategory(categoryId: string)`: Get media items for a specific category
- `getFeaturedMediaItems(limit?: number)`: Get featured items for "All" card collage

---

## Data Validation

### Frontend Validation

- Category cards must have at least 1 collage image (or fallback)
- Navigation URLs must be valid (start with "/portfolio")
- Category IDs must match existing categories
- Collage images must have valid image URLs

### Sanity Validation

- Category `id` must be unique
- Category `label` must be non-empty
- Media items must have valid image assets
- Category references in media items must reference existing categories

---

## Edge Cases & Fallbacks

### No Media Items in Category
- Display fallback placeholder image
- Use gradient background with category name
- Still allow navigation to portfolio page

### No Featured Items for "All" Card
- Fallback to recent items (by order or creation date)
- If still no items, use placeholder

### Image Load Failures
- Next.js Image component handles errors
- Display placeholder or gradient fallback
- Log error for debugging

### Empty Categories Array
- Show empty state message
- Hide carousel or show "No categories available"

