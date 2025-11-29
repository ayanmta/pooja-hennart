# Sanity CMS Setup Guide

This guide will help you set up Sanity CMS for your Pooja HennArt portfolio website.

## Step 1: Create a Sanity Account & Project

1. Go to [sanity.io](https://sanity.io) and create a free account
2. Click "Create new project"
3. Choose a project name (e.g., "Pooja HennArt Portfolio")
4. Choose a dataset name (use "production" for now)
5. Click "Create project"

## Step 2: Get Your Project Credentials

1. In your Sanity project dashboard, go to **Settings** → **API**
2. Copy your **Project ID** (looks like `abc123xyz`)
3. Note your **Dataset** name (usually "production")

## Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Sanity credentials:
   ```env
   
   ```

## Step 4: Deploy Your Schema to Sanity

1. Make sure you're in the project root directory
2. Run the Sanity CLI to deploy schemas:
   ```bash
   npx sanity schema deploy
   ```

   Or if you have Sanity CLI installed globally:
   ```bash
   sanity schema deploy
   ```

## Step 5: Access Sanity Studio

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3333/studio](http://localhost:3333/studio)

3. You'll be prompted to log in with your Sanity account

## Step 6: Add Content

Once logged into Sanity Studio, you can start adding content:

### 6.1 Create Categories First
1. Go to **Category** in the sidebar
2. Click **Create new**
3. Add categories like:
   - ID: `bridal`, Label: `Bridal`
   - ID: `mehendi`, Label: `Mehendi`
   - ID: `party`, Label: `Party`
   - ID: `hair`, Label: `Hair`
   - ID: `before-after`, Label: `Before/After`
   - ID: `editorial`, Label: `Editorial`

### 6.2 Add Hero Section
1. Go to **Hero Section**
2. Click **Create new**
3. Fill in:
   - Title: `POOJA`
   - Subtitle: `HennArt & Makeover`
   - Upload a background image
   - Toggle "Show Scroll Indicator" if desired

### 6.3 Add Media Items
1. Go to **Media Item**
2. Click **Create new**
3. Fill in:
   - Title (optional)
   - Upload main image
   - Upload thumbnail (optional, uses main image if not provided)
   - Select categories (must select at least one)
   - Add caption
   - Toggle "Featured" if you want it in the featured section
   - Set display order (lower numbers appear first)

### 6.4 Add Video Items
1. Go to **Video Item**
2. Click **Create new**
3. Fill in:
   - Title
   - Upload thumbnail image
   - Select platform (Instagram Reels or YouTube)
   - Add video URL:
     - For YouTube: `https://www.youtube.com/watch?v=VIDEO_ID`
     - For Instagram: Full Instagram Reel URL
   - For YouTube: Add Video ID (just the ID, e.g., `dQw4w9WgXcQ`)
   - Add caption
   - Set display order

### 6.5 Add About Section
1. Go to **About Section**
2. Click **Create new**
3. Fill in:
   - Name: `Pooja HennArt`
   - Upload profile image
   - Add bio text (2-3 lines recommended)
   - Add expertise areas (e.g., "Bridal Makeup", "Mehendi Art")

### 6.6 Add Contact Information
1. Go to **Contact Information**
2. Click **Create new**
3. Fill in:
   - WhatsApp Number: `+919876543210` (with country code)
   - Phone Number (optional)
   - Instagram Handle: `poojahennart` (without @)
   - Email Address
   - Toggle "Show Booking Form" if desired

## Step 7: View Your Site

1. Go to [http://localhost:3333](http://localhost:3333)
2. Your content from Sanity should now appear!

## Tips

- **Image Optimization**: Sanity automatically optimizes images. The site uses Sanity's CDN for fast image delivery.
- **Ordering**: Use the "Display Order" field to control the order items appear (lower numbers first).
- **Featured Items**: Toggle "Featured" on media items to show them in the Featured Looks section.
- **Categories**: Make sure to create categories before adding media items, as they're required.

## Troubleshooting

### Images not showing?
- Check that images are uploaded and published in Sanity
- Verify your `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check browser console for errors

### Studio not loading?
- Make sure you're logged into Sanity
- Verify environment variables are set correctly
- Try clearing browser cache

### Content not updating?
- Make sure content is **published** in Sanity (not just saved as draft)
- Check that your dataset name matches in `.env.local`
- Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)

## Next Steps

- Set up webhooks for automatic deployments when content changes
- Configure image CDN settings in Sanity
- Set up preview mode for draft content
- Add more content types as needed

For more help, visit [sanity.io/docs](https://sanity.io/docs)

