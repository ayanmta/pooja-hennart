# Clarifications: Location Map Section

**Feature**: 004-location-map  
**Date**: 2025-01-XX

## User Responses Summary

### 1. Map Placement
**Answer**: D - Both contact page AND homepage
- Map section should appear on both pages
- Contact page: Below contact form/social links
- Homepage: As a new section

### 2. Mapping Service
**Answer**: A - Leaflet + OpenStreetMap
- Free, no API key required
- Open-source solution
- Good performance and customization

### 3. Distance Calculation
**Answer**: B - Driving distance (car)
- Calculate actual driving distance, not straight-line
- Use routing API (OSRM or GraphHopper)
- Show both distance and travel time

### 4. Additional Features
**Answer**: A - Estimated travel time: **Yes**
- Show travel time along with distance
- Format: "X hours Y minutes" or "Y minutes"

### 5. Permission Request Design
**Answer**: A - Card/banner above the map
- Auto-request 10 seconds after page load
- Short description: "Find your distance from Pooja's house"
- Asked only once per session (use sessionStorage)
- Auto-dismiss after permission granted/denied

### 6. Map Size and Layout
**Answer**: A - Full-width section
- No max-width container
- Full-width on all screen sizes
- Responsive design

### 7. Visual Design
**Answer**: C - Show address text below map
**Answer**: Markers - Custom branded markers for Pooja's location
- Custom marker design for Pooja's location
- Different marker for user location
- Address displayed below the map

### 8. Mobile Experience
**Answer**: (Not specified, will use best practice)
- Embedded map (scrollable)
- Touch-friendly controls
- Responsive markers and text

## Key Decisions

### Permission Flow
1. Page loads → Map shows Pooja's location
2. After 10 seconds → Permission request card appears above map
3. User sees: "Find your distance from Pooja's house"
4. Browser permission dialog appears
5. If granted → Fetch location, calculate distance/time, show on map
6. If denied → Don't ask again this session (sessionStorage)
7. Card auto-dismisses after decision

### Distance & Time Display
- **Distance**: Show in kilometers only (e.g., "5.2 km")
- **Time**: Show estimated travel time (e.g., "45 minutes" or "1 hour 30 minutes")
- Display below map or as overlay
- Update if user location changes

### Data Storage
- **Pooja's location**: Stored in Sanity CMS (latitude, longitude, address)
- **User location**: Stored temporarily in component state (not persisted)
- **Permission preference**: Stored in sessionStorage (client-side only)
- **No server-side storage** of user location data

### Routing API
- Use OSRM (Open Source Routing Machine) - free, no API key
- Alternative: GraphHopper - free tier available
- Calculate driving route and extract distance + time

## Implementation Details

### Auto-Permission Request
```typescript
useEffect(() => {
  const hasAsked = sessionStorage.getItem('location-permission-asked');
  if (!hasAsked) {
    const timer = setTimeout(() => {
      // Show permission request card
      requestLocationPermission();
      sessionStorage.setItem('location-permission-asked', 'true');
    }, 10000); // 10 seconds
    
    return () => clearTimeout(timer);
  }
}, []);
```

### Distance & Time Calculation
```typescript
// Using OSRM API
const response = await fetch(
  `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${poojaLon},${poojaLat}?overview=false&alternatives=false&steps=false`
);
const data = await response.json();
const distance = data.routes[0].distance / 1000; // Convert to km
const duration = data.routes[0].duration; // In seconds
const travelTime = formatTravelTime(duration); // Convert to hours/minutes
```

### Component Structure
```
LocationMap/
  ├── LocationMap.tsx          # Main component
  ├── PermissionRequest.tsx    # Auto-request card (10s delay)
  ├── DistanceDisplay.tsx      # Distance + time display
  └── index.ts
```

## Updated Requirements

### Must Have
- ✅ Leaflet + OpenStreetMap (free)
- ✅ Auto-permission request (10 seconds)
- ✅ Driving distance calculation
- ✅ Travel time estimation
- ✅ Full-width map section
- ✅ Custom branded markers
- ✅ Address text below map
- ✅ Show on both contact page and homepage
- ✅ One-time permission request per session

### Nice to Have
- Route visualization on map
- Directions button (opens external maps)
- Multiple locations support (future)

## Questions Resolved

1. ✅ **Mapping Service**: Leaflet + OpenStreetMap
2. ✅ **Distance Type**: Driving distance (car)
3. ✅ **Map Placement**: Both contact page and homepage
4. ✅ **Travel Time**: Yes, show estimated time
5. ✅ **Permission**: Auto-request after 10s, once per session
6. ✅ **Layout**: Full-width
7. ✅ **Markers**: Custom branded
8. ✅ **Address**: Show below map
