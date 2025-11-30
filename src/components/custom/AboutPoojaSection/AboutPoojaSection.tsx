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
    <section aria-label="About Pooja" className="py-12 md:py-14 lg:py-16">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-10 lg:gap-12">
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
          <div className="space-y-5 md:space-y-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
              {name}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-base lg:text-lg">
              {bio}
            </p>
            {expertise && expertise.length > 0 && (
              <div>
                <h3 className="mb-3 text-base font-semibold md:text-base lg:mb-4 lg:text-lg">Expertise</h3>
                <ul className="space-y-2 md:space-y-2.5">
                  {expertise.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground md:text-base">
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

