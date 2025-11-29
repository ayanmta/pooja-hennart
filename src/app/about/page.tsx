import React from "react";
import { AboutClient } from "./AboutClient";
import { getAbout, getContact, getHero } from "@/lib/sanity/queries";

export default async function AboutPage() {
  const [about, contact, hero] = await Promise.all([
    getAbout(),
    getContact(),
    getHero(),
  ]);

  return (
    <AboutClient
      about={about}
      contact={contact}
      logoUrl={hero?.logoUrl}
      logoAlt={hero?.logoAlt}
    />
  );
}
