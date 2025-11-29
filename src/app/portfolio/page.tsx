import React from "react";
import { PortfolioClient } from "./PortfolioClient";
import { getMediaItems, getCategories, getHero } from "@/lib/sanity/queries";

export default async function PortfolioPage() {
  const [allMedia, categories, hero] = await Promise.all([
    getMediaItems(),
    getCategories(),
    getHero(),
  ]);

  return (
    <PortfolioClient
      allMedia={allMedia}
      categories={categories}
      logoUrl={hero?.logoUrl}
      logoAlt={hero?.logoAlt}
    />
  );
}
