# Sanity Webhook Setup for Automatic Rebuilds

This guide explains how to set up automatic site rebuilds when content changes in Sanity.

## Overview

When you publish content in Sanity, a webhook can automatically trigger a rebuild of your Next.js site to show the latest content. This is done through the `/api/revalidate` endpoint.

## Setup Steps

### 1. Set Environment Variable

Add a secret token to your environment variables (both local and production):

**Local (.env.local):**
```env
REVALIDATE_SECRET=your-super-secret-token-here
```

**Production (Vercel/Deployment):**
1. Go to your deployment platform (e.g., Vercel Dashboard)
2. Navigate to Settings → Environment Variables
3. Add `REVALIDATE_SECRET` with a secure random string

**Generate a secure secret:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use an online generator
```

### 2. Configure Sanity Webhook

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Webhooks**
4. Click **Create webhook**

**Webhook Configuration:**
- **Name**: `Next.js Revalidation`
- **URL**: `https://yourdomain.com/api/revalidate`
- **Dataset**: `production` (or your dataset name)
- **Trigger on**: 
  - ✅ Create
  - ✅ Update
  - ✅ Delete
- **Filter**: Leave empty (or specify document types if needed)
- **HTTP method**: `POST`
- **API version**: `v2021-03-25` or later
- **Secret**: Your `REVALIDATE_SECRET` value
- **Include drafts**: No

**Headers (optional):**
```
Authorization: Bearer YOUR_REVALIDATE_SECRET
```

Or you can pass the secret as a query parameter in the URL:
```
https://yourdomain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET
```

### 3. Test the Webhook

**Manual Test (GET request):**
```
https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/
```

**Using curl:**
```bash
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"_type": "mediaItem", "operation": "update"}'
```

**Using Sanity Studio:**
1. Make a small change to any content
2. Publish the change
3. Check your deployment logs to see if revalidation was triggered

## How It Works

1. **Content Change**: You publish content in Sanity
2. **Webhook Trigger**: Sanity sends a POST request to `/api/revalidate`
3. **Validation**: The API validates the secret token
4. **Revalidation**: Next.js revalidates the affected pages
5. **Update**: Your site shows the new content (may take a few seconds)

## Supported Content Types

The webhook automatically revalidates the correct pages based on content type:

- **hero** → `/`
- **mediaItem** → `/`, `/portfolio`, `/editorial`
- **videoItem** → `/`, `/videos`
- **testimonial** → `/`
- **about** → `/`, `/about`
- **contact** → `/`, `/contact`
- **category** → `/`, `/portfolio`
- **Unknown/All** → All main pages

## Troubleshooting

### Webhook not triggering?

1. **Check Secret**: Ensure `REVALIDATE_SECRET` matches in both Sanity and your deployment
2. **Check URL**: Verify the webhook URL is correct and accessible
3. **Check Logs**: Look at your deployment platform logs for errors
4. **Test Manually**: Use the GET endpoint to test if revalidation works

### Content not updating?

1. **Wait a few seconds**: Revalidation takes time
2. **Hard refresh**: Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
3. **Check if published**: Content must be **published** in Sanity, not just saved
4. **Verify webhook**: Check Sanity webhook logs for delivery status

### 401 Unauthorized Error?

- Secret token doesn't match
- Check environment variable is set correctly
- Verify webhook is sending the secret in the correct format

## Alternative: Manual Rebuild

If webhooks aren't working, you can manually trigger a rebuild:

**Vercel:**
- Go to Deployments → Click "..." → Redeploy

**Other platforms:**
- Trigger a new deployment from your Git repository
- Or use the manual revalidation endpoint with GET request

## Security Notes

- **Never commit** `REVALIDATE_SECRET` to Git
- Use a strong, random secret
- Keep the secret secure and rotate it periodically
- The webhook endpoint validates the secret before revalidating

## Next Steps

- Set up preview mode for draft content
- Configure image CDN settings in Sanity
- Add more content types as needed

