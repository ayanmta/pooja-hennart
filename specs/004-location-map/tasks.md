# Implementation Tasks: Location Map Section

**Feature**: 004-location-map  
**Date**: 2025-01-XX  
**Status**: Ready for Implementation

## Task Breakdown

### Phase 1: Data Model & Sanity Setup (2-3 hours)

#### Task 1.1: Update Sanity Contact Schema
- [ ] Open `sanity/schemas/contact.ts`
- [ ] Add location object field with:
  - `address` (string, optional)
  - `latitude` (number, required, -90 to 90)
  - `longitude` (number, required, -180 to 180)
  - `showOnMap` (boolean, default: true)
- [ ] Add validation rules for coordinates
- [ ] Test schema in Sanity Studio
- [ ] Verify schema compiles without errors

**Files to modify:**
- `sanity/schemas/contact.ts`

**Acceptance Criteria:**
- Location fields appear in Sanity Studio
- Validation prevents invalid coordinates
- Schema saves successfully

---

#### Task 1.2: Add Location Data in Sanity
- [ ] Open Sanity Studio
- [ ] Navigate to Contact document
- [ ] Enter Pooja's location:
  - Address (e.g., "Mumbai, Maharashtra, India")
  - Latitude (e.g., 19.0760)
  - Longitude (e.g., 72.8777)
- [ ] Set `showOnMap` to `true`
- [ ] Save and verify data

**Acceptance Criteria:**
- Location data saved in Sanity
- Coordinates are valid
- Address is readable

---

#### Task 1.3: Update Sanity Query
- [ ] Open `src/lib/sanity/queries.ts`
- [ ] Update `getContact()` query to include location fields
- [ ] Add location projection:
  ```groq
  location {
    address,
    latitude,
    longitude,
    showOnMap
  }
  ```
- [ ] Test query returns location data
- [ ] Handle missing location gracefully (optional chaining)

**Files to modify:**
- `src/lib/sanity/queries.ts`

**Acceptance Criteria:**
- Query returns location data
- Handles missing location without errors
- TypeScript types are correct

---

### Phase 2: Map Library Setup (1-2 hours)

#### Task 2.1: Install Dependencies
- [ ] Install Leaflet: `npm install react-leaflet leaflet`
- [ ] Install Leaflet types: `npm install -D @types/leaflet`
- [ ] Install routing library: `npm install osrm-text-instructions` (optional, for route instructions)
- [ ] Verify packages installed correctly

**Commands:**
```bash
npm install react-leaflet leaflet
npm install -D @types/leaflet
```

**Acceptance Criteria:**
- Packages installed without errors
- No TypeScript errors
- Dependencies in package.json

---

#### Task 2.2: Configure Leaflet CSS
- [ ] Import Leaflet CSS in `src/app/globals.css` or component
- [ ] Add: `@import 'leaflet/dist/leaflet.css';`
- [ ] Verify map tiles load correctly
- [ ] Test on different screen sizes

**Files to modify:**
- `src/app/globals.css` or component file

**Acceptance Criteria:**
- Map styles load correctly
- No CSS conflicts
- Map renders properly

---

#### Task 2.3: Create Map Utilities
- [ ] Create `src/lib/utils/distance.ts`
- [ ] Add function to format travel time (seconds to "X hours Y minutes")
- [ ] Add function to format distance (meters to "X.X km")
- [ ] Add routing API helper function (OSRM/GraphHopper)
- [ ] Test utility functions

**Files to create:**
- `src/lib/utils/distance.ts`

**Functions needed:**
```typescript
formatTravelTime(seconds: number): string
formatDistance(meters: number): string
calculateDrivingRoute(userLat, userLon, poojaLat, poojaLon): Promise<RouteResult>
```

**Acceptance Criteria:**
- Functions work correctly
- Handles edge cases (0 distance, very long times)
- TypeScript types are correct

---

### Phase 3: Core Map Component (4-5 hours)

#### Task 3.1: Create LocationMap Component Structure
- [ ] Create `src/components/custom/LocationMap/LocationMap.tsx`
- [ ] Set up basic component with props interface
- [ ] Add Leaflet map container
- [ ] Initialize map with Pooja's location
- [ ] Add custom branded marker for Pooja's location
- [ ] Make map responsive (full-width)

**Files to create:**
- `src/components/custom/LocationMap/LocationMap.tsx`
- `src/components/custom/LocationMap/index.ts`

**Component structure:**
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

