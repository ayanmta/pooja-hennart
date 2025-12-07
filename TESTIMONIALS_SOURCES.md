# Testimonials from Multiple Sources

## Overview

Testimonials can now come from **YouTube**, **Instagram**, and **WhatsApp**. You can add them manually in Sanity Studio or set up API integrations to automatically sync them.

## Current Support

### ✅ Manual Entry (Available Now)
- Add testimonials directly in Sanity Studio
- Select platform: YouTube, Instagram, WhatsApp, or Manual
- Upload profile pictures or use URLs
- Set event types, dates, and display order

### 🔄 API Integration (Future)
- **YouTube**: YouTube Data API v3
- **Instagram**: Instagram Graph API
- **WhatsApp**: WhatsApp Business API (requires business account)

## How to Add Testimonials

### Method 1: Manual Entry in Sanity

1. Go to Sanity Studio: `http://localhost:3333/studio`
2. Navigate to **"Testimonial"**
3. Click **"Create new"**
4. Fill in:
   - **Quote/Comment**: The testimonial text
   - **Author Name**: Name of the person
   - **Platform**: Select YouTube, Instagram, WhatsApp, or Manual
   - **Author Profile Picture**: Upload image or add URL
   - **Event Type**: Optional (e.g., "Bridal Makeup", "Mehendi Ceremony")
   - **Date**: When the testimonial was received
   - **Featured**: Check to show on website
   - **Order**: Display order (lower = first)

### Method 2: WhatsApp Messages (Manual)

For WhatsApp testimonials:
1. Take a screenshot of the WhatsApp message
2. In Sanity, create a new testimonial
3. Select **Platform: WhatsApp**
4. Copy the message text into **Quote**
5. Add the person's name
6. Upload the screenshot as profile picture (or use their WhatsApp profile pic if available)
7. Mark as **Featured**

### Method 3: YouTube Comments (Manual)

1. Go to your YouTube video
2. Find a comment you want to feature
3. In Sanity, create a new testimonial
4. Select **Platform: YouTube**
5. Copy the comment text
6. Add the commenter's name
7. Copy their profile picture URL (right-click → Copy image address)
8. Paste into **Author Profile Picture URL**
9. Add the **Video ID** (from YouTube URL)
10. Mark as **Featured**

### Method 4: Instagram Comments (Manual)

1. Go to your Instagram post
2. Find a comment you want to feature
3. In Sanity, create a new testimonial
4. Select **Platform: Instagram**
5. Copy the comment text
6. Add the commenter's name
7. Copy their profile picture URL
8. Add the **Post ID** (from Instagram URL)
9. Mark as **Featured**

## Automatic Sync (Future Implementation)

### YouTube Data API v3

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable **YouTube Data API v3**
4. Create **OAuth 2.0 credentials**

**Environment Variables:**
```env
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

**What it does:**
- Fetches comments from your YouTube videos
- Filters comments you've liked
- Gets top 3 latest from each video
- Extracts profile pictures automatically
- Syncs to Sanity via `/api/testimonials/sync`

### Instagram Graph API

**Setup:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app
3. Get **Instagram Business Account ID**
4. Generate **access token**

**Environment Variables:**
```env
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
```

**What it does:**
- Fetches comments from your Instagram posts
- Filters comments you've liked
- Gets top 3 latest from each post
- Extracts profile pictures automatically
- Syncs to Sanity via `/api/testimonials/sync`

### WhatsApp Business API

**Setup:**
1. Requires **WhatsApp Business Account**
2. Go to [Meta Business](https://business.facebook.com/)
3. Set up WhatsApp Business API
4. Get **access token** and **phone number ID**

**Environment Variables:**
```env
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

**What it does:**
- Fetches messages from WhatsApp Business conversations
- Filters messages marked as testimonials/reviews
- Extracts sender name and profile picture
- Syncs to Sanity via `/api/testimonials/sync`

**Note:** WhatsApp API requires business verification and has strict usage policies.

## Display on Website

Testimonials appear in the **"Kind Words"** section on the homepage:
- Shows up to 6 featured testimonials
- Displays platform badges (YouTube/Instagram/WhatsApp)
- Shows profile pictures
- Smooth carousel navigation
- Event type badges

## Platform Icons

- **YouTube**: Red badge with YouTube icon
- **Instagram**: Pink badge with Instagram icon
- **WhatsApp**: Green badge with message icon
- **Manual**: No badge (generic testimonials)

## Best Practices

1. **Mix Platforms**: Show testimonials from different sources
2. **Recent First**: Sort by date (newest first)
3. **Quality Over Quantity**: Only feature meaningful testimonials
4. **Profile Pictures**: Always include profile pictures for authenticity
5. **Event Types**: Tag testimonials with event types for better organization

## Sync Endpoint

The sync endpoint is available at `/api/testimonials/sync` (POST request).

**Usage:**
- Call manually via API client
- Set up cron job for periodic syncing
- Trigger from Sanity Studio (custom action)
- Webhook integration

**Response:**
```json
{
  "success": true,
  "message": "Testimonials synced successfully",
  "youtube": { "synced": 5, "new": 2 },
  "instagram": { "synced": 3, "new": 1 },
  "whatsapp": { "synced": 4, "new": 0 }
}
```

## Current Status

- ✅ Manual entry: **Fully supported**
- ✅ Platform selection: **YouTube, Instagram, WhatsApp, Manual**
- ✅ Display component: **Ready**
- ⏳ YouTube API sync: **Placeholder ready**
- ⏳ Instagram API sync: **Placeholder ready**
- ⏳ WhatsApp API sync: **Placeholder ready**
