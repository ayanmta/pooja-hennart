"use client";

import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { SocialBitsPlayer } from "@/components/custom/SocialBitsSection/SocialBitsPlayer";
import { PlatformFilter } from "@/components/custom/SocialBitsSection/PlatformFilter";
import { useSearchParams, useRouter } from "next/navigation";
import type { MediaItem } from "@/lib/types/media";

interface SocialClientProps {
  reels: MediaItem[];
  youtubeVideos: MediaItem[];
  contact?: {
    instagramHandle?: string;
    email?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    youtubeChannelUrl?: string;
  };
  logoUrl?: string;
  logoAlt?: string;
}

export function SocialClient({
  reels,
  youtubeVideos,
  contact,
  logoUrl,
  logoAlt,
}: SocialClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const platformFilter = searchParams.get("platform") || "all";

  // Filter items based on platform filter
  const filteredReels = useMemo(() => {
    if (platformFilter === "all" || platformFilter === "instagram") {
      return reels;
    }
    return [];
  }, [reels, platformFilter]);

  const filteredYoutubeVideos = useMemo(() => {
    if (platformFilter === "all" || platformFilter === "youtube") {
      return youtubeVideos;
    }
    return [];
  }, [youtubeVideos, platformFilter]);

  const handlePlatformFilter = (platform: "all" | "instagram" | "youtube") => {
    const params = new URLSearchParams(searchParams.toString());
    if (platform === "all") {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }
    router.push(`/social?${params.toString()}`);
  };

  // Combine filtered items for the player
  const combinedItems = useMemo(() => {
    const allItems: MediaItem[] = [
      ...filteredReels.map(reel => ({ ...reel, platform: "instagram" as const })),
      ...filteredYoutubeVideos.map(video => ({ ...video, platform: "youtube" as const })),
    ];

    // Sort by order field if available
    return allItems.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return 0;
    });
  }, [filteredReels, filteredYoutubeVideos]);

  // Get initial index from URL or default to 0
  const initialIndex = useMemo(() => {
    const indexParam = searchParams.get("index");
    if (indexParam) {
      const index = parseInt(indexParam, 10);
      if (!isNaN(index) && index >= 0 && index < combinedItems.length) {
        return index;
      }
    }
    return 0;
  }, [searchParams, combinedItems.length]);

  if (combinedItems.length === 0) {
    return (
      <>
        <SiteHeader
          variant="solid"
          logoImage={logoUrl}
          logoAlt={logoAlt || "Logo"}
          logoText={logoUrl ? undefined : "Pooja HennArt & Makeover"}
        />
        <main className="min-h-screen">
          <div className="container mx-auto py-4 md:py-6 lg:py-8">
            <SectionHeader
              title="Social Bits"
              subtitle="See the looks in motion"
              align="left"
            />
            <p className="text-center text-muted-foreground py-12">
              No videos available
            </p>
          </div>
        </main>
        <SiteFooter
          instagramHandle={contact?.instagramHandle}
          email={contact?.email}
          phone={contact?.phoneNumber}
          whatsappNumber={contact?.whatsappNumber}
          youtubeChannelUrl={contact?.youtubeChannelUrl}
        />
      </>
    );
  }

  return (
    <>
      <SiteHeader
        variant="solid"
        logoImage={logoUrl}
        logoAlt={logoAlt || "Logo"}
        logoText={logoUrl ? undefined : "Pooja HennArt & Makeover"}
      />
      <main className="min-h-screen">
        <div className="container mx-auto py-4 md:py-6 lg:py-8">
          <SectionHeader
            title="Social Bits"
            subtitle="See the looks in motion"
            align="left"
          />
          {(reels.length > 0 || youtubeVideos.length > 0) && (
            <PlatformFilter
              currentFilter={platformFilter}
              onFilterChange={handlePlatformFilter}
            />
          )}
        </div>
        <div className="container mx-auto px-4 py-6 md:py-8">
          <SocialBitsPlayer
            items={combinedItems}
            initialIndex={initialIndex}
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
    </>
  );
}
