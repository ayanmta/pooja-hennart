"use client";

import React from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { cn } from "@/lib/utils/cn";

export interface EditorialCardProps {
  title: string;
  date: string;
  description: string;
  image: SanityImageSource;
  imageAlt?: string;
  galleryLink?: string;
  galleryLinkText?: string;
  className?: string;
  onClick?: () => void;
}

export function EditorialCard({
  title,
  date,
  description,
  image,
  imageAlt,
  galleryLink,
  galleryLinkText = "Ver Album",
  className,
  onClick,
}: EditorialCardProps) {
  const imageUrl = urlFor(image).width(1200).height(800).fit("max").url();
  
  // Format date as DD/MM/YYYY
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (galleryLink) {
      window.open(galleryLink, "_blank");
    }
  };

  return (
    <div
      className={cn(
        "group cursor-pointer transition-transform duration-300 hover:scale-[1.02]",
        className
      )}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Text Block */}
      <div className="bg-white px-6 py-8 text-center">
        {/* Date Label */}
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-sans">
          EDITORIAL {"{"}
          {formattedDate}
          {"}"}
        </p>

        {/* Title with Underline */}
        <h3 className="text-2xl md:text-3xl mb-4 relative inline-block pb-2">
          {title}
          <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground/20"></span>
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground mb-4 font-sans leading-relaxed">
          {description}
        </p>

        {/* Gallery Link / Signature */}
        {galleryLink && (
          <div className="mt-6">
            <span className="text-xs text-foreground/60 font-sans">
              —{" "}
              <span className="italic font-serif text-foreground/80">
                {galleryLinkText}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

