"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { HeroSection } from "@/components/custom/HeroSection";
import { FeaturedLooks } from "@/components/custom/FeaturedLooks";
import { CategoryCarousel } from "@/components/custom/CategoryCarousel";
import { AnimatedPortfolioSection } from "@/components/custom/AnimatedPortfolioSection";
import { MediaLightbox } from "@/components/custom/MediaLightbox";
import { SocialBitsSection } from "@/components/custom/SocialBitsSection";
import { AboutPoojaSection } from "@/components/custom/AboutPoojaSection";
import { TestimonialsCarousel } from "@/components/custom/TestimonialsCarousel";
import type { Testimonial } from "@/components/custom/TestimonialsCarousel/TestimonialsCarousel";
import { AnimatedSection } from "@/components/custom/AnimatedSection";
import { LocationMap } from "@/components/custom/LocationMap";
import { Button } from "@/components/ui/button";
import { type MediaItem } from "@/lib/types/media";
import { type SanityTestimonial } from "@/lib/sanity/queries";
import type { CategoryCard, AllCard, CollageImage } from "@/lib/types/category";
import {
  selectTemplateImage,
  selectAllCardImage,
} from "@/lib/utils/template-image";

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
  categories: Array<{ id: string; label: string; description?: string; order?: number }>;
  about: {
    name?: string;
    bio?: string;
    imageUrl?: string;
    expertise?: string[];
  } | null;
  contact: {
    whatsappNumber?: string;
    whatsappMessage?: string;
    phoneNumber?: string;
    instagramHandle?: string;
    facebookUrl?: string;
    youtubeChannelUrl?: string;
    email?: string;
    showBookingForm?: boolean;
    contactTitle?: string;
    contactSubtitle?: string;
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Transform categories to CategoryCard entities for carousel
  const categoryCards: CategoryCard[] = useMemo(() => {
    return categories.map((cat) => {
      // Filter media items by category
      const categoryMedia = allMedia.filter((item) =>
        item.categories.includes(cat.id)
      );
      
      // Select single template image (prioritize featured, fallback to recent)
      const selectedMedia = selectTemplateImage(categoryMedia);
      
      // Transform to CollageImage format
      const templateImage: CollageImage = selectedMedia
        ? {
            id: selectedMedia.id,
            src: selectedMedia.thumbnail || selectedMedia.src,
            alt: selectedMedia.caption || `Image from ${cat.label} category`,
            thumbnail: selectedMedia.thumbnail,
          }
        : {
            id: `placeholder-${cat.id}`,
            src: "",
            alt: `${cat.label} placeholder`,
          };
      
      return {
        categoryId: cat.id,
        categoryLabel: cat.label,
        description: cat.description || undefined,
        templateImage,
        href: `/portfolio?category=${cat.id}`,
        order: cat.order || 0,
      };
    });
  }, [categories, allMedia]);

  // Generate "All" card entity
  const allCard: AllCard = useMemo(() => {
    // Select single template image for "All" card (first featured, fallback to recent)
    const selectedMedia = selectAllCardImage(allMedia);
    
    // Transform to CollageImage format
    const templateImage: CollageImage = selectedMedia
      ? {
          id: selectedMedia.id,
          src: selectedMedia.thumbnail || selectedMedia.src,
          alt: selectedMedia.caption || "Featured image",
          thumbnail: selectedMedia.thumbnail,
        }
      : {
          id: "placeholder-all",
          src: "",
          alt: "All categories placeholder",
        };
    
    return {
      label: "All",
      templateImage,
      href: "/portfolio",
    };
  }, [allMedia]);

  // Handlers
  const handleMediaClick = (item: MediaItem) => {
    const index = allMedia.findIndex((m) => m.id === item.id);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };


  // Transform Sanity testimonials to component format
  const transformedTestimonials: Testimonial[] = testimonials.map((testimonial) => ({
    id: testimonial._id,
    quote: testimonial.quote,
    name: testimonial.authorName,
    event: testimonial.event,
    profilePic: testimonial.authorProfilePicUrl || testimonial.authorProfilePicFromUrl,
    platform: testimonial.platform as "youtube" | "instagram" | "whatsapp" | "manual",
  }));

  return (
    <>
      {/* Header - Overlay on hero */}
      <SiteHeader
        variant="overlay"
        logoImage={hero?.logoUrl}
        logoAlt={hero?.logoAlt || "Pooja HennArt & Makeover"}
        logoText={hero?.logoUrl ? undefined : "Pooja HennArt & Makeover"}
        socialItems={[
          ...(contact?.instagramHandle
            ? [
                {
                  label: "Instagram",
                  link: `https://instagram.com/${contact.instagramHandle.replace("@", "")}`,
                },
              ]
            : []),
          ...(contact?.youtubeChannelUrl
            ? [
                {
                  label: "YouTube",
                  link: contact.youtubeChannelUrl,
                },
              ]
            : []),
        ]}
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
            <section className="py-12 md:py-14 lg:py-16">
              <div className="container mx-auto">
                <SectionHeader
                  title="Featured Looks"
                  subtitle="Handpicked bridal & mehendi work"
                  align="left"
                />
                <FeaturedLooks items={featuredMedia} onItemClick={handleMediaClick} />
                <div className="mt-6 text-center md:mt-8 lg:mt-10">
                  <Link href="/portfolio">
                    <Button variant="link" className="text-sm md:text-base">
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
              <div className="container mx-auto">
                <SectionHeader
                  title="Portfolio"
                  subtitle="Explore by look"
                  align="left"
                />
              </div>
              {/* Category Carousel */}
              <div className="mt-8 mb-6">
                <CategoryCarousel categories={categoryCards} />
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

        {/* Social Bits */}
        {(reels.length > 0 || youtubeVideos.length > 0) && (
          <AnimatedSection direction="up" delay={0.4}>
            <section className="py-12 md:py-14 lg:py-16">
              <div className="container mx-auto">
                <SectionHeader
                  title="Social Bits"
                  subtitle="See the looks in motion"
                  align="left"
                />
                <SocialBitsSection
                  reels={reels}
                  youtubeVideos={youtubeVideos}
                  maxItems={8}
                  useCarousel={true}
                />
                {(reels.length + youtubeVideos.length > 0) && (
                  <div className="mt-6 text-center md:mt-8 lg:mt-10">
                    <Link href="/social">
                      <Button variant="outline" className="text-sm md:text-base">
                        Show all <ArrowRight className="ml-2 h-4 w-4" />
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

        {/* Location Map */}
        {(contact as any)?.location?.latitude && (contact as any)?.location?.longitude && (
          <AnimatedSection direction="up" delay={0.6}>
            <section className="w-full py-12 md:py-14 lg:py-16">
              <div className="container mx-auto px-4">
                <LocationMap
                  poojaLocation={{
                    latitude: (contact as any).location.latitude,
                    longitude: (contact as any).location.longitude,
                    address: (contact as any).location.address,
                  }}
                />
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Testimonials */}
        {transformedTestimonials.length > 0 && (
          <AnimatedSection direction="up" delay={0.7}>
            <TestimonialsCarousel testimonials={transformedTestimonials} />
          </AnimatedSection>
        )}

      </main>

      {/* Footer */}
      <SiteFooter
        instagramHandle={contact?.instagramHandle}
        email={contact?.email}
        phone={contact?.phoneNumber}
        whatsappNumber={contact?.whatsappNumber}
        youtubeChannelUrl={contact?.youtubeChannelUrl}
      />

      {/* Media Lightbox */}
      <MediaLightbox
        items={allMedia}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />

    </>
  );
}

