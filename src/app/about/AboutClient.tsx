"use client";

import React from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { AboutPoojaSection } from "@/components/custom/AboutPoojaSection";

interface AboutClientProps {
  about: any;
  contact: any;
  logoUrl?: string;
  logoAlt?: string;
}

export function AboutClient({
  about,
  contact,
  logoUrl,
  logoAlt,
}: AboutClientProps) {
  return (
    <>
      <SiteHeader
        variant="solid"
        logoImage={logoUrl}
        logoAlt={logoAlt || "Logo"}
        logoText={logoUrl ? undefined : "Pooja HennArt & Makeover"}
      />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <SectionHeader
            title="About Pooja"
            subtitle="Learn more about the artist"
            align="center"
          />
          {about && (
            <AboutPoojaSection
              image={about?.imageUrl}
              name={about?.name || "Pooja HennArt"}
              bio={about?.bio || ""}
              expertise={about?.expertise || []}
            />
          )}
        </div>
      </main>
      <SiteFooter
        instagramHandle={contact?.instagramHandle}
        email={contact?.email}
        phone={contact?.phoneNumber}
      />
    </>
  );
}

