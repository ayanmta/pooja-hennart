"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface DistanceDisplayProps {
  distanceKm: number;
  travelTimeMinutes: number;
  className?: string;
}

export function DistanceDisplay({
  distanceKm,
  travelTimeMinutes,
  className,
}: DistanceDisplayProps) {
  const formatTravelTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minute${mins > 1 ? "s" : ""}`;
  };

  return (
    <div className={cn("text-center space-y-1", className)}>
      <p className="text-2xl font-bold">{distanceKm} km away</p>
      <p className="text-sm text-muted-foreground">
        Estimated travel time: {formatTravelTime(travelTimeMinutes)}
      </p>
    </div>
  );
}
