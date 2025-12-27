# Location Tracking Implementation Summary

**Feature**: 004-location-map (Location Tracking)  
**Date**: 2025-01-XX  
**Status**: Ready for Implementation

## What Changed

Based on your requirements, the location map feature now includes **location tracking** where users can optionally share their location and contact information with Pooja.

## Key Changes

### 1. Permission Request Message
- **Before**: "Find your distance from Pooja's house"
- **After**: **"Help Pooja reach you - Find your distance from Pooja's location"**
- **Why**: Friendly, helpful framing (not "sharing location")

### 2. Contact Form (New)
- Appears after location is fetched
- Message: "Would you like to share your name and number so Pooja can reach out to you?"
- Fields: Name (optional), Phone (optional)
- User can skip or submit

### 3. Data Storage (New)
- **New Sanity Schema**: `userLocationShare`
- **Public API Endpoint**: `/api/location/share` (no login required)
- **Stores**: Location, distance, travel time, timestamp, optional name/phone

### 4. Admin View (New)
- Pooja can view all location shares in **Sanity Studio**
- List/table view with sorting and filtering
- Shows: Name, Phone, Distance, Time, Date

## Files Created/Updated

### New Files
1. `sanity/schemas/userLocationShare.ts` - New Sanity schema
2. `specs/004-location-map/location-tracking-spec.md` - Detailed tracking spec
3. `specs/004-location-map/implementation-summary.md` - This file

### Updated Files
1. `sanity/schemas/index.ts` - Added userLocationShare to exports
2. `specs/004-location-map/spec.md` - Updated with tracking requirements
3. `specs/004-location-map/data-model.md` - Updated data structures

### Files to Create (During Implementation)
1. `src/app/api/location/share/route.ts` - API endpoint for storing locations
2. `src/components/custom/LocationMap/ContactForm.tsx` - Contact form component
3. Update `src/components/custom/LocationMap/LocationMap.tsx` - Add contact form flow

## Implementation Steps

### Phase 1: Sanity Schema
- [x] Create `userLocationShare` schema
- [x] Add to schema exports
- [ ] Deploy schema: `npx sanity schema deploy`
- [ ] Test in Sanity Studio

### Phase 2: API Route
- [ ] Create `/api/location/share` endpoint
- [ ] Add Sanity write token to environment variables
- [ ] Implement data validation
- [ ] Add rate limiting (prevent spam)
- [ ] Test endpoint

### Phase 3: Contact Form Component
- [ ] Create `ContactForm.tsx`
- [ ] Add form fields (name, phone)
- [ ] Add submit and skip buttons
- [ ] Add loading states
- [ ] Add success/error messages

### Phase 4: Update LocationMap Component
- [ ] Update permission request message
- [ ] Add contact form state
- [ ] Show form after location fetched
- [ ] Integrate API call
- [ ] Handle form submission

### Phase 5: Testing
- [ ] Test permission flow
- [ ] Test form submission
- [ ] Test API endpoint
- [ ] Test Sanity Studio view
- [ ] Test on mobile devices

## Environment Variables Needed

Add to `.env.local`:

```env
# Sanity Write Token (for API route)
SANITY_API_WRITE_TOKEN=your-write-token-here
```

**How to get write token:**
1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Create a new token with **Editor** permissions
5. Copy the token to `.env.local`

## User Flow Summary

1. Map loads → Shows Pooja's location
2. After 10 seconds → Permission card: "Help Pooja reach you..."
3. User grants permission → Location fetched, distance shown
4. Contact form appears → "Would you like to share your name and number..."
5. User submits (optional) → Data saved to Sanity
6. Pooja views in Studio → Sees all location shares

## Privacy & Consent

- ✅ **Explicit consent**: User grants location permission
- ✅ **Optional contact**: User can skip name/phone
- ✅ **Clear purpose**: "So Pooja can reach out to you"
- ✅ **No suspicious language**: "Help Pooja reach you" (not "share location")
- ✅ **Transparent**: User knows data is stored when they submit

## Next Steps

1. Review the updated specification
2. Deploy Sanity schema
3. Implement API route
4. Implement contact form
5. Update LocationMap component
6. Test end-to-end flow

## Questions?

See:
- `location-tracking-spec.md` - Detailed specification
- `spec.md` - Full feature specification
- `data-model.md` - Data structures