**Acceptance Criteria:**
- Map displays Pooja's location
- Custom marker appears correctly
- Map is responsive
- No console errors

---

#### Task 3.2: Add Map Styling & Custom Markers
- [ ] Create custom marker icon for Pooja's location
- [ ] Use brand colors or custom icon
- [ ] Style map container (rounded corners, shadows)
- [ ] Ensure full-width layout
- [ ] Add minimum height (400px mobile, 500px desktop)

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**Acceptance Criteria:**
- Custom marker is visible and branded
- Map styling matches site design
- Full-width on all devices

---

#### Task 3.3: Add Address Display
- [ ] Display address text below the map
- [ ] Style address text appropriately
- [ ] Handle missing address gracefully
- [ ] Make address responsive

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**Acceptance Criteria:**
- Address displays below map
- Styled consistently with site
- Handles missing address

---

### Phase 4: Permission & User Location (3-4 hours)

#### Task 4.1: Create Permission Request Component
- [ ] Create `src/components/custom/LocationMap/PermissionRequest.tsx`
- [ ] Design card/banner above map
- [ ] Add short message: "Find your distance from Pooja's house"
- [ ] Style to match site design
- [ ] Add auto-dismiss functionality

**Files to create:**
- `src/components/custom/LocationMap/PermissionRequest.tsx`

**Component props:**
```typescript
interface PermissionRequestProps {
  onRequest: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}
```

**Acceptance Criteria:**
- Card appears above map
- Message is clear and friendly
- Styled correctly
- Can be dismissed

---

#### Task 4.2: Implement Auto-Permission Request (10s delay)
- [ ] Add useEffect hook with 10-second timer
- [ ] Check sessionStorage for previous permission request
- [ ] Show permission request card after 10 seconds
- [ ] Auto-trigger browser permission dialog
- [ ] Store request status in sessionStorage
- [ ] Don't ask again if already asked this session

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**Logic:**
```typescript
useEffect(() => {
  const hasAsked = sessionStorage.getItem('location-permission-asked');
  if (!hasAsked) {
    const timer = setTimeout(() => {
      requestLocation();
      sessionStorage.setItem('location-permission-asked', 'true');
    }, 10000);
    return () => clearTimeout(timer);
  }
}, []);
```

**Acceptance Criteria:**
- Permission request appears after 10 seconds
- Only asks once per session
- Browser dialog appears automatically
- sessionStorage tracks request

---

#### Task 4.3: Implement Geolocation API
- [ ] Add geolocation request function
- [ ] Handle permission granted state
- [ ] Handle permission denied state
- [ ] Handle error states (timeout, unavailable)
- [ ] Add loading states
- [ ] Store user location in component state

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**Functions needed:**
```typescript
requestUserLocation(): Promise<GeolocationPosition>
handlePermissionGranted(position: GeolocationPosition)
handlePermissionDenied()
handleError(error: GeolocationPositionError)
```

**Acceptance Criteria:**
- Location fetched successfully
- All error states handled
- Loading states shown
- User location stored in state

---

