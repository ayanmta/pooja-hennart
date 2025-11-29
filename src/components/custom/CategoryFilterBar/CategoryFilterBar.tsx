"use client";

import React, { useState } from "react";
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

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  return (
    <nav
      aria-label="Filter categories"
      className="flex flex-wrap gap-2 border-b border-border pb-4"
    >
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => {
          setSelectedCategory(null);
          onCategoryChange?.(null);
        }}
        className="rounded-full"
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
          className="rounded-full"
          aria-pressed={selectedCategory === category.id}
        >
          {category.label}
        </Button>
      ))}
    </nav>
  );
}

