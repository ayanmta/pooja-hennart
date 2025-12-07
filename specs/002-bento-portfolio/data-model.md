# Data Model: Bento Portfolio Page

**Feature**: 002-bento-portfolio  
**Date**: 2025-01-06

## Entities

### MediaItem (Existing - Reused)

Represents a portfolio media item (image) from Sanity CMS.

**Source**: Sanity CMS `mediaItem` document type

**Attributes**:
- `id` (string, required): Sanity document ID
- `type` (string, required): Media type ("image" or "video")
- `src` (string, required): Main image URL
- `thumbnail` (string, optional): Thumbnail image URL
- `platform` (string, optional): Platform identifier (e.g., "instagram", "youtube")
- `categories` (array of strings, optional): Array of category IDs this item belongs to
- `caption` (string, optional): Image caption/description
- `isFeatured` (boolean, optional): Whether item is featured (used for size assignment)
- `order` (number, optional): Display order
- `_createdAt` (string, optional): Creation timestamp

**Relationships**:
- Belongs to zero or more `Category` documents (via `categories[]` field)

**Validation Rules**:
- `src` is required and must be a valid URL
- `categories` array can be empty (uncategorized items)
- `isFeatured` defaults to false

**State Transitions**: None (static content managed in Sanity)

---

### Category (Existing - Reused)

Represents a portfolio category (e.g., Bridal, Mehendi, Party).

**Source**: Sanity CMS `category` document type

**Attributes**:
- `id` (string, required): Unique identifier (e.g., "bridal", "mehendi") - lowercase, alphanumeric with hyphens
- `label` (string, required): Display name (e.g., "Bridal", "Mehendi")
- `description` (string, optional): Short description for category cards
- `order` (number, optional): Display order (lower numbers appear first, default: 0)

**Relationships**:
- Has many `MediaItem` documents (via `mediaItem.categories[]` field)

**Validation Rules**:
- `id` must be lowercase, alphanumeric with hyphens only
- `label` is required and must be non-empty
- `order` defaults to 0 if not provided

**State Transitions**: None (static content managed in Sanity)

---

### BentoGridItem (Frontend Entity)

Visual representation of a media item in the bento grid (not stored in Sanity).

**Attributes**:
- `mediaItem` (MediaItem, required): The underlying media item
- `size` (BentoSize, required): Grid size assignment (e.g., "small", "large")
- `gridColSpan` (number, required): CSS Grid column span (1 or 2)
- `gridRowSpan` (number, required): CSS Grid row span (1 or 2)
- `aspectRatio` (string, required): Aspect ratio class (e.g., "aspect-square", "aspect-[2/1]")

**Relationships**:
- Wraps one `MediaItem` entity
- Size assignment based on MediaItem's `isFeatured` and `order` properties

**Derived Data**:
- Size assignment algorithm: Featured items get larger sizes (2x2), regular items get smaller sizes (1x1 or 1x2)
- Grid positioning calculated by CSS Grid auto-flow

**Size Assignment Rules**:
- Featured items: `gridColSpan: 2, gridRowSpan: 2` (large square)
- Regular items (even order): `gridColSpan: 1, gridRowSpan: 1` (small square)
- Regular items (odd order): `gridColSpan: 2, gridRowSpan: 1` (wide rectangle)

---

### CategoryFilterState (Frontend Entity)

Filter state and URL synchronization for category-based filtering.

**Attributes**:
- `activeCategory` (string | null, required): Currently active category ID, or null for "All"
- `urlParam` (string | null, required): URL query parameter value (e.g., "bridal" or null)
- `isAllSelected` (boolean, required): Whether "All" filter is active

**Relationships**:
- References one `Category` entity when filtered (or null for "All")

**State Transitions**:
- User selects category → `activeCategory` updates, URL updates via `useSearchParams`
- User selects "All" → `activeCategory` becomes null, URL parameter removed
- URL changes (browser back/forward) → `activeCategory` updates from URL

**Synchronization**:
- URL is the source of truth
- Filter bar UI reflects current URL parameter
- Server Component reads URL parameter to filter data

---

## Data Flow

### Portfolio Page Data Flow

1. **Server Component** (`app/portfolio/page.tsx`):
   - Reads `searchParams.category` from URL
   - Fetches all media items via `getMediaItems()` from `src/lib/sanity/queries.ts`
   - Fetches categories via `getCategories()`
   - Filters media items by category if `searchParams.category` is present
   - Passes filtered media and categories to Client Component

2. **Client Component** (`PortfolioClient`):
   - Receives filtered media items and categories as props
   - Uses `useSearchParams()` to read/update URL parameters
   - Manages filter bar state synchronized with URL
   - Passes media items to BentoGrid component

