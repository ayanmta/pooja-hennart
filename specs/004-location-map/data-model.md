# Data Model: Location Map Section

**Feature**: 004-location-map  
**Date**: 2025-01-XX

## Overview

The Location Map feature requires storing Pooja's location coordinates in Sanity CMS and displaying them on an interactive map. User locations can optionally be stored (with user consent) along with optional name and phone number to help Pooja reach out to users.

## Sanity Schema

### Option 1: Add to Contact Schema (Recommended)

Add location fields directly to the existing `contact` schema:

```typescript
// sanity/schemas/contact.ts
defineField({
  name: "location",
  title: "Location",
  type: "object",
  description: "Pooja's location for map display",
  fields: [
    {
      name: "address",
      title: "Address",
      type: "string",
      description: "Full address for display (e.g., 'Mumbai, Maharashtra, India')",
    },
    {
      name: "latitude",
      title: "Latitude",
      type: "number",
      description: "Latitude coordinate (-90 to 90)",
      validation: (Rule) => Rule.required().min(-90).max(90),
    },
    {
      name: "longitude",
      title: "Longitude",
      type: "number",
      description: "Longitude coordinate (-180 to 180)",
      validation: (Rule) => Rule.required().min(-180).max(180),
    },
    {
      name: "showOnMap",
      title: "Show on Map",
      type: "boolean",
      description: "Display location on website map",
      initialValue: true,
    },
  ],
}),
```

### Option 2: Separate Location Schema

Create a dedicated location document type:

```typescript
// sanity/schemas/location.ts
export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      description: "Full address for display",
    }),
    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
      validation: (Rule) => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
      validation: (Rule) => Rule.required().min(-180).max(180),
    }),
    defineField({
      name: "showOnMap",
      title: "Show on Map",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
```

## Data Structure

### Pooja's Location (Stored in Sanity)

```typescript
interface PoojaLocation {
  address?: string;        // Optional display address
  latitude: number;        // Required: -90 to 90
  longitude: number;       // Required: -180 to 180
  showOnMap: boolean;      // Toggle visibility
}
```

### User Location (Stored in Sanity - Optional)

```typescript
interface UserLocationShare {
  _id: string;              // Sanity document ID
  _type: "userLocationShare";
  userLatitude: number;     // User's latitude
  userLongitude: number;    // User's longitude
  distanceKm: number;       // Distance from Pooja in km
  travelTimeMinutes: number; // Travel time in minutes
  userName?: string;        // Optional: User's name
  userPhone?: string;       // Optional: User's phone
  sharedAt: string;         // ISO datetime string
}
```

### User Location (Temporary - Before Storage)

```typescript
interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;       // GPS accuracy in meters
  timestamp: number;       // When location was obtained
}
```

### Distance Calculation Result

```typescript
interface DistanceResult {
  kilometers: number;     // Distance in km
  miles: number;          // Distance in miles
  formatted: {
    km: string;           // e.g., "5.2 km"
    miles: string;        // e.g., "3.2 miles"
  };
}
```

## Sanity Query

### Updated Contact Query

```typescript
// src/lib/sanity/queries.ts
export async function getContact() {
  const query = `*[_type == "contact"][0] {
    whatsappNumber,
    whatsappMessage,
    phoneNumber,
    instagramHandle,
    facebookUrl,
    youtubeChannelUrl,
    email,
    showBookingForm,
    contactTitle,
    contactSubtitle,
    location {
      address,
      latitude,
      longitude,
      showOnMap
    }
  }`;

  return await client.fetch(query);
}
```

## Component Props

### LocationMap Component

```typescript
interface LocationMapProps {
  poojaLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  className?: string;
}
```

### PermissionRequest Component

```typescript
interface PermissionRequestProps {
  onRequestPermission: () => void;
  isRequesting: boolean;
  className?: string;
}
```

### DistanceDisplay Component

