import React from "react";
import { ContactClient } from "./ContactClient";
import { getContact, getHero } from "@/lib/sanity/queries";

export default async function ContactPage() {
  const [contact, hero] = await Promise.all([getContact(), getHero()]);

  return (
    <ContactClient
      contact={contact}
      logoUrl={hero?.logoUrl}
      logoAlt={hero?.logoAlt}
    />
  );
}
