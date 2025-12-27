# Location Tracking - Clarification Questions

**Feature**: 004-location-map  
**Date**: 2025-01-XX  
**Status**: Questions for User

## Overview

You want to track and display user locations to Pooja. This requires storing location data and creating an interface for Pooja to view it. Please answer the following questions to design the system properly.

---

## 1. User Identification

**Question**: How should we identify users who share their location?

**Options:**
- **A) Anonymous** - No identification, just track location and timestamp
- **B) Optional Name/Email** - Ask user if they want to provide name/email (optional)
- **C) Required Name/Email** - Require name/email before showing distance
- **D) Session-based** - Track by session ID (anonymous but unique per visit)
- **E) IP-based** - Track by IP address (less accurate, privacy concerns)

**Recommendation**: **B (Optional Name/Email)** - Allows users to optionally identify themselves while maintaining privacy for those who don't want to share.

**Your Answer**: _______________

---

## 2. Where Should Pooja View Locations?

**Question**: Where should Pooja be able to see the shared locations?

**Options:**
- **A) Sanity Studio** - Add a new document type in Sanity Studio to view locations
- **B) Admin Dashboard Page** - Create a new `/admin/locations` page (requires authentication)
- **C) Contact Page (Admin View)** - Show locations on contact page when logged in
- **D) Email Notifications** - Send email to Pooja when someone shares location
- **E) Multiple** - Combination of above (e.g., Sanity Studio + Dashboard)

**Recommendation**: **E (Sanity Studio + Dashboard)** - Sanity Studio for content management, dashboard for quick viewing.

**Your Answer**: _______________

---

## 3. Privacy & Consent

**Question**: How should we handle user consent for location tracking?

**Options:**
- **A) Explicit Consent** - Show clear message: "Share your location with Pooja to see distance" (separate from distance calculation)
- **B) Implicit Consent** - If user grants location permission, assume they consent to sharing
- **C) Two-Step Permission** - First ask for location (for distance), then ask separately if they want to share with Pooja
- **D) Opt-in Checkbox** - "Share my location with Pooja" checkbox (unchecked by default)

**Recommendation**: **C (Two-Step Permission)** - Most transparent and privacy-friendly.

**Your Answer**: _______________

---

## 4. Data to Store

**Question**: What information should we store for each location share?

**Options:**
- **A) Minimal** - Just latitude, longitude, timestamp
- **B) Standard** - Location, timestamp, distance from Pooja, travel time
- **C) Extended** - Location, timestamp, distance, travel time, user name/email (if provided), IP address
- **D) Full** - All of C + user agent, referrer, session ID

**Recommendation**: **B (Standard)** - Essential data without privacy concerns.

**Your Answer**: _______________

---

## 5. Data Retention

**Question**: How long should we keep location data?

**Options:**
- **A) Forever** - Keep all location shares indefinitely
- **B) 30 Days** - Delete after 30 days
- **C) 90 Days** - Delete after 90 days
- **D) 1 Year** - Delete after 1 year
- **E) User-Controlled** - Allow users to request deletion

**Recommendation**: **C (90 Days)** - Balance between usefulness and privacy.

**Your Answer**: _______________

---

## 6. Authentication for Admin View

**Question**: How should Pooja authenticate to view locations?

**Options:**
- **A) Sanity Login** - Use existing Sanity Studio login (if viewing in Studio)
- **B) Next.js Auth** - Implement authentication (NextAuth.js, Clerk, etc.)
- **C) Password Protection** - Simple password-protected page
- **D) No Auth** - Public page (not recommended for privacy)

**Recommendation**: **A (Sanity Login)** - If using Sanity Studio, or **B (Next.js Auth)** for dashboard.

**Your Answer**: _______________

---

## 7. Display Format for Pooja

**Question**: How should locations be displayed to Pooja?

**Options:**
- **A) List View** - Simple list with location, distance, timestamp
- **B) Map View** - Interactive map showing all user locations
- **C) Table View** - Sortable table with filters
- **D) Combined** - Map + list/table view
- **E) Dashboard** - Statistics (total shares, average distance, recent shares)

**Recommendation**: **D (Combined)** - Map for visual, list/table for details.

**Your Answer**: _______________

---

## 8. Notifications

**Question**: Should Pooja be notified when someone shares their location?

**Options:**
- **A) No Notifications** - Pooja checks manually
- **B) Email Notifications** - Send email when location is shared
- **C) Real-time** - WebSocket/polling for real-time updates (complex)
- **D) Daily Digest** - Email summary of all shares in last 24 hours

**Recommendation**: **B (Email Notifications)** - Simple and effective.

**Your Answer**: _______________

---

## 9. Privacy Policy & Legal

**Question**: Do you have a privacy policy that covers location data?

**Options:**
- **A) Yes** - Privacy policy exists, will update it
- **B) No** - Need to create one
- **C) Not Sure** - Will check

**Recommendation**: **B (Create Privacy Policy)** - Required for GDPR/CCPA compliance.

**Your Answer**: _______________

---

## 10. Multiple Locations per User

**Question**: If a user shares location multiple times, how should we handle it?

**Options:**
- **A) Store All** - Keep all location shares (track movement over time)
- **B) Update Latest** - Only keep the most recent location per user
- **C) One Per Session** - One location per user session
- **D) User Choice** - Let user decide if they want to update or add new

**Recommendation**: **A (Store All)** - Useful for understanding user patterns.

**Your Answer**: _______________

---

## Summary of Recommendations

Based on best practices, here's what I recommend:

1. **User Identification**: Optional name/email
2. **Viewing Interface**: Sanity Studio + Admin Dashboard
3. **Consent**: Two-step permission (location first, then sharing consent)
4. **Data Stored**: Location, timestamp, distance, travel time, optional name/email
5. **Retention**: 90 days
6. **Authentication**: Sanity login (Studio) or NextAuth.js (Dashboard)
7. **Display**: Combined map + list/table view
8. **Notifications**: Email notifications
9. **Privacy Policy**: Create/update privacy policy
10. **Multiple Shares**: Store all location shares

---

## Next Steps

Once you answer these questions, I will:
1. Update the specification document
2. Update the data model (Sanity schema)
3. Create API routes for storing locations
4. Design the admin interface
5. Update the implementation plan

Please provide your answers, and I'll proceed with the implementation design.