3. **BentoGrid Component**:
   - Receives media items array
   - Applies size assignment algorithm (featured → large, regular → small)
   - Creates `BentoGridItem` entities with size metadata
   - Renders grid using CSS Grid with assigned sizes
   - Implements infinite scroll for large collections

4. **BentoGridItem Component**:
   - Receives `BentoGridItem` entity with size and media item
   - Renders Next.js Image with proper sizing
   - Applies Framer Motion animations on mount/scroll
   - Handles click to open MediaLightbox

### Size Assignment Algorithm

**Input**: Array of MediaItem entities
**Output**: Array of BentoGridItem entities with size assignments

**Algorithm**:
1. Sort media items by: Featured first, then by order
2. For each media item:
   - If `isFeatured === true`: Assign large size (2x2 grid cells)
   - Else if `order % 2 === 0`: Assign small square (1x1)
   - Else: Assign wide rectangle (2x1)
3. Return array of BentoGridItem entities

**Example**:
```
Input: [featured1, regular1, regular2, featured2, regular3]
Output: [
  {mediaItem: featured1, size: "large", gridColSpan: 2, gridRowSpan: 2},
  {mediaItem: regular1, size: "small", gridColSpan: 1, gridRowSpan: 1},
  {mediaItem: regular2, size: "wide", gridColSpan: 2, gridRowSpan: 1},
  {mediaItem: featured2, size: "large", gridColSpan: 2, gridRowSpan: 2},
  {mediaItem: regular3, size: "small", gridColSpan: 1, gridRowSpan: 1}
]
```

### Infinite Scroll Data Flow

1. **Initial Load**: Server Component fetches first batch (e.g., 20 items)
2. **Scroll Detection**: Intersection Observer detects when user scrolls near bottom (200px threshold)
3. **Load More**: Client Component fetches next batch from Sanity (can use existing `getMediaItems()` with offset/limit)
4. **Append Items**: New items appended to existing array, size assignment applied
5. **Animate In**: Framer Motion animates new items as they enter viewport

---

## Type Definitions

### TypeScript Interfaces

```typescript
// BentoGridItem for frontend
interface BentoGridItem {
  mediaItem: MediaItem;
  size: "small" | "large" | "wide";
  gridColSpan: 1 | 2;
  gridRowSpan: 1 | 2;
  aspectRatio: string; // Tailwind aspect ratio class
}

// CategoryFilterState
interface CategoryFilterState {
  activeCategory: string | null;
  urlParam: string | null;
  isAllSelected: boolean;
}

// BentoGrid Props
interface BentoGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem, index: number) => void;
  className?: string;
}

// PortfolioClient Props
interface PortfolioClientProps {
  initialMedia: MediaItem[];
  categories: Category[];
  initialCategory?: string | null; // From URL searchParams
  logoUrl?: string;
  logoAlt?: string;
  contact?: Contact;
}
```

---

## Sanity Query Requirements

### Existing Queries (Reused)

- `getMediaItems(featuredOnly?: boolean)`: Returns all media items or featured only
- `getCategories()`: Returns all categories with id, label, description, order
- `getMediaItemsByCategory(categoryId: string)`: Returns media items for specific category

### Query Modifications Needed

- **None**: Existing queries are sufficient
- May add pagination support to `getMediaItems()` for infinite scroll (offset/limit parameters)

---

## Data Validation

### Client-Side Validation

- Validate category ID exists in categories array before filtering
- Handle invalid category IDs in URL gracefully (show all items or error state)
- Validate media items have required fields (id, src) before rendering

### Server-Side Validation

- Sanity queries handle validation via GROQ
- TypeScript types ensure type safety
- Handle null/undefined gracefully in data transformation

---

## Edge Cases & Error Handling

### Empty States

- **No media items**: Display empty state message "No portfolio items available"
- **No items for category**: Display "No items in [category name] category"
- **Invalid category ID**: Show all items or display error message

### Data Loading Errors

- **Sanity query failure**: Display error message, allow retry
- **Image load failure**: Display fallback placeholder or error state
- **Network errors**: Handle gracefully with user-friendly messages

### Infinite Scroll Edge Cases

- **No more items**: Stop loading, show "End of portfolio" indicator
- **Loading state**: Show loading indicator while fetching next batch
- **Error during load**: Display error message, allow retry

---

## Performance Considerations

1. **Initial Load**: Limit first batch to 20 items for fast LCP
2. **Infinite Scroll**: Load 20 items per batch to balance performance and UX
3. **Image Optimization**: Use Next.js Image with proper `sizes` prop for responsive loading
4. **Size Assignment**: Calculate sizes once on mount, memoize if needed
5. **Grid Recalculation**: Minimize layout shifts during infinite scroll

---

## Migration Notes

- No Sanity schema changes required
- Existing MediaItem and Category types can be reused
- New BentoGridItem type is frontend-only (not stored in Sanity)
- Portfolio page route remains `/portfolio` (no URL changes)

