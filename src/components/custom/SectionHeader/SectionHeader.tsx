import React from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 md:mb-7 lg:mb-8",
        align === "center" 
          ? "text-center" 
          : "text-center md:text-left",
        className
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground sm:text-base md:text-base lg:text-lg lg:mt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
}

