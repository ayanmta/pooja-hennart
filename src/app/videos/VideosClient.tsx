"use client";

import React, { useState } from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { VideoGrid } from "@/components/custom/VideoGrid";
import { VideoModal } from "@/components/custom/VideoModal";
import { type MediaItem } from "@/lib/types/media";

interface VideosClientProps {
  reels: MediaItem[];
  youtubeVideos: MediaItem[];
  contact: any;
  logoUrl?: string;
  logoAlt?: string;
}

export function VideosClient({
  reels,
  youtubeVideos,
  contact,
  logoUrl,
  logoAlt,
}: VideosClientProps) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  const handleVideoClick = (item: MediaItem) => {
    setSelectedVideo(item);
    setVideoModalOpen(true);
  };

  return (
    <>
      <SiteHeader
        variant="solid"
        logoImage={logoUrl}
        logoAlt={logoAlt || "Logo"}
        logoText={logoUrl ? undefined : "Pooja HennArt & Makeover"}
      />
      <main className="min-h-screen">
        <div className="container mx-auto py-8 md:py-10 lg:py-12">
          <SectionHeader
            title="Videos & Reels"
            subtitle="See the looks in motion"
            align="left"
          />
          <VideoGrid
            reels={reels}
            youtubeVideos={youtubeVideos}
            onVideoClick={handleVideoClick}
            reelsLayout="grid"
          />
        </div>
      </main>
      <SiteFooter
        instagramHandle={contact?.instagramHandle}
        email={contact?.email}
        phone={contact?.phoneNumber}
        whatsappNumber={contact?.whatsappNumber}
        youtubeChannelUrl={contact?.youtubeChannelUrl}
      />

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          open={videoModalOpen}
          onOpenChange={setVideoModalOpen}
        />
      )}
    </>
  );
}

