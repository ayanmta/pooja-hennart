import React, { Suspense } from "react";
import { PortfolioClient } from "./PortfolioClient";
import { getMediaItems, getCategories, getHero, getContact } from "@/lib/sanity/queries";

interface PortfolioPageProps {
  searchParams: { category?: string };
}

function PortfolioContent({
  allMedia,
  categories,
  hero,
  contact,
  initialCategory,
}: {
  allMedia: Awaited<ReturnType<typeof getMediaItems>>;
  categories: Awaited<ReturnType<typeof getCategories>>;
  hero: Awaited<ReturnType<typeof getHero>>;
  contact: Awaited<ReturnType<typeof getContact>>;
  initialCategory: string | null;
}) {
  return (
    <PortfolioClient
      initialMedia={allMedia}
      categories={categories}
      initialCategory={initialCategory}
      logoUrl={hero?.logoUrl}
      logoAlt={hero?.logoAlt}
      contact={contact}
    />
  );
}

export default async function PortfolioPage({
  searchParams,
}: PortfolioPageProps) {
  const [allMedia, categories, hero, contact] = await Promise.all([
    getMediaItems(),
    getCategories(),
    getHero(),
    getContact(),
  ]);

  // Pass all media items - filtering happens client-side for better UX
  // This allows filter changes without full page reload
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PortfolioContent
        allMedia={allMedia}
        categories={categories}
        hero={hero}
        contact={contact}
        initialCategory={searchParams.category || null}
      />
    </Suspense>
  );
}
