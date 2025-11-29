import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface AboutPoojaSectionProps {
  image?: string;
  name: string;
  bio: string;
  expertise?: string[];
}

export function AboutPoojaSection({
  image,
  name,
  bio,
  expertise,
}: AboutPoojaSectionProps) {
  return (
    <section aria-label="About Pooja" className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          {/* Image */}
          {image && (
            <div className="relative w-full">
              <AspectRatio ratio={3 / 4}>
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </AspectRatio>
            </div>
          )}

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {name}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {bio}
            </p>
            {expertise && expertise.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold">Expertise</h3>
                <ul className="space-y-2">
                  {expertise.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-foreground">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

