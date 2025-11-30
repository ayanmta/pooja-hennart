import React from "react";
import { PortfolioClient } from "./PortfolioClient";
import { getMediaItems, getCategories, getHero, getContact } from "@/lib/sanity/queries";

export default async function PortfolioPage() {
  const [allMedia, categories, hero, contact] = await Promise.all([
    getMediaItems(),
    getCategories(),
    getHero(),
    getContact(),
  ]);

  return (
    <PortfolioClient
      allMedia={allMedia}
      categories={categories}
      logoUrl={hero?.logoUrl}
      logoAlt={hero?.logoAlt}
      contact={contact}
    />
  );
}
