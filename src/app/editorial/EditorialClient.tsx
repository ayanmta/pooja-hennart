"use client";

import React from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { EditorialGrid, type EditorialProject } from "@/components/custom/EditorialGrid";
import type { SanityEditorial } from "@/lib/sanity/queries";

interface EditorialClientProps {
  projects: SanityEditorial[];
  logoUrl?: string;
  logoAlt?: string;
  contact?: any;
}

export function EditorialClient({
  projects,
  logoUrl,
  logoAlt,
  contact,
}: EditorialClientProps) {
  // Transform Sanity editorial data to EditorialProject format
  const editorialProjects: EditorialProject[] = projects.map((project) => ({
    id: project._id,
    title: project.title,
    date: project.date,
    description: project.description,
    image: project.image,
    imageAlt: project.imageAlt,
    galleryLink: project.galleryLink,
    galleryLinkText: project.galleryLinkText || "Ver Album",
  }));

  return (
    <>
      <SiteHeader
        variant="solid"
        logoImage={logoUrl}
        logoAlt={logoAlt || "Logo"}
        logoText={logoUrl ? undefined : "Pooja HennArt & Makeover"}
      />
      <main className="min-h-screen bg-[#2a2a2a]">
        <div className="container mx-auto py-12 md:py-14 lg:py-16">
          <SectionHeader
            title="Editorial"
            subtitle="Editorial makeup and photography projects"
            align="left"
            className="mb-10 md:mb-12 lg:mb-14"
          />
          <EditorialGrid projects={editorialProjects} />
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

