"use client";

import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { CategoryFilterBar, type Category } from "@/components/custom/CategoryFilterBar";
import { DomeGallery } from "@/components/custom/DomeGallery";
import { MediaLightbox } from "@/components/custom/MediaLightbox";
import { type MediaItem } from "@/lib/types/media";

interface PortfolioClientProps {
  allMedia: MediaItem[];
  categories: any[];
  logoUrl?: string;
  logoAlt?: string;
}

export function PortfolioClient({
  allMedia,
  categories,
  logoUrl,
  logoAlt,
}: PortfolioClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter media by category
  const filteredMedia = useMemo(() => {
    if (!selectedCategory) return allMedia;
    return allMedia.filter((item) => item.categories.includes(selectedCategory));
  }, [selectedCategory, allMedia]);

  // Transform categories to Category type
  const categoryOptions: Category[] = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
  }));

  const handleMediaClick = (item: MediaItem) => {
    const index = filteredMedia.findIndex((m) => m.id === item.id);
    setLightboxIndex(index >= 0 ? index : 0);
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
        <div className="container mx-auto px-4 py-1">
          <SectionHeader
            title="Portfolio"
            subtitle="Browse all our work"
            align="left"
          />
          {categoryOptions.length > 0 && (
            <CategoryFilterBar
              categories={categoryOptions}
              onCategoryChange={setSelectedCategory}
              defaultCategory={null}
            />
          )}
        </div>
        {/* Dome Gallery with minimal margins - negative side margins for focused images */}
        <div 
          className="mt-4 -mb-6 sm:-mb-8 md:-mb-10 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 h-[90vh] min-h-[700px] relative overflow-hidden"
        >
          <DomeGallery
            images={filteredMedia}
            onImageClick={handleMediaClick}
            fit={0.6}
            fitBasis="auto"
            minRadius={550}
            maxRadius={1400}
            padFactor={0.1}
            overlayBlurColor="hsl(var(--background))"
            maxVerticalRotationDeg={4}
            dragSensitivity={25}
            enlargeTransitionMs={400}
            segments={35}
            dragDampening={2}
            openedImageWidth=""
            openedImageHeight=""
            imageBorderRadius="16px"
            openedImageBorderRadius="24px"
            grayscale={false}
          />
        </div>
      </main>
      <SiteFooter />

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

