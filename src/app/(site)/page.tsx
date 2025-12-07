import React from "react";
import { HomeClient } from "./HomeClient";
import {
  getHero,
  getMediaItems,
  getVideoItems,
  getCategories,
  getAbout,
  getContact,
  getTestimonials,
} from "@/lib/sanity/queries";
import { type MediaItem } from "@/lib/types/media";

export default async function Home() {
  // Fetch all data from Sanity
  const [hero, allMedia, allVideos, categories, about, contact, testimonials] =
    await Promise.all([
      getHero(),
      getMediaItems(),
      getVideoItems(),
      getCategories(),
      getAbout(),
      getContact(),
      getTestimonials(6), // Get top 6 testimonials (3 from each platform)
    ]);

  // Get featured media
  const featuredMedia = await getMediaItems(true);

  // Only YouTube videos are shown for now
  // Instagram Reels are in progress and filtered out in getVideoItems()
  const reels: MediaItem[] = []; // Empty for now - Instagram support in progress
  const youtubeVideos = allVideos; // All returned videos are YouTube

  return (
    <HomeClient
      hero={hero}
      featuredMedia={featuredMedia}
      allMedia={allMedia}
      reels={reels}
      youtubeVideos={youtubeVideos}
      categories={categories}
      about={about}
      contact={contact}
      testimonials={testimonials}
    />
  );
}
