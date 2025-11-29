# Sanity CMS Integration - Quick Start

Your portfolio website is now fully integrated with Sanity CMS! All content and images are customizable through Sanity Studio.

## 🚀 Quick Setup (5 minutes)

### 1. Create Sanity Project
- Go to [sanity.io](https://sanity.io) and create a free account
- Create a new project
- Copy your **Project ID** from Settings → API

### 2. Configure Environment
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Deploy Schemas
```bash
npx sanity schema deploy
```

### 4. Access Studio
```bash
npm run dev
```
Then visit: [http://localhost:3333/studio](http://localhost:3333/studio)

## 📝 Content Types

### Hero Section
- Title, subtitle, background image
- Controls the main hero section

### Media Item
- Images for portfolio
- Categories, captions, featured flag
- Display order control

### Video Item
- Instagram Reels & YouTube videos
- Thumbnails, URLs, categories

### Category
- Filter categories (Bridal, Mehendi, Party, etc.)
- Used to organize media

### About Section
- Name, bio, profile image
- Expertise areas

### Contact Information
- WhatsApp, phone, Instagram, email
- Booking form toggle

## 🎨 Features

✅ **Image Optimization**: Automatic image optimization via Sanity CDN  
✅ **Real-time Updates**: Changes reflect immediately  
✅ **Type Safety**: Full TypeScript support  
✅ **Ordering Control**: Control display order of items  
✅ **Featured Items**: Mark items to appear in featured section  
✅ **Category Filtering**: Organize content by categories  

## 📚 Full Documentation

See [SANITY_SETUP.md](./SANITY_SETUP.md) for detailed setup instructions.

## 🔧 Troubleshooting

**Studio not loading?**
- Check `.env.local` has correct Project ID
- Make sure you're logged into Sanity

**Content not showing?**
- Ensure content is **published** (not just saved)
- Check browser console for errors
- Verify dataset name matches

**Images not loading?**
- Check image uploads completed
- Verify Project ID is correct
- Check Sanity project settings for CORS

