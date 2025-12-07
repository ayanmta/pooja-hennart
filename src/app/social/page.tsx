import React, { Suspense } from "react";
import { SocialClient } from "./SocialClient";
import { getVideoItems, getContact, getHero } from "@/lib/sanity/queries";
import { type MediaItem } from "@/lib/types/media";

export default async function SocialPage() {
  const [allVideos, contact, hero] = await Promise.all([
    getVideoItems(),
    getContact(),
    getHero(),
  ]);

  // Only YouTube videos are shown for now
  // Instagram Reels are in progress and filtered out in getVideoItems()
  const reels: MediaItem[] = []; // Empty for now - Instagram support in progress
  const youtubeVideos = allVideos; // All returned videos are YouTube

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialClient
        reels={reels}
        youtubeVideos={youtubeVideos}
        contact={contact}
        logoUrl={hero?.logoUrl}
        logoAlt={hero?.logoAlt}
      />
    </Suspense>
  );
}
