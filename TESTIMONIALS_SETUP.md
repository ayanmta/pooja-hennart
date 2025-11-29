# Testimonials Setup Guide

## Overview

The testimonials system allows you to pull in comments from YouTube and Instagram that you've liked, and display them in the "Kind Words" section with user profile pictures.

## Sanity Schema

A new `testimonial` document type has been added to Sanity with the following fields:

- **quote**: The comment/testimonial text
- **authorName**: Name of the commenter
- **authorProfilePic**: Profile picture (can be uploaded or auto-pulled)
- **authorProfilePicUrl**: Direct URL to profile picture from platform
- **platform**: Source (youtube, instagram, or manual)
- **platformId**: Original comment ID
- **videoId/postId**: Related video/post ID
- **event**: Optional event type
- **likedByMe**: Whether you liked this comment
- **isFeatured**: Show in testimonials section
- **order**: Display order
- **date**: Comment date

## Manual Setup

1. Go to Sanity Studio: `http://localhost:3333/studio`
2. Navigate to "Testimonial"
3. Create testimonials manually:
   - Add quote/comment text
   - Add author name
   - Upload or add URL for profile picture
   - Select platform (youtube/instagram/manual)
   - Add event type if applicable
   - Mark as "Featured" to show on site
   - Set order for display sequence

## API Integration (Future)

To automatically pull comments from YouTube and Instagram, you'll need to:

### YouTube Data API v3

1. **Get API Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials

2. **Environment Variables**:
   ```env
   YOUTUBE_API_KEY=your_api_key
   YOUTUBE_CHANNEL_ID=your_channel_id
   ```

3. **Implementation**:
   - Use the YouTube Data API to fetch comments from your videos
   - Filter comments that you've liked
   - Get top 3 latest from each video
   - Extract profile pictures from comment author

### Instagram Graph API

1. **Get API Credentials**:
   - Go to [Meta for Developers](https://developers.facebook.com/)
   - Create an app
   - Get Instagram Business Account ID
   - Generate access token

2. **Environment Variables**:
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_access_token
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
   ```

3. **Implementation**:
   - Use Instagram Graph API to fetch comments from your posts
   - Filter comments that you've liked
   - Get top 3 latest from each post
   - Extract profile pictures from comment author

### Sync Endpoint

The sync endpoint is available at `/api/testimonials/sync` (POST request).

You can:
- Call it manually
- Set up a cron job to sync periodically
- Trigger it from Sanity Studio using a custom action

## Current Implementation

Currently, testimonials are managed manually through Sanity Studio. The component displays:
- Profile pictures (from Sanity or direct URL)
- Author names
- Quotes/comments
- Platform icons (YouTube/Instagram)
- Event types
- Smooth carousel navigation

## Next Steps

1. **Manual Entry**: Start by adding testimonials manually in Sanity Studio
2. **API Integration**: When ready, implement YouTube and Instagram API integrations
3. **Automation**: Set up automated syncing via cron job or webhook

## Display

Testimonials appear in the "Kind Words" section on the home page, showing:
- Top 6 testimonials (can be filtered to show top 3 from each platform)
- Profile pictures automatically pulled from platforms
- Smooth carousel with navigation
- Platform indicators

