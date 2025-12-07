"use client";

import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { SocialBitsSection } from "@/components/custom/SocialBitsSection";
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
          <SocialBitsSection
            reels={filteredReels}
            youtubeVideos={filteredYoutubeVideos}
            enableInfiniteScroll={true}
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
