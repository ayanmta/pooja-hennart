# Implementation Plan: Location Map Section

**Feature**: 004-location-map  
**Date**: 2025-01-XX  
**Status**: Ready for Implementation

> **Note**: See `tasks.md` for detailed task breakdown with acceptance criteria.

## Phase 1: Setup & Data Model

### Step 1.1: Update Sanity Schema
- [ ] Add location fields to contact schema
- [ ] Add latitude, longitude, address fields
- [ ] Add showOnMap toggle
- [ ] Test schema in Sanity Studio
- [ ] Note: User location will be stored temporarily in component state (not in Sanity)

### Step 1.2: Add Location Data
- [ ] Enter Pooja's location coordinates in Sanity
- [ ] Add address (optional, for display)
- [ ] Verify data is accessible via queries

### Step 1.3: Update Queries
- [ ] Update `getContact()` query to include location data
- [ ] Test query returns location coordinates
- [ ] Handle missing location gracefully

## Phase 2: Map Component Development

### Step 2.1: Choose Map Library
- [ ] Use Leaflet + OpenStreetMap (free, no API key needed)
- [ ] Install: `npm install react-leaflet leaflet`
- [ ] Install routing API client: `npm install osrm-text-instructions` (or use GraphHopper)
- [ ] No environment variables needed for map
- [ ] Optional: Set up OSRM or GraphHopper API for routing (free tier available)

### Step 2.2: Create Base Map Component
- [ ] Create `LocationMap.tsx` component
- [ ] Initialize map with Pooja's location
- [ ] Add marker for Pooja's location
- [ ] Make map responsive
- [ ] Test on mobile and desktop

### Step 2.3: Add Custom Styling
- [ ] Style map to match site design
- [ ] Create custom marker icon (if needed)
- [ ] Add rounded corners, shadows
- [ ] Ensure proper spacing

## Phase 3: Permission & User Location

### Step 3.1: Permission Request UI
- [ ] Create permission request component (card/banner above map)
- [ ] Add short message: "Find your distance from Pooja's house"
- [ ] Auto-show 10 seconds after page load
- [ ] Use sessionStorage to track if already asked (don't show again if denied)
- [ ] Style as card/banner above map
- [ ] Auto-dismiss after permission granted/denied
- [ ] Style to match site design

### Step 3.2: Geolocation Integration
- [ ] Implement browser Geolocation API
- [ ] Handle permission states (granted, denied, error)
- [ ] Add loading states
- [ ] Implement timeout handling
- [ ] Test on HTTPS (required for geolocation)

### Step 3.3: User Location Display
- [ ] Show user marker on map when permission granted
- [ ] Use different marker style for user location
- [ ] Add path/line connecting locations
- [ ] Handle location updates (if user moves)

## Phase 4: Distance Calculation

### Step 4.1: Distance Calculation Logic
- [ ] Integrate routing API (OSRM or GraphHopper) for driving distance
- [ ] Calculate driving route between user and Pooja's location
- [ ] Extract distance in kilometers from route response
- [ ] Calculate estimated travel time from route (considering average speeds)
- [ ] Format distance: "X.X km"
- [ ] Format time: "X hours Y minutes" or "Y minutes"
- [ ] Test with various coordinates

### Step 4.2: Distance Display
- [ ] Create distance and time display component
- [ ] Show distance in kilometers (km)
- [ ] Show estimated travel time
- [ ] Add loading state
- [ ] Style prominently but elegantly
- [ ] Display below map or as overlay
- [ ] Update when location changes

### Step 4.3: Optional: Driving Distance
- [ ] Research mapping API for driving distance
- [ ] Implement if feasible
- [ ] Show estimated travel time (if available)

## Phase 5: Integration & Polish

### Step 5.1: Page Integration
- [ ] Add map section to Contact page (below contact form/social links)
- [ ] Add map section to Homepage (as new section)
- [ ] Make map full-width (no max-width container)
- [ ] Ensure proper section spacing
- [ ] Add section header: "Find Us" or "Location"
- [ ] Show address text below map

### Step 5.2: Error Handling
- [ ] Handle geolocation errors gracefully
- [ ] Show user-friendly error messages
- [ ] Allow retry on errors
- [ ] Handle API failures (if using external service)

### Step 5.3: Performance Optimization
- [ ] Lazy load map component
- [ ] Optimize map rendering
- [ ] Minimize re-renders
- [ ] Test performance on mobile

### Step 5.4: Accessibility
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Add alternative text

## Phase 6: Testing & Refinement

### Step 6.1: Testing
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test permission flows (grant, deny, error)
- [ ] Test with various locations
- [ ] Test distance calculations

### Step 6.2: Refinement
- [ ] Polish UI/UX based on testing
- [ ] Improve error messages
- [ ] Optimize performance
- [ ] Add any missing edge cases

## Technical Stack

### Recommended Packages
- **Leaflet**: `react-leaflet` + `leaflet` (free, no API key) ✅ Selected
- **Routing API**: Use OSRM (free) or GraphHopper (free tier) for driving distance
- **Alternative**: `@mapbox/route-optimizer` if using Mapbox (not needed with Leaflet)

### Utilities
- Distance calculation: Custom Haversine function or library
- Geolocation: Native browser API (`navigator.geolocation`)

## File Structure

```
src/
  components/
    custom/
      LocationMap/
        LocationMap.tsx          # Main map component
        PermissionRequest.tsx    # Permission request UI
        DistanceDisplay.tsx      # Distance calculation & display
        index.ts                 # Exports
  lib/
    utils/
      distance.ts               # Distance calculation utilities
      geolocation.ts            # Geolocation helpers
```

## Environment Variables

```env
# Optional: If using external routing API (OSRM/GraphHopper)
# Most routing APIs are free and don't require keys for basic usage
# OSRM: No key needed (public instance)
# GraphHopper: Free tier available, optional API key
```

## Estimated Timeline

- **Phase 1**: 1-2 hours (Schema & Data)
- **Phase 2**: 3-4 hours (Map Component)
- **Phase 3**: 2-3 hours (Permission & User Location)
- **Phase 4**: 1-2 hours (Distance Calculation)
- **Phase 5**: 2-3 hours (Integration & Polish)
- **Phase 6**: 2-3 hours (Testing & Refinement)

**Total**: ~11-17 hours

## Dependencies

- Mapping library (Leaflet/Google Maps/Mapbox)
- React hooks for geolocation
- Distance calculation utility
- Sanity client (already installed)

## Risks & Mitigation

1. **Geolocation not available**: Show map with Pooja's location only
2. **API key costs**: Use free option (Leaflet + OpenStreetMap)
3. **HTTPS requirement**: Ensure production uses HTTPS
4. **Browser compatibility**: Test on major browsers
5. **Privacy concerns**: Clear messaging, opt-in only
