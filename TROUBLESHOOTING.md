# Troubleshooting Guide

## Next.js Dev Server Console Errors

### Common Errors

#### "Failed to fetch RSC payload" Errors

These are common in Next.js development and usually don't affect functionality. They occur during:
- Hot Module Replacement (HMR)
- Fast Refresh updates
- Navigation between pages

**Solutions:**

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Restart dev server:**
   - Stop the server (Ctrl+C)
   - Start again: `npm run dev`

3. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
   - Or clear browser cache completely

4. **Check for port conflicts:**
   ```bash
   lsof -ti:3333 | xargs kill -9
   npm run dev
   ```

#### "Some resource load requests were throttled"

This happens when the browser tab is in the background. It's normal and doesn't affect functionality.

**Solution:** Keep the tab active while developing.

### Location Map Issues

#### Map not showing

1. **Check if location data exists in Sanity:**
   - Go to Sanity Studio
   - Open Contact Information document
   - Verify location fields are filled:
     - Latitude (required)
     - Longitude (required)
     - Show on Map: `true`

2. **Check browser console for errors:**
   - Open DevTools (F12)
   - Check Console tab for Leaflet errors

3. **Verify Leaflet CSS is loaded:**
   - Check if `leaflet/dist/leaflet.css` is imported in `globals.css`
   - Map tiles should load from OpenStreetMap

#### Permission request not appearing

1. **Check sessionStorage:**
   - Open DevTools → Application → Session Storage
   - Look for `location-permission-asked`
   - Delete it to test again

2. **Check browser permissions:**
   - Browser may have blocked location access
   - Check browser settings for location permissions

#### API endpoint errors

1. **Check environment variable:**
   ```bash
   # Verify SANITY_API_WRITE_TOKEN is set
   echo $SANITY_API_WRITE_TOKEN
   ```

2. **Test API endpoint:**
   ```bash
   curl -X POST http://localhost:3333/api/location/share \
     -H "Content-Type: application/json" \
     -d '{
       "latitude": 19.0760,
       "longitude": 72.8777,
       "distanceKm": 5.2,
       "travelTimeMinutes": 45
     }'
   ```

3. **Check rate limiting:**
   - API limits to 5 requests per minute per IP
   - Wait 1 minute if you hit the limit

### Build Issues

#### TypeScript errors

1. **Clear TypeScript cache:**
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   npm run build
   ```

2. **Check for type mismatches:**
   - Run: `npm run build`
   - Fix any TypeScript errors shown

#### Module not found errors

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Check package.json:**
   - Verify all required packages are listed
   - Run: `npm install` to ensure everything is installed

### Sanity Issues

#### Schema not updating

1. **Deploy schema:**
   ```bash
   npx sanity schema deploy
   ```

2. **Check Sanity Studio:**
   - Restart Sanity Studio: `npm run studio`
   - Verify new fields appear

#### Data not showing

1. **Check if data is published:**
   - In Sanity Studio, ensure documents are published (not just saved as drafts)

2. **Verify queries:**
   - Check `src/lib/sanity/queries.ts`
   - Ensure location fields are included in query

3. **Check environment variables:**
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

## Still Having Issues?

1. **Check logs:**
   - Server logs in terminal
   - Browser console errors
   - Network tab in DevTools

2. **Verify setup:**
   - All dependencies installed
   - Environment variables set
   - Sanity schema deployed
   - Location data added in Sanity

3. **Clean rebuild:**
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   npm run build
   npm run dev
   ```

## Production Build

If dev server errors persist, test production build:

```bash
npm run build
npm start
```

Production builds are more stable and don't have HMR issues.


