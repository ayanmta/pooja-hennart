"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { HeroSection } from "@/components/custom/HeroSection";
import { FeaturedLooks } from "@/components/custom/FeaturedLooks";
import { CategoryFilterBar, type Category } from "@/components/custom/CategoryFilterBar";
import { DomeGallery } from "@/components/custom/DomeGallery";
import { AnimatedPortfolioSection } from "@/components/custom/AnimatedPortfolioSection";
import { MediaLightbox } from "@/components/custom/MediaLightbox";
import { VideoGrid } from "@/components/custom/VideoGrid";
import { VideoModal } from "@/components/custom/VideoModal";
import { AboutPoojaSection } from "@/components/custom/AboutPoojaSection";
import { TestimonialsCarousel } from "@/components/custom/TestimonialsCarousel";
import type { Testimonial } from "@/components/custom/TestimonialsCarousel/TestimonialsCarousel";
import { ContactQuickActions } from "@/components/custom/ContactQuickActions";
import { AnimatedSection } from "@/components/custom/AnimatedSection";
import { Button } from "@/components/ui/button";
import { type MediaItem } from "@/lib/types/media";
import { type SanityTestimonial } from "@/lib/sanity/queries";

interface HomeClientProps {
  hero: {
    title?: string;
    subtitle?: string;
    location?: string;
    backgroundImageUrl?: string;
    heroImageUrls?: string[];
    heroImageAlts?: string[];
    logoUrl?: string;
    logoAlt?: string;
    showScrollCue?: boolean;
    carouselAutoPlay?: boolean;
    carouselInterval?: number;
  } | null;
  featuredMedia: MediaItem[];
  allMedia: MediaItem[];
  reels: MediaItem[];
  youtubeVideos: MediaItem[];
  categories: Array<{ id: string; label: string }>;
  about: {
    name?: string;
    bio?: string;
    imageUrl?: string;
    expertise?: string[];
  } | null;
  contact: {
    whatsappNumber?: string;
    phoneNumber?: string;
    instagramHandle?: string;
    email?: string;
    showBookingForm?: boolean;
  } | null;
  testimonials: SanityTestimonial[];
}