#### Task 4.4: Display User Location on Map
- [ ] Add user location marker (different from Pooja's marker)
- [ ] Show user marker when location available
- [ ] Use different color/style for user marker
- [ ] Update map bounds to show both locations
- [ ] Add zoom controls if needed

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**Acceptance Criteria:**
- User marker appears on map
- Different from Pooja's marker
- Map zooms to show both locations
- Markers are clearly distinguishable

---

### Phase 5: Distance & Route Calculation (3-4 hours)

#### Task 5.1: Integrate Routing API
- [ ] Choose routing API (OSRM recommended - free, no key)
- [ ] Create API helper function
- [ ] Implement route calculation between user and Pooja's location
- [ ] Extract distance and duration from route response
- [ ] Handle API errors gracefully

**Files to create/modify:**
- `src/lib/utils/distance.ts`
- `src/components/custom/LocationMap/LocationMap.tsx`

**API endpoint (OSRM):**
```
https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false&alternatives=false&steps=false
```

**Acceptance Criteria:**
- Route calculated successfully
- Distance extracted correctly
- Duration extracted correctly
- Errors handled gracefully

---

#### Task 5.2: Display Route on Map
- [ ] Draw route path/line between locations
- [ ] Style route line (color, width)
- [ ] Show route when both locations available
- [ ] Update route if user location changes

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**Leaflet component:**
```typescript
<Polyline positions={routeCoordinates} color="blue" weight={3} />
```

**Acceptance Criteria:**
- Route line appears on map
- Connects both locations
- Styled appropriately
- Updates when location changes

---

#### Task 5.3: Create Distance Display Component
- [ ] Create `src/components/custom/LocationMap/DistanceDisplay.tsx`
- [ ] Display distance in kilometers (e.g., "5.2 km")
- [ ] Display travel time (e.g., "45 minutes" or "1 hour 30 minutes")
- [ ] Add loading state
- [ ] Style prominently but elegantly
- [ ] Position below map or as overlay

**Files to create:**
- `src/components/custom/LocationMap/DistanceDisplay.tsx`

**Component props:**
```typescript
interface DistanceDisplayProps {
  distance: number; // in kilometers
  travelTime: number; // in seconds
  isLoading?: boolean;
}
```

**Acceptance Criteria:**
- Distance and time displayed correctly
- Formatted nicely
- Loading state shown
- Styled appropriately

---

#### Task 5.4: Format Distance & Time
- [ ] Format distance: "X.X km" (1 decimal place)
- [ ] Format time: "X hours Y minutes" or "Y minutes"
- [ ] Handle edge cases (0 distance, very long times)
- [ ] Test with various values

**Files to modify:**
- `src/lib/utils/distance.ts`

**Functions:**
```typescript
formatDistance(km: number): string // "5.2 km"
formatTravelTime(seconds: number): string // "45 minutes" or "1 hour 30 minutes"
```

**Acceptance Criteria:**
- Formats correctly
- Handles all edge cases
- Readable output

---

### Phase 6: Page Integration (2-3 hours)

#### Task 6.1: Add Map to Contact Page
- [ ] Open `src/app/contact/ContactClient.tsx`
- [ ] Import LocationMap component
- [ ] Add map section below contact form/social links
- [ ] Pass location data from contact query
- [ ] Add AnimatedSection wrapper
- [ ] Test map displays correctly

**Files to modify:**
- `src/app/contact/ContactClient.tsx`
- `src/app/contact/page.tsx` (if needed for data fetching)

**Acceptance Criteria:**
- Map appears on contact page
- Location data passed correctly
- Section spacing is correct
- No layout issues

---

#### Task 6.2: Add Map to Homepage
- [ ] Open `src/app/(site)/HomeClient.tsx`
- [ ] Import LocationMap component
- [ ] Add map section (new section)
- [ ] Pass location data from contact query
- [ ] Add AnimatedSection wrapper
- [ ] Add section header if needed
- [ ] Test map displays correctly

**Files to modify:**
- `src/app/(site)/HomeClient.tsx`
- `src/app/(site)/page.tsx` (if needed for data fetching)

**Acceptance Criteria:**
- Map appears on homepage
- Location data passed correctly
- Section spacing is correct
- No layout issues

---

#### Task 6.3: Handle Missing Location Data
- [ ] Check if location data exists before rendering map
- [ ] Show fallback message if location not configured
- [ ] Don't break page if location missing
- [ ] Add conditional rendering

**Files to modify:**
- `src/app/contact/ContactClient.tsx`
- `src/app/(site)/HomeClient.tsx`
- `src/components/custom/LocationMap/LocationMap.tsx`

**Acceptance Criteria:**
- Handles missing location gracefully
- No errors if location not set
- User-friendly fallback message

---

### Phase 7: Error Handling & Polish (2-3 hours)

#### Task 7.1: Error Handling
- [ ] Handle geolocation errors (permission denied, timeout, unavailable)
- [ ] Handle routing API errors
- [ ] Show user-friendly error messages
- [ ] Allow retry on errors
- [ ] Log errors for debugging

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**Error cases:**
- Permission denied
- Location timeout
- Location unavailable
- Routing API failure
- Network errors

**Acceptance Criteria:**
- All errors handled gracefully
- User-friendly messages
- Retry option available
- No console errors

---

#### Task 7.2: Loading States
- [ ] Add loading state for map initialization
- [ ] Add loading state for location fetch
- [ ] Add loading state for route calculation
- [ ] Show spinners or skeletons
- [ ] Prevent interaction during loading

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`
- `src/components/custom/LocationMap/DistanceDisplay.tsx`

**Acceptance Criteria:**
- Loading states visible
- User knows what's happening
- No interaction during loading

---

#### Task 7.3: Performance Optimization
- [ ] Lazy load map component
- [ ] Optimize map rendering
- [ ] Minimize re-renders
- [ ] Cache route calculations if possible
- [ ] Test on mobile devices

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`
- Import locations

**Optimizations:**
- Use `React.lazy()` for map component
- Memoize route calculations
- Debounce location updates
- Optimize marker rendering

**Acceptance Criteria:**
- Fast load times
- Smooth interactions
- Good performance on mobile

---

#### Task 7.4: Accessibility
- [ ] Add ARIA labels to map
- [ ] Ensure keyboard navigation
- [ ] Add screen reader announcements
- [ ] Test with screen readers
- [ ] Add alternative text for markers

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**ARIA attributes:**
```typescript
<div role="application" aria-label="Interactive map showing Pooja's location">
  {/* Map */}
</div>
```

**Acceptance Criteria:**
- Accessible to screen readers
- Keyboard navigable
- ARIA labels present

---

### Phase 8: Testing & Refinement (2-3 hours)

#### Task 8.1: Browser Testing
- [ ] Test on Chrome
- [ ] Test on Safari
- [ ] Test on Firefox
- [ ] Test on mobile browsers (iOS Safari, Chrome Android)
- [ ] Verify geolocation works on all browsers

**Acceptance Criteria:**
- Works on all major browsers
- Geolocation works on mobile
- No browser-specific issues

---

#### Task 8.2: Device Testing
- [ ] Test on desktop
- [ ] Test on tablet
- [ ] Test on mobile
- [ ] Verify touch interactions
- [ ] Check responsive layout

**Acceptance Criteria:**
- Works on all device sizes
- Touch interactions work
- Responsive layout correct

---

#### Task 8.3: Edge Cases
- [ ] Test with very far locations
- [ ] Test with very close locations
- [ ] Test with invalid coordinates
- [ ] Test permission denied flow
- [ ] Test network errors
- [ ] Test with missing location data

**Acceptance Criteria:**
- All edge cases handled
- No crashes or errors
- Graceful degradation

---

#### Task 8.4: Final Polish
- [ ] Review code for consistency
- [ ] Check TypeScript types
- [ ] Verify no console errors
- [ ] Optimize bundle size
- [ ] Update documentation

**Acceptance Criteria:**
- Code is clean and consistent
- No TypeScript errors
- No console warnings
- Documentation updated

---

## File Structure

```
src/
  components/
    custom/
      LocationMap/
        LocationMap.tsx          # Main component
        PermissionRequest.tsx    # Permission request card
        DistanceDisplay.tsx      # Distance & time display
        ContactForm.tsx          # Contact form (name/phone) ⭐ NEW
        index.ts                 # Exports
  app/
    api/
      location/
        share/
          route.ts              # API endpoint for storing locations ⭐ NEW
    contact/
      ContactClient.tsx         # Add map section
    (site)/
      HomeClient.tsx            # Add map section
  lib/
    utils/
      distance.ts               # Distance & time utilities
      geolocation.ts            # Geolocation helpers (optional)
sanity/
  schemas/
    contact.ts                 # Add location fields
    userLocationShare.ts        # User location shares schema ⭐ NEW
```

## Dependencies

```json
{
  "dependencies": {
    "react-leaflet": "^4.x",
    "leaflet": "^1.x"
  },
  "devDependencies": {
    "@types/leaflet": "^1.x"
  }
}
```

## Environment Variables

```env
# Sanity Write Token (for location tracking API)
SANITY_API_WRITE_TOKEN=your-write-token-here
```

**How to get write token:**
1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Create a new token with **Editor** permissions
5. Copy the token to `.env.local`

**Note**: OSRM routing API is free and doesn't require a key.

### Phase 9: Location Tracking (3-4 hours)

#### Task 9.1: Create User Location Share Schema
- [ ] Schema already created: `sanity/schemas/userLocationShare.ts`
- [ ] Deploy schema: `npx sanity schema deploy`
- [ ] Verify schema appears in Sanity Studio
- [ ] Test creating a test document manually

**Files created:**
- `sanity/schemas/userLocationShare.ts` ✅

**Acceptance Criteria:**
- Schema deployed successfully
- Appears in Sanity Studio sidebar
- Can create test documents

---

#### Task 9.2: Create API Route for Location Sharing
- [ ] Create `src/app/api/location/share/route.ts`
- [ ] Add POST handler
- [ ] Validate request body (latitude, longitude, distance, time)
- [ ] Get Sanity write token from environment
- [ ] Create Sanity client with write token
- [ ] Create document in `userLocationShare` type
- [ ] Return success/error response
- [ ] Add rate limiting (prevent spam)
- [ ] Add input sanitization

**Files to create:**
- `src/app/api/location/share/route.ts`

**Environment variables:**
- `SANITY_API_WRITE_TOKEN` (add to `.env.local`)

**API Request:**
```typescript
POST /api/location/share
Body: {
  latitude: number;
  longitude: number;
  distanceKm: number;
  travelTimeMinutes: number;
  name?: string;
  phone?: string;
}
```

**Acceptance Criteria:**
- API accepts valid requests
- Data stored in Sanity
- Returns success response
- Handles errors gracefully
- Rate limiting works

---

#### Task 9.3: Create Contact Form Component
- [ ] Create `src/components/custom/LocationMap/ContactForm.tsx`
- [ ] Add form fields: Name (optional), Phone (optional)
- [ ] Add "Share with Pooja" submit button
- [ ] Add "Skip" button
- [ ] Add loading state during submission
- [ ] Add success message
- [ ] Add error handling
- [ ] Style to match site design

**Files to create:**
- `src/components/custom/LocationMap/ContactForm.tsx`

**Component props:**
```typescript
interface ContactFormProps {
  onSubmit: (data: { name?: string; phone?: string }) => Promise<void>;
  onSkip: () => void;
  isSubmitting: boolean;
}
```

**Acceptance Criteria:**
- Form displays correctly
- Fields are optional
- Submit calls API
- Skip dismisses form
- Loading states work
- Success/error messages show

---

#### Task 9.4: Update LocationMap Component
- [ ] Update permission request message: "Help Pooja reach you - Find your distance from Pooja's location"
- [ ] Add state for contact form visibility
- [ ] Show contact form after location fetched and distance displayed
- [ ] Integrate ContactForm component
- [ ] Call `/api/location/share` on form submit
- [ ] Handle form submission success/error
- [ ] Update user flow documentation

**Files to modify:**
- `src/components/custom/LocationMap/LocationMap.tsx`

**New state:**
```typescript
const [showContactForm, setShowContactForm] = useState(false);
const [contactFormData, setContactFormData] = useState({ name: "", phone: "" });
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Acceptance Criteria:**
- Permission message updated
- Contact form appears after location fetched
- Form submission works
- Success message shows
- Form disappears after submission

---

#### Task 9.5: Test Location Tracking Flow
- [ ] Test permission request with new message
- [ ] Test location fetch
- [ ] Test contact form appearance
- [ ] Test form submission with name/phone
- [ ] Test form submission without name/phone
- [ ] Test skip functionality
- [ ] Verify data in Sanity Studio
- [ ] Test API endpoint directly
- [ ] Test rate limiting

**Acceptance Criteria:**
- Full flow works end-to-end
- Data appears in Sanity Studio
- All edge cases handled
- No console errors

---

## Estimated Timeline

- **Phase 1**: 2-3 hours (Data Model)
- **Phase 2**: 1-2 hours (Setup)
- **Phase 3**: 4-5 hours (Map Component)
- **Phase 4**: 3-4 hours (Permission & Location)
- **Phase 5**: 3-4 hours (Distance & Route)
- **Phase 6**: 2-3 hours (Integration)
- **Phase 7**: 2-3 hours (Error Handling)
- **Phase 8**: 2-3 hours (Testing)
- **Phase 9**: 3-4 hours (Location Tracking) ⭐ NEW

**Total**: 22-31 hours

## Critical Path

1. Update Sanity schema → Add location data
2. Install Leaflet → Create map component
3. Add permission request → Implement geolocation
4. Integrate routing API → Calculate distance/time
5. Add to pages → Test & polish

## Success Criteria

- ✅ Map displays Pooja's location on both contact page and homepage
- ✅ Permission request appears 10 seconds after load (once per session)
- ✅ Permission message: "Help Pooja reach you - Find your distance from Pooja's location"
- ✅ User location fetched and displayed when permission granted
- ✅ Driving distance and travel time calculated and displayed
- ✅ Route path shown on map
- ✅ Custom branded markers for Pooja's location
- ✅ Address displayed below map
- ✅ Contact form appears after location fetched (optional name/phone)
- ✅ Location + contact info stored in Sanity via API endpoint
- ✅ Pooja can view all location shares in Sanity Studio
- ✅ Full-width responsive layout
- ✅ All error states handled gracefully
- ✅ Works on all major browsers and devices
