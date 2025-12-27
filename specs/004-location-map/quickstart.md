# Quick Start: Location Map Section

## Overview

This guide helps you quickly understand and implement the location map feature that shows Pooja's location and calculates distance from user's location.

## Key Requirements

1. **Show Pooja's location** on an interactive map
2. **Request permission politely**: "Find your distance from Pooja's house"
3. **Calculate and display distance** when permission granted
4. **Handle all states gracefully**: granted, denied, error

## Quick Implementation Steps

### 1. Add Location to Sanity

```typescript
// In sanity/schemas/contact.ts, add:
{
  name: "location",
  title: "Location",
  type: "object",
  fields: [
    { name: "latitude", type: "number", validation: Rule => Rule.required() },
    { name: "longitude", type: "number", validation: Rule => Rule.required() },
    { name: "address", type: "string" }
  ]
}
```

### 2. Install Map Library

```bash
# Option 1: Leaflet (Free, recommended)
npm install react-leaflet leaflet

# Option 2: Google Maps
npm install @react-google-maps/api

# Option 3: Mapbox
npm install react-map-gl
```

### 3. Create Map Component

```typescript
// src/components/custom/LocationMap/LocationMap.tsx
"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export function LocationMap({ 
  poojaLocation,
  userLocation 
}: LocationMapProps) {
  // Implementation here
}
```

### 4. Permission Request

```typescript
const handleRequestLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success: Use position.coords
      },
      (error) => {
        // Handle error
      },
      { timeout: 10000 }
    );
  }
};
```

### 5. Distance Calculation

```typescript
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}
```

## Permission Message

**Recommended Text:**
> "Find your distance from Pooja's house"
> 
> "Click below to see how far you are from Pooja's location and get directions."

**Button Text:**
- "Find My Distance"
- "Show My Location"
- "Get Directions"

## Component Props

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

## Usage Example

```tsx
<LocationMap 
  poojaLocation={{
    latitude: 19.0760,
    longitude: 72.8777,
    address: "Mumbai, India"
  }}
/>
```

## Important Notes

1. **HTTPS Required**: Geolocation API only works on HTTPS (or localhost)
2. **User Consent**: Always ask before accessing location
3. **Error Handling**: Handle all error cases gracefully
4. **Privacy**: Never store user location data
5. **Performance**: Lazy load map component

## Next Steps

1. Review the full [spec.md](./spec.md) for detailed requirements
2. Check [plan.md](./plan.md) for implementation phases
3. Start with Phase 1: Setup & Data Model
