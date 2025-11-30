"use client";

import React from "react";
import { EditorialCard, type EditorialCardProps } from "../EditorialCard";
import { cn } from "@/lib/utils/cn";

export interface EditorialProject {
  id: string;
  title: string;
  date: string;
  description: string;
  image: any;
  imageAlt?: string;
  galleryLink?: string;
  galleryLinkText?: string;
}

export interface EditorialGridProps {
  projects: EditorialProject[];
  className?: string;
  onProjectClick?: (project: EditorialProject) => void;
}

export function EditorialGrid({
  projects,
  className,
  onProjectClick,
}: EditorialGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No editorial projects found.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12",
        className
      )}
    >
      {projects.map((project) => (
        <EditorialCard
          key={project.id}
          title={project.title}
          date={project.date}
          description={project.description}
          image={project.image}
          imageAlt={project.imageAlt}
          galleryLink={project.galleryLink}
          galleryLinkText={project.galleryLinkText}
          onClick={() => onProjectClick?.(project)}
        />
      ))}
    </div>
  );
}

