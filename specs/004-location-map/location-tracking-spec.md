# Location Tracking Specification

**Feature**: 004-location-map (Location Tracking)  
**Date**: 2025-01-XX  
**Status**: Updated with Location Tracking

## Overview

Users can share their location to help Pooja reach them. The system stores location data along with optional name and phone number in Sanity CMS, which Pooja can view in Sanity Studio.

## User Flow

1. **Map Loads**: Map displays Pooja's location
2. **Auto Permission Request (10 seconds)**: 
   - Card appears above map
   - Message: **"Help Pooja reach you - Find your distance from Pooja's location"**
   - Browser permission dialog appears
   - Card auto-dismisses after decision
3. **Permission Granted**:
   - User location fetched
   - Distance calculated and displayed
   - Map shows user location and route
   - **Optional Contact Form Appears**: 
     - Message: "Would you like to share your name and number so Pooja can reach out to you?"
     - Form fields: Name (optional), Phone Number (optional)
     - Submit button: "Share with Pooja"
4. **User Submits Contact Info** (optional):
   - Location + name/phone saved to Sanity via API
   - Success message shown
   - Form disappears
5. **Permission Denied**: 
   - Card disappears (won't ask again this session)
   - Map still shows Pooja's location
   - No contact form shown

## Key Requirements

### Permission Request
- **Combined consent**: Single permission request for location + helping Pooja reach you
- **Friendly messaging**: "Help Pooja reach you" (NOT "share your location")
- **No mention of "sharing"**: Frame as helping, not sharing
- **Auto-request**: 10 seconds after page load
- **Once per session**: Use sessionStorage to track

### Contact Information Collection
- **Optional**: User can skip name/phone
- **After location**: Show form only after location is fetched
- **Clear purpose**: "So Pooja can reach out to you"
- **No pressure**: User can dismiss or skip

### Data Storage
- **Public endpoint**: `/api/location/share` (no authentication required)
- **Store in Sanity**: New document type `userLocationShare`
- **Data stored**:
  - User location (latitude, longitude)
  - Distance from Pooja (km)
  - Travel time (minutes)
  - Timestamp
  - Optional: Name
  - Optional: Phone number
- **No login required**: Anyone can submit location

### Admin View (Sanity Studio)
- **View in Studio**: Pooja can see all location shares in Sanity Studio
- **Display format**: List/table view with:
  - Timestamp
  - Distance
  - Travel time
  - Name (if provided)
  - Phone (if provided)
  - Location coordinates
- **Filtering**: By date, by name, by distance
- **Export**: Ability to export data (future)

## Sanity Schema

### New Document Type: `userLocationShare`

```typescript
// sanity/schemas/userLocationShare.ts
export default defineType({
  name: "userLocationShare",
  title: "User Location Shares",
  type: "document",
  fields: [
    defineField({
      name: "userLatitude",
      title: "User Latitude",
      type: "number",
      validation: (Rule) => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: "userLongitude",
      title: "User Longitude",
      type: "number",
      validation: (Rule) => Rule.required().min(-180).max(180),
    }),
    defineField({
      name: "distanceKm",
      title: "Distance (km)",
      type: "number",
      description: "Distance from Pooja's location in kilometers",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "travelTimeMinutes",
      title: "Travel Time (minutes)",
      type: "number",
      description: "Estimated travel time in minutes",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      description: "Optional: Name provided by user",
    }),
    defineField({
      name: "userPhone",
      title: "User Phone",
      type: "string",
      description: "Optional: Phone number provided by user",
    }),
    defineField({
      name: "sharedAt",
      title: "Shared At",
      type: "datetime",
      description: "When the location was shared",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      name: "userName",
      phone: "userPhone",
      distance: "distanceKm",
      time: "travelTimeMinutes",
      date: "sharedAt",
    },
    prepare({ name, phone, distance, time, date }) {
      const displayName = name || "Anonymous";
      const displayPhone = phone || "No phone";
      const formattedDate = date ? new Date(date).toLocaleDateString() : "Unknown";
      return {
        title: `${displayName} - ${distance?.toFixed(1)} km`,
        subtitle: `${displayPhone} • ${time} min • ${formattedDate}`,
      };
    },
  },
  orderings: [
    {
      title: "Date (newest first)",
      name: "dateDesc",
      by: [{ field: "sharedAt", direction: "desc" }],
    },
    {
      title: "Distance (closest first)",
      name: "distanceAsc",
      by: [{ field: "distanceKm", direction: "asc" }],
    },
  ],
});
```

## API Route

### `/api/location/share` (POST)

**Public endpoint** - No authentication required

**Request Body:**
```typescript
{
  latitude: number;        // User's latitude
  longitude: number;        // User's longitude
  distanceKm: number;      // Distance from Pooja
  travelTimeMinutes: number; // Travel time
  name?: string;           // Optional: User's name
  phone?: string;          // Optional: User's phone
}
```

**Response:**
```typescript
{
  success: boolean;
  id?: string;            // Sanity document ID
  message?: string;       // Error message if failed
}
```

**Implementation:**
- Use Sanity write token (server-side only)
- Create new document in `userLocationShare` type
- Return success/error response

## Component Updates

### LocationMap Component

**New State:**
```typescript
const [showContactForm, setShowContactForm] = useState(false);
const [contactFormData, setContactFormData] = useState({
  name: "",
  phone: "",
});
const [isSubmitting, setIsSubmitting] = useState(false);
```

**New Flow:**
1. After location fetched → `setShowContactForm(true)`
2. User fills form (optional) → Submit
3. Call `/api/location/share` → Store in Sanity
4. Show success message → Hide form

### ContactForm Component (New)

```typescript
interface ContactFormProps {
  onSubmit: (data: { name?: string; phone?: string }) => Promise<void>;
  onSkip: () => void;
  isSubmitting: boolean;
}
```

**Features:**
- Optional name field
- Optional phone field
- "Share with Pooja" button
- "Skip" button
- Loading state during submission

## Privacy Considerations

### What We Store
- ✅ User location (latitude, longitude)
- ✅ Distance and travel time
- ✅ Timestamp
- ✅ Optional name and phone

### What We DON'T Store
- ❌ IP address
- ❌ Browser fingerprint
- ❌ Session ID
- ❌ Any other tracking data

### User Consent
- **Explicit**: User must grant location permission
- **Optional contact**: User can skip name/phone
- **Clear purpose**: "Help Pooja reach you"
- **Transparent**: User knows data is stored

### Data Retention
- **Recommendation**: 90 days (configurable)
- **Future**: Add auto-deletion of old records

## Sanity Studio View

### List View
- Shows all location shares
- Sortable by date, distance
- Filterable by name, date range
- Preview shows: Name, Distance, Phone, Date

### Detail View
- Full location coordinates
- Distance and travel time
- Contact information (if provided)
- Timestamp
- Map preview (future enhancement)

## Implementation Checklist

- [ ] Create `userLocationShare` schema in Sanity
- [ ] Create `/api/location/share` API route
- [ ] Update LocationMap component with contact form
- [ ] Create ContactForm component
- [ ] Update permission request message
- [ ] Add form submission logic
- [ ] Test API endpoint
- [ ] Test Sanity Studio view
- [ ] Add error handling
- [ ] Add success feedback
- [ ] Update privacy considerations in spec

## Security Considerations

1. **Rate Limiting**: Add rate limiting to API endpoint (prevent spam)
2. **Input Validation**: Validate coordinates, phone numbers
3. **Sanity Write Token**: Store securely in environment variables
4. **CORS**: Configure CORS if needed
5. **Input Sanitization**: Sanitize name and phone inputs

## Future Enhancements

- [ ] Map view in Sanity Studio showing all locations
- [ ] Email notifications to Pooja when location shared
- [ ] Export functionality (CSV, JSON)
- [ ] Analytics dashboard (total shares, average distance, etc.)
- [ ] Auto-deletion of old records
- [ ] Filter by date range, distance range
- [ ] Search by name or phone
