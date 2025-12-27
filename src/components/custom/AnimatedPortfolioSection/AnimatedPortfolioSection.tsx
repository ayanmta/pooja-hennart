"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface AnimatedPortfolioSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedPortfolioSection({
  children,
  className,
}: AnimatedPortfolioSectionProps) {
  return (
    <section className={cn("relative overflow-visible", className)}>
      {/* Main content - no parallax effects */}
      <div className="relative z-10 overflow-visible">
        {children}
      </div>
    </section>
  );
}

