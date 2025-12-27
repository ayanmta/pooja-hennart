# Feature Specification: Location Map Section

**Feature ID**: 004-location-map  
**Date**: 2025-01-XX  
**Status**: Draft

## Overview

Add an interactive map section that displays Pooja's location and, with user permission, shows the user's location and calculates the distance between them. The permission request should be polite and user-friendly.

## User Stories

### Primary User Story
**As a** potential client  
**I want to** see Pooja's location on a map and find my distance from her location  
**So that** I can plan my visit and understand how far I need to travel

### Secondary User Stories
1. **As a** user  
   **I want to** see Pooja's location on a map  
   **So that** I know where to go for appointments

2. **As a** user  
   **I want to** see my distance from Pooja's location  
   **So that** I can estimate travel time 

3. **As a** user  
   **I want to** be asked politely for location permission  
   **So that** I feel comfortable sharing my location

## Functional Requirements

### FR1: Map Display
- **FR1.1**: Display an interactive map showing Pooja's location
- **FR1.2**: Show a marker/pin at Pooja's location
- **FR1.3**: Map should be responsive (mobile, tablet, desktop)
- **FR1.4**: Map should support zoom and pan interactions
- **FR1.5**: Map should show address or location name if available

### FR2: Location Permission
- **FR2.1**: Automatically request user's location permission 10 seconds after page load
- **FR2.2**: Show a short, friendly description: **"Help Pooja reach you - Find your distance from Pooja's location"**
- **FR2.3**: Permission request appears as a card/banner above the map
- **FR2.4**: Handle permission granted, denied, and error states gracefully
- **FR2.5**: Ask permission only once per session (store preference in sessionStorage)
- **FR2.6**: If user denies, don't ask again in the same session
- **FR2.7**: Frame as helping Pooja, NOT as "sharing location" (avoid suspicious language)

### FR3: User Location Display
- **FR3.1**: If permission granted, show user's location on the map
- **FR3.2**: Display a marker/pin for user's location (different from Pooja's marker)
- **FR3.3**: Show a line/path connecting the two locations
- **FR3.4**: Display distance in kilometers and time to travel 
- **FR3.5**: Display estimated travel time (optional, if possible)

### FR4: Distance Calculation
- **FR4.1**: Calculate driving distance (car) using mapping API
- **FR4.2**: Use mapping service API for accurate driving distance and route
- **FR4.3**: Display distance in kilometers (km)
- **FR4.4**: Display estimated travel time (in hours and minutes)
- **FR4.5**: Update distance and time if user location changes (if permission persists)

