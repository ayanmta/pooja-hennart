"use client";

import React from "react";
import { Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface PlatformFilterProps {
  currentFilter: "all" | "instagram" | "youtube" | string;
  onFilterChange: (platform: "all" | "instagram" | "youtube") => void;
  className?: string;
}

export function PlatformFilter({
  currentFilter,
  onFilterChange,
  className,
}: PlatformFilterProps) {
  const filters: Array<{ value: "all" | "instagram" | "youtube"; label: string; icon?: React.ReactNode }> = [
    { value: "all", label: "All" },
    { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
  ];

  return (
    <div className={cn("flex gap-2 mt-6", className)}>
      {filters.map((filter) => {
        const isActive = currentFilter === filter.value;
        return (
          <Button
            key={filter.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "flex items-center gap-2",
              isActive && "bg-primary text-primary-foreground"
            )}
          >
            {filter.icon}
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
