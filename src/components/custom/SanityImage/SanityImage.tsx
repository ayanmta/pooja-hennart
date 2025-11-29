import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface SanityImageProps {
  image: SanityImageSource;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function SanityImage({
  image,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
}: SanityImageProps) {
  const imageUrl = urlFor(image)
    .width(fill ? 1920 : width || 800)
    .height(fill ? 1080 : height || 600)
    .quality(90)
    .url();

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        sizes={sizes || "100vw"}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

