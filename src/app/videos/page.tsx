import React from "react";
import { VideosClient } from "./VideosClient";
import { getVideoItems, getContact, getHero } from "@/lib/sanity/queries";
import { type MediaItem } from "@/lib/types/media";

export default async function VideosPage() {
  const [allVideos, contact, hero] = await Promise.all([
    getVideoItems(),
    getContact(),
    getHero(),
  ]);

  // Separate reels and YouTube videos
  const reels = allVideos.filter((video: MediaItem) => video.platform === "instagram");
  const youtubeVideos = allVideos.filter((video: MediaItem) => video.platform === "youtube");

  return (
    <VideosClient
      reels={reels}
      youtubeVideos={youtubeVideos}
      contact={contact}
      logoUrl={hero?.logoUrl}
      logoAlt={hero?.logoAlt}
    />
  );
}
