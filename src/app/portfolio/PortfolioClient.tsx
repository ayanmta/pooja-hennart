"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { CategoryFilterBar, type Category } from "@/components/custom/CategoryFilterBar";
import { BentoGrid } from "@/components/custom/BentoGrid";
import { MediaLightbox } from "@/components/custom/MediaLightbox";
import { type MediaItem } from "@/lib/types/media";

interface PortfolioClientProps {
  initialMedia: MediaItem[];
  categories: any[];
  initialCategory?: string | null;
  logoUrl?: string;
  logoAlt?: string;
  contact?: any;
}

export function PortfolioClient({
  initialMedia,
  categories,
  initialCategory = null,
  logoUrl,
  logoAlt,
  contact,
}: PortfolioClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get current category from URL (source of truth)
  const currentCategory = searchParams.get("category") || initialCategory || null;

  // Filter media by current category (client-side filtering for URL changes)
  const filteredMedia = useMemo(() => {
    if (!currentCategory) return initialMedia;
    return initialMedia.filter((item) => item.categories.includes(currentCategory));
  }, [currentCategory, initialMedia]);

  // Transform categories to Category type
  const categoryOptions: Category[] = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
  }));

  // Handle category filter change - update URL
  const handleCategoryChange = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    router.push(`/portfolio?${params.toString()}`, { scroll: false });
  };

  const handleMediaClick = (item: MediaItem, index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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
            title="Portfolio"
            subtitle="Browse all our work"
            align="left"
          />
          {categoryOptions.length > 0 && (
            <CategoryFilterBar
              categories={categoryOptions}
              onCategoryChange={handleCategoryChange}
              defaultCategory={currentCategory}
            />
          )}
        </div>
        {/* Bento Grid Portfolio */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          {filteredMedia.length > 0 ? (
            <BentoGrid
              items={filteredMedia}
              onItemClick={handleMediaClick}
              initialBatchSize={20}
              loadMoreBatchSize={20}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {currentCategory
                  ? `No items found in "${categoryOptions.find((c) => c.id === currentCategory)?.label || currentCategory}" category`
                  : "No portfolio items available"}
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter
        instagramHandle={contact?.instagramHandle}
        email={contact?.email}
        phone={contact?.phoneNumber}
        whatsappNumber={contact?.whatsappNumber}
        youtubeChannelUrl={contact?.youtubeChannelUrl}
      />

      {/* Media Lightbox */}
      <MediaLightbox
        items={filteredMedia}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}