```typescript
interface DistanceDisplayProps {
  distance: {
    kilometers: number;
    miles: number;
  };
  className?: string;
}
```

## Data Flow

1. **Server Component** → Fetches contact data from Sanity (includes location)
2. **Client Component** → Receives Pooja's location as props
3. **Map Component** → Displays Pooja's location on map
4. **Auto Permission Request (10s)** → Card appears: "Help Pooja reach you - Find your distance"
5. **Browser API** → Requests geolocation permission
6. **Permission Granted** → Fetches user location
7. **Distance Calculation** → Calculates distance and travel time between locations
8. **Display** → Shows distance, travel time, and updates map with user location
9. **Contact Form** → Appears: "Would you like to share your name and number so Pooja can reach out to you?"
10. **User Submits (Optional)** → Location + name/phone sent to `/api/location/share`
11. **API Route** → Stores data in Sanity `userLocationShare` document
12. **Sanity Studio** → Pooja can view all location shares

## Privacy Considerations

### What We Store
- ✅ Pooja's location (latitude, longitude, address) - in contact schema
- ✅ User location shares (if user consents) - in `userLocationShare` schema:
  - User latitude, longitude
  - Distance from Pooja (km)
  - Travel time (minutes)
  - Timestamp
  - Optional: User name
  - Optional: User phone number

### What We DON'T Store
- ❌ User's IP address
- ❌ Browser fingerprint
- ❌ Session ID
- ❌ Any other tracking data

### Data Usage
- User location is stored only if user explicitly submits contact form
- User can skip contact form (location not stored)
- Clear, friendly messaging: "Help Pooja reach you" (not "share your location")
- Data stored in Sanity for Pooja to view in Studio
- No analytics tracking beyond what user explicitly provides

### User Consent
- **Explicit**: User must grant location permission
- **Optional**: User can skip name/phone form
- **Transparent**: User knows data is stored when they submit form
- **Purpose**: "So Pooja can reach out to you"

## Example Data

### Pooja's Location (Mumbai Example)

```json
{
  "address": "Mumbai, Maharashtra, India",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "showOnMap": true
}
```

### User Location Share (Example - Stored in Sanity)

```json
{
  "_id": "abc123",
  "_type": "userLocationShare",
  "userLatitude": 19.1077,
  "userLongitude": 72.8317,
  "distanceKm": 4.2,
  "travelTimeMinutes": 45,
  "userName": "John Doe",
  "userPhone": "+919876543210",
  "sharedAt": "2025-01-15T10:30:00Z"
}
```

### User Location (Example - Temporary, Before Storage)

```json
{
  "latitude": 19.1077,
  "longitude": 72.8317,
  "accuracy": 20,
  "timestamp": 1704633600000
}
```

### Distance Result (Example)

```json
{
  "kilometers": 4.2,
  "miles": 2.6,
  "formatted": {
    "km": "4.2 km",
    "miles": "2.6 miles"
  }
}
```

## Validation Rules

### Latitude
- Range: -90 to 90
- Required field
- Decimal precision: Up to 6 decimal places (GPS accuracy)

### Longitude
- Range: -180 to 180
- Required field
- Decimal precision: Up to 6 decimal places (GPS accuracy)

### Address
- Optional field
- Free text
- Used for display purposes only

## Migration Path

If location data needs to be added to existing contact documents:

1. Add location fields to schema
2. Update Sanity Studio
3. Manually enter location in Sanity Studio
4. Update queries to include location
5. Test map display

## Future Enhancements

### Multiple Locations
If Pooja has multiple locations (home, studio, etc.):

```typescript
locations: [
  {
    name: "Home",
    address: "...",
    latitude: ...,
    longitude: ...,
    isPrimary: true
  },
  {
    name: "Studio",
    address: "...",
    latitude: ...,
    longitude: ...,
    isPrimary: false
  }
]
```

### Location Types
- Home address
- Studio location
- Event locations
- Service areas