### FR5: Privacy & UX
- **FR5.1**: Auto-request permission 10 seconds after page load (one-time per session)
- **FR5.2**: Show clear, friendly explanation: "Help Pooja reach you - Find your distance from Pooja's location"
- **FR5.3**: Store user location preference in sessionStorage (don't ask again if denied)
- **FR5.4**: After location is fetched, show optional contact form: "Would you like to share your name and number so Pooja can reach out to you?"
- **FR5.5**: Store user location + optional name/phone in Sanity via public API endpoint
- **FR5.6**: Show loading states during location fetch and distance calculation
- **FR5.7**: Allow user to skip contact form (optional)
- **FR5.8**: Show success message after location is shared

### FR6: Location Tracking & Storage
- **FR6.1**: Store user location in Sanity CMS via `/api/location/share` endpoint
- **FR6.2**: Store: latitude, longitude, distance (km), travel time (minutes), timestamp
- **FR6.3**: Store optional: user name, user phone number
- **FR6.4**: Public endpoint (no authentication required for submission)
- **FR6.5**: Pooja can view all location shares in Sanity Studio
- **FR6.6**: Display format: List/table with name, phone, distance, time, date

## Technical Requirements

### TR1: Map Library
- **TR1.1**: Use Leaflet + OpenStreetMap (free, no API key required)
- **TR1.2**: Support both web and mobile browsers
- **TR1.3**: No API key needed (OpenStreetMap is free)
- **TR1.4**: Support custom branded markers for Pooja's location
- **TR1.5**: Use routing API (OSRM or GraphHopper) for driving distance calculation

### TR2: Geolocation API
- **TR2.1**: Use browser Geolocation API (`navigator.geolocation`)
- **TR2.2**: Handle HTTPS requirement for geolocation
- **TR2.3**: Support error handling (permission denied, timeout, unavailable)
- **TR2.4**: Implement timeout for location requests

### TR3: Distance Calculation
- **TR3.1**: Use routing API (OSRM or GraphHopper) for driving distance calculation
- **TR3.2**: Calculate driving route between user and Pooja's location
- **TR3.3**: Format distance with appropriate precision (e.g., "5.2 km")
- **TR3.4**: Calculate estimated travel time based on route and average speed
- **TR3.5**: Format time as "X hours Y minutes" or "Y minutes" if less than 1 hour

### TR4: Data Storage
- **TR4.1**: Store Pooja's location in Sanity CMS (contact schema)
- **TR4.2**: Store coordinates (latitude, longitude)
- **TR4.3**: Store address (optional, for display)
- **TR4.4**: Store user location shares in new `userLocationShare` document type
- **TR4.5**: Store user location: latitude, longitude, distance, travel time, timestamp
- **TR4.6**: Store optional user contact: name, phone number
- **TR4.7**: Use Sanity write token (server-side only, in API route)

### TR5: Performance
- **TR5.1**: Lazy load map component
- **TR5.2**: Optimize map rendering for mobile devices
- **TR5.3**: Cache map tiles appropriately
- **TR5.4**: Minimize API calls

## Design Requirements

### DR1: Permission Request UI
- **DR1.1**: Auto-appear 10 seconds after page load (card/banner above map)
- **DR1.2**: Friendly description: **"Help Pooja reach you - Find your distance from Pooja's location"**
- **DR1.3**: Show as a card/banner above the map
- **DR1.4**: Auto-dismiss after permission granted or denied
- **DR1.5**: Only show once per session (use sessionStorage to track)
- **DR1.6**: Match site's design language
- **DR1.7**: Avoid using words like "share" or "track" - frame as helping

### DR5: Contact Form UI
- **DR5.1**: Show after location is fetched and distance displayed
- **DR5.2**: Message: "Would you like to share your name and number so Pooja can reach out to you?"
- **DR5.3**: Form fields: Name (optional), Phone Number (optional)
- **DR5.4**: Submit button: "Share with Pooja"
- **DR5.5**: Skip button: "Skip" (allows user to dismiss)
- **DR5.6**: Show loading state during submission
- **DR5.7**: Show success message after submission
- **DR5.8**: Form disappears after successful submission

### DR2: Map Display
- **DR2.1**: Full-width section (no max-width container)
- **DR2.2**: Minimum height: 400px (mobile), 500px (desktop)
- **DR2.3**: Rounded corners to match site design
- **DR2.4**: Custom branded markers for Pooja's location
- **DR2.5**: Show address text below the map
- **DR2.6**: Responsive: full-width on all screen sizes

### DR3: Distance Display
- **DR3.1**: Show distance and travel time prominently when available
- **DR3.2**: Display distance in kilometers (km) only
- **DR3.3**: Display estimated travel time (e.g., "45 minutes" or "1 hour 30 minutes")
- **DR3.4**: Use clear typography
- **DR3.5**: Show loading state while calculating distance and time
- **DR3.6**: Display below the map or as overlay on map

### DR4: Responsive Design
- **DR4.1**: Full width on all devices (mobile, tablet, desktop)
- **DR4.2**: No max-width container (full-width section)
- **DR4.3**: Touch-friendly controls on mobile
- **DR4.4**: Proper spacing and padding
- **DR4.5**: Embedded map (scrollable) on mobile

## Data Model

### Sanity Schema Addition

```typescript
// Add to contact schema or create location schema
{
  name: "location",
  title: "Location",
  type: "object",
  fields: [
    {
      name: "address",
      title: "Address",
      type: "string",
      description: "Full address for display"
    },
    {
      name: "latitude",
      title: "Latitude",
      type: "number",
      description: "Latitude coordinate",
      validation: Rule => Rule.required().min(-90).max(90)
    },
    {
      name: "longitude",
      title: "Longitude",
      type: "number",
      description: "Longitude coordinate",
      validation: Rule => Rule.required().min(-180).max(180)
    },
    {
      name: "showOnMap",
      title: "Show on Map",
      type: "boolean",
      description: "Display location on website map",
      initialValue: true
    }
  ]
}
```

## Component Structure

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

### Features
- Map initialization
- Permission request UI
- User location fetching
- Distance calculation
- Marker rendering
- Error handling

## User Flow

1. **Initial State**: Map loads showing only Pooja's location with custom branded marker
2. **Auto Permission Request (10 seconds)**: 
   - Permission request card appears above map
   - Friendly message: **"Help Pooja reach you - Find your distance from Pooja's location"**
   - Browser permission dialog appears automatically
   - Card auto-dismisses after user decision
3. **Permission Granted**: 
   - User location fetched
   - User marker appears on map (different style from Pooja's marker)
   - Driving route calculated using routing API
   - Distance (km) and travel time displayed
   - Route path drawn between locations
   - Address text shown below map
   - **Contact Form Appears**: "Would you like to share your name and number so Pooja can reach out to you?"
4. **User Submits Contact Info (Optional)**:
   - User fills name and/or phone (both optional)
   - Clicks "Share with Pooja"
   - Location + contact info saved to Sanity via API
   - Success message shown
   - Form disappears
5. **User Skips Contact Form**:
   - User clicks "Skip"
   - Form disappears
   - Location still displayed on map (but not saved)
6. **Permission Denied**: 
   - Card disappears (won't ask again this session)
   - Map still shows Pooja's location
   - No contact form shown
   - No error message (graceful degradation)
7. **Error State**: 
   - Show friendly error message
   - Allow manual retry if needed

## Implementation Considerations

### Map Service Options
1. **Google Maps**: Most popular, good documentation, requires API key
2. **Mapbox**: Modern, customizable, requires API key
3. **Leaflet + OpenStreetMap**: Free, open-source, no API key needed
4. **Apple Maps** (if iOS-specific): Native iOS support

### Recommendation
- **Leaflet + OpenStreetMap** for free, no API key solution
- **Google Maps** if budget allows and need advanced features

### Security
- Store API keys in environment variables
- Never expose API keys in client-side code
- Use server-side proxy for sensitive operations if needed

### Accessibility
- Provide alternative text for map
- Keyboard navigation support
- Screen reader announcements for distance
- High contrast mode support

## Success Metrics

- Map loads successfully on all devices
- Permission request is clear and non-intrusive
- Distance calculation is accurate
- No performance issues on mobile
- User engagement with location feature

## Future Enhancements

- Directions/route planning
- Multiple location support (studio, home, etc.)
- Travel time estimation
- Public transport options
- Save favorite locations
- Share location via WhatsApp/other apps

## Clarifications Received

1. **Mapping Service**: Leaflet + OpenStreetMap (free, no API key)
2. **Distance Type**: Driving distance (car) using routing API
3. **Map Placement**: Both contact page AND homepage
4. **Travel Time**: Yes, show estimated travel time
5. **Permission**: Auto-request 10 seconds after load, friendly description, asked only once per session
6. **Layout**: Full-width section
7. **Design**: Custom branded markers, address text below map
8. **Location Tracking**: Store user location + optional name/phone in Sanity via public API endpoint
9. **Permission Message**: "Help Pooja reach you" (NOT "share your location" - avoid suspicious language)
10. **Contact Form**: Optional name and phone after location is fetched
11. **Admin View**: Pooja views all location shares in Sanity Studio

## Implementation Notes

- Use OSRM or GraphHopper API for driving distance calculation (free routing APIs)
- Auto-permission request with 10-second delay
- SessionStorage to track if permission was already requested
- Display both distance (km) and travel time
- Show on both contact page and homepage
