"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils/cn";
import type { CategoryCard as CategoryCardType } from "@/lib/types/category";

interface CategoryCardProps {
  category: CategoryCardType;
  onClick?: (href: string) => void;
  className?: string;
}

/**
 * CategoryCard component - displays a category with single template image
 * Uses shadcn/ui Card as base with theme-aware styling
 */
export function CategoryCard({
  category,
  onClick,
  className,
}: CategoryCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(category.href);
    }
  };

  const hasImage = !!category.templateImage;

  return (
    <Link
      href={category.href}
      onClick={handleClick}
      className={cn(
        "block group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg transition-all duration-75",
        className
      )}
      aria-label={`View ${category.categoryLabel} portfolio`}
    >
      <Card
        className={cn(
          "relative overflow-hidden",
          "h-full w-full",
          "transition-all duration-75",
          "group-hover:shadow-lg group-hover:scale-[1.02]",
          "group-active:scale-[0.98]",
          "cursor-pointer"
        )}
      >
        {/* Template Image Container */}
        <AspectRatio ratio={4 / 5} className="relative w-full">
          {hasImage ? (
            <div className="absolute inset-0">
              <Image
                src={category.templateImage.src}
                alt={category.templateImage.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          ) : (
            // Fallback placeholder with gradient
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-medium">
                {category.categoryLabel}
              </span>
            </div>
          )}

          {/* Pinterest-style Text Overlay */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0",
              "bg-gradient-to-t from-black/70 via-black/50 to-transparent",
              "p-4 pt-8"
            )}
          >
            <h3
              className={cn(
                "text-white font-semibold text-lg mb-1",
                "line-clamp-1",
                "drop-shadow-sm"
              )}
            >
              {category.categoryLabel}
            </h3>
            {category.description && (
              <p
                className={cn(
                  "text-white/90 text-sm",
                  "line-clamp-2",
                  "drop-shadow-sm"
                )}
              >
                {category.description}
              </p>
            )}
          </div>
        </AspectRatio>
      </Card>
    </Link>
  );
}

