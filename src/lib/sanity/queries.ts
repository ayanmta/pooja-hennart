import { client } from "./client";
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
    location,
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
    heroImages[] {
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
      },
      alt
    },
    "heroImageUrls": heroImages[].asset->url,
    "heroImageAlts": heroImages[].alt,
    logo {
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
    "logoUrl": logo.asset->url,
    "logoAlt": logo.alt,
    showScrollCue,
    carouselAutoPlay,
    carouselInterval
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
  return items.map((item: any): MediaItem => {
    const platform = item.platform || "youtube";
    const url = item.url || "";
    
    // Auto-generate thumbnail if not provided
    let thumbnail = item.thumbnailUrl || "";
    if (!thumbnail && url) {
      if (platform === "youtube") {
        // Extract YouTube video ID and generate thumbnail URL
        const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[&?]v=))([a-zA-Z0-9_-]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
          thumbnail = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
        }
      }
      // Instagram thumbnails require oEmbed API, handled in component
    }
    
    return {
      id: item._id,
      type: "video",
      src: url,
      thumbnail: thumbnail,
      platform: platform as "youtube" | "instagram",
      categories: item.categories?.map((cat: any) => cat.id) || [],
      caption: item.caption || item.title || "",
    };
  });
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
    whatsappMessage,
    phoneNumber,
    instagramHandle,
    facebookUrl,
    youtubeChannelUrl,
    email,
    showBookingForm,
    contactTitle,
    contactSubtitle
  }`;

  return await client.fetch(query);
}

// Testimonials Query
export async function getTestimonials(limit?: number) {
  const limitFilter = limit ? `[0...${limit}]` : "";
  const query = `*[_type == "testimonial" && isFeatured == true] | order(date desc, order asc) ${limitFilter} {
    _id,
    quote,
    authorName,
    authorProfilePic {
      asset-> {
        _id,
        url
      }
    },
    "authorProfilePicUrl": authorProfilePic.asset->url,
    "authorProfilePicFromUrl": authorProfilePicUrl,
    platform,
    event,
    date,
    order
  }`;

  return await client.fetch(query);
}

// Editorial Projects Query
export async function getEditorialProjects() {
  const query = `*[_type == "editorial"] | order(order asc, date desc) {
    _id,
    title,
    date,
    description,
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
    galleryLink,
    galleryLinkText,
    order
  }`;

  return await client.fetch(query);
}

// Export Sanity types for frontend usage
export type SanityHero = Awaited<ReturnType<typeof getHero>>;
export type SanityMediaItem = Awaited<ReturnType<typeof getMediaItems>>[number];
export type SanityVideoItem = Awaited<ReturnType<typeof getVideoItems>>[number];
export type SanityCategory = Awaited<ReturnType<typeof getCategories>>[number];
export type SanityAbout = Awaited<ReturnType<typeof getAbout>>;
export type SanityContact = Awaited<ReturnType<typeof getContact>>;
export type SanityTestimonial = Awaited<ReturnType<typeof getTestimonials>>[number];
export type SanityEditorial = Awaited<ReturnType<typeof getEditorialProjects>>[number];

