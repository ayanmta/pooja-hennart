"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface Category {
  id: string;
  label: string;
}

interface CategoryFilterBarProps {
  categories: Category[];
  onCategoryChange?: (categoryId: string | null) => void;
  defaultCategory?: string | null;
}

export function CategoryFilterBar({
  categories,
  onCategoryChange,
  defaultCategory = null,
}: CategoryFilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategory
  );

  // Sync internal state with prop changes (URL changes)
  useEffect(() => {
    setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  return (
    <nav
      aria-label="Filter categories"
      className="flex gap-2 border-b border-border pb-4 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
    >
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => {
          setSelectedCategory(null);
          onCategoryChange?.(null);
        }}
        className="rounded-full whitespace-nowrap flex-shrink-0"
        aria-pressed={selectedCategory === null}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.id)}
          className="rounded-full whitespace-nowrap flex-shrink-0"
          aria-pressed={selectedCategory === category.id}
        >
          {category.label}
        </Button>
      ))}
    </nav>
  );
}

