import { client } from "./client";
import { urlFor } from "./image";
import type { MediaItem } from "@/lib/types/media";

// GROQ Query Fragments
const imageProjection = `
  image {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  "imageUrl": image.asset->url,
  "imageAlt": image.alt
`;

const thumbnailProjection = `
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  "thumbnailUrl": thumbnail.asset->url
`;

// Hero Section Query
export async function getHero() {
  const query = `*[_type == "hero"][0] {
    title,
    subtitle,
    backgroundImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    "backgroundImageUrl": backgroundImage.asset->url,
    "backgroundImageAlt": backgroundImage.alt,
    showScrollCue
  }`;

  return await client.fetch(query);
}

// Media Items Query
export async function getMediaItems(featuredOnly: boolean = false) {
  const featuredFilter = featuredOnly ? 'isFeatured == true' : '';
  const query = `*[_type == "mediaItem" ${featuredFilter ? `&& ${featuredFilter}` : ''}] | order(order asc, _createdAt desc) {
    _id,
    title,
    caption,
    ${imageProjection},
    ${thumbnailProjection},
    categories[]-> {
      id,
      label
    },
    isFeatured,
    platform,
    order
  }`;

  const items = await client.fetch(query);
  
  // Transform to MediaItem type
  return items.map((item: any): MediaItem => ({
    id: item._id,
    type: "image",
    src: item.imageUrl || "",
    thumbnail: item.thumbnailUrl || item.imageUrl || "",
    platform: item.platform || "instagram",
    categories: item.categories?.map((cat: any) => cat.id) || [],
    caption: item.caption || item.title || "",
  }));
}

// Video Items Query
export async function getVideoItems(platform?: "instagram" | "youtube") {
  const platformFilter = platform ? `platform == "${platform}"` : '';
  const query = `*[_type == "videoItem" ${platformFilter ? `&& ${platformFilter}` : ''}] | order(order asc, _createdAt desc) {
    _id,
    title,
    caption,
    platform,
    url,
    videoId,
    ${thumbnailProjection},
    categories[]-> {
      id,
      label
    },
    order
  }`;

  const items = await client.fetch(query);
  
  // Transform to MediaItem type
  return items.map((item: any): MediaItem => ({
    id: item._id,
    type: "video",
    src: item.url || "",
    thumbnail: item.thumbnailUrl || "",
    platform: item.platform || "youtube",
    categories: item.categories?.map((cat: any) => cat.id) || [],
    caption: item.caption || item.title || "",
  }));
}

// Categories Query
export async function getCategories() {
  const query = `*[_type == "category"] | order(order asc) {
    id,
    label,
    order
  }`;

  return await client.fetch(query);
}

// About Section Query
export async function getAbout() {
  const query = `*[_type == "about"][0] {
    name,
    image {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    bio,
    expertise
  }`;

  return await client.fetch(query);
}

// Contact Information Query
export async function getContact() {
  const query = `*[_type == "contact"][0] {
    whatsappNumber,
    phoneNumber,
    instagramHandle,
    email,
    showBookingForm
  }`;

  return await client.fetch(query);
}