export function HomeClient({
  hero,
  featuredMedia,
  allMedia,
  reels,
  youtubeVideos,
  categories,
  about,
  contact,
  testimonials,
}: HomeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

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

  // Handlers
  const handleMediaClick = (item: MediaItem) => {
    const index = allMedia.findIndex((m) => m.id === item.id);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  const handleVideoClick = (item: MediaItem) => {
    setSelectedVideo(item);
    setVideoModalOpen(true);
  };

  // Transform Sanity testimonials to component format
  const transformedTestimonials: Testimonial[] = testimonials.map((testimonial) => ({
    id: testimonial._id,
    quote: testimonial.quote,
    name: testimonial.authorName,
    event: testimonial.event,
    profilePic: testimonial.authorProfilePicUrl || testimonial.authorProfilePicFromUrl,
    platform: testimonial.platform as "youtube" | "instagram" | "manual",
  }));

  return (
    <>
      {/* Header - Overlay on hero */}
      <SiteHeader
        variant="overlay"
        logoImage={hero?.logoUrl}
        logoAlt={hero?.logoAlt || "Pooja HennArt & Makeover"}
        logoText={hero?.logoUrl ? undefined : "Pooja HennArt & Makeover"}
        socialItems={
          contact?.instagramHandle
            ? [
                {
                  label: "Instagram",
                  link: `https://instagram.com/${contact.instagramHandle.replace("@", "")}`,
                },
              ]
            : []
        }
      />

      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection
          title={hero?.title || "POOJA"}
          subtitle={hero?.subtitle || "HennArt & Makeover"}
          location={hero?.location}
          backgroundImage={hero?.backgroundImageUrl}
          heroImages={
            hero?.heroImageUrls?.map((url: string, index: number) => ({
              url,
              alt: hero?.heroImageAlts?.[index] || "",
            })) || []
          }
          logo={hero?.logoUrl}
          logoAlt={hero?.logoAlt || "Logo"}
          scrollCue={hero?.showScrollCue !== false}
          carouselAutoPlay={hero?.carouselAutoPlay !== false}
          carouselInterval={hero?.carouselInterval || 5}
        />

        {/* Featured Looks */}
        {featuredMedia.length > 0 && (
          <AnimatedSection direction="up" delay={0.2}>
            <section className="py-12">
              <div className="container mx-auto px-4">
                <SectionHeader
                  title="Featured Looks"
                  subtitle="Handpicked bridal & mehendi work"
                  align="left"
                />
                <FeaturedLooks items={featuredMedia} onItemClick={handleMediaClick} />
                <div className="mt-6 text-center">
                  <Link href="/portfolio">
                    <Button variant="link" className="text-sm">
                      View full portfolio <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Portfolio Preview with Dome Gallery and Parallax */}
        <AnimatedSection direction="up" delay={0.3}>
          <AnimatedPortfolioSection className="py-1">
            <section className="relative overflow-visible">
              <div className="container mx-auto px-4">
                <SectionHeader
                  title="Portfolio"
                  subtitle="Explore by look"
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
                className="mt-4 -mb-6 sm:-mb-8 md:-mb-10 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 h-[75vh] min-h-[550px] md:h-[85vh] md:min-h-[650px] relative overflow-hidden"
              >
                <DomeGallery
                  images={filteredMedia}
                  onImageClick={handleMediaClick}
                  fit={0.55}
                  fitBasis="auto"
                  minRadius={450}
                  maxRadius={1200}
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
              {allMedia.length > 8 && (
                <div className="container mx-auto px-4 text-center">
                  <Link href="/portfolio">
                    <Button variant="outline" size="lg">
                      See all work
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          </AnimatedPortfolioSection>
        </AnimatedSection>

        {/* Videos */}
        {(reels.length > 0 || youtubeVideos.length > 0) && (
          <AnimatedSection direction="up" delay={0.4}>
            <section className="py-12">
              <div className="container mx-auto px-4">
                <SectionHeader
                  title="Videos & Reels"
                  subtitle="See the looks in motion"
                  align="left"
                />
                <VideoGrid
                  reels={reels.slice(0, 4)}
                  youtubeVideos={youtubeVideos.slice(0, 4)}
                  onVideoClick={handleVideoClick}
                />
                {(reels.length > 4 || youtubeVideos.length > 4) && (
                  <div className="mt-6 text-center">
                    <Link href="/videos">
                      <Button variant="link" className="text-sm">
                        View all videos <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* About Pooja */}
        {about && (
          <AnimatedSection direction="up" delay={0.5}>
            <AboutPoojaSection
              image={about?.imageUrl}
              name={about?.name || "Pooja HennArt"}
              bio={about?.bio || ""}
              expertise={about?.expertise || []}
            />
          </AnimatedSection>
        )}

        {/* Testimonials */}
        {transformedTestimonials.length > 0 && (
          <AnimatedSection direction="up" delay={0.6}>
            <TestimonialsCarousel testimonials={transformedTestimonials} />
          </AnimatedSection>
        )}

        {/* Contact */}
        {contact && (
          <AnimatedSection direction="up" delay={0.7}>
            <section className="py-12">
              <div className="container mx-auto px-4">
                <SectionHeader
                  title="Book your look"
                  subtitle="Share your date & event details"
                  align="center"
                />
                <ContactQuickActions
                  whatsappNumber={contact?.whatsappNumber || ""}
                  phoneNumber={contact?.phoneNumber}
                  instagramHandle={contact?.instagramHandle}
                  email={contact?.email}
                  showBookingForm={false}
                />
              </div>
            </section>
          </AnimatedSection>
        )}
      </main>

      {/* Footer */}
      <SiteFooter
        instagramHandle={contact?.instagramHandle}
        email={contact?.email}
        phone={contact?.phoneNumber}
      />

      {/* Media Lightbox */}
      <MediaLightbox
        items={allMedia}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
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

