"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type MediaItem } from "@/lib/types/media";
import { cn } from "@/lib/utils/cn";

interface FeaturedLooksProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem) => void;
}

export function FeaturedLooks({ items, onItemClick }: FeaturedLooksProps) {
  if (items.length === 0) {
    return (
      <section aria-label="Featured looks" className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto">
          <p className="text-center text-muted-foreground">
            No featured looks available
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Featured looks" className="py-12 md:py-14 lg:py-16">
      <div className="container mx-auto">
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card
                      className={cn(
                        "group relative w-[280px] shrink-0 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "sm:w-[320px]"
                      )}
                      onClick={() => onItemClick?.(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onItemClick?.(item);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${item.caption || "featured look"}`}
                    >
                      <AspectRatio ratio={4 / 5}>
                        <Image
                          src={item.thumbnail || item.src}
                          alt={item.caption || "Featured look"}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                          sizes="(max-width: 640px) 280px, 320px"
                        />
                        <motion.div
                          className="absolute inset-0 bg-black/0"
                          whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                          transition={{ duration: 0.3 }}
                        />
                        {/* Category Label */}
                        {item.categories && item.categories.length > 0 && (
                          <motion.div
                            className="absolute bottom-2 left-2"
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium capitalize backdrop-blur">
                              {item.categories[0]}
                            </span>
                          </motion.div>
                        )}
                      </AspectRatio>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card
                  className={cn(
                    "group relative w-full cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                  onClick={() => onItemClick?.(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onItemClick?.(item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${item.caption || "featured look"}`}
                >
                  <AspectRatio ratio={4 / 5}>
                    <Image
                      src={item.thumbnail || item.src}
                      alt={item.caption || "Featured look"}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/0"
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Category Label */}
                    {item.categories && item.categories.length > 0 && (
                      <motion.div
                        className="absolute bottom-2 left-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium capitalize backdrop-blur">
                          {item.categories[0]}
                        </span>
                      </motion.div>
                    )}
                  </AspectRatio>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

