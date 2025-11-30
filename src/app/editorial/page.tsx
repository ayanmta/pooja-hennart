import React from "react";
import { EditorialClient } from "./EditorialClient";
import { getEditorialProjects, getHero, getContact } from "@/lib/sanity/queries";

export default async function EditorialPage() {
  const [editorialProjects, hero, contact] = await Promise.all([
    getEditorialProjects(),
    getHero(),
    getContact(),
  ]);

  return (
    <EditorialClient
      projects={editorialProjects}
      logoUrl={hero?.logoUrl}
      logoAlt={hero?.logoAlt}
      contact={contact}
    />
  );
}

