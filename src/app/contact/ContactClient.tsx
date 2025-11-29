"use client";

import React from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { ContactQuickActions } from "@/components/custom/ContactQuickActions";
import { BookingForm } from "@/components/custom/BookingForm";
import { Card } from "@/components/ui/card";

interface ContactClientProps {
  contact: any;
  logoUrl?: string;
  logoAlt?: string;
}

export function ContactClient({
  contact,
  logoUrl,
  logoAlt,
}: ContactClientProps) {
  const handleBookingSubmit = async (values: any) => {
    // TODO: Send booking request to API
    console.log("Booking request:", values);
    // For now, open WhatsApp with pre-filled message
    const message = `Hi! I'd like to book:\n\nEvent: ${values.eventType}\nDate: ${values.date}\nCity: ${values.city}\n\n${values.message || ""}`;
    const whatsappUrl = `https://wa.me/${contact?.whatsappNumber?.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <SiteHeader
        variant="solid"
        logoImage={logoUrl}
        logoAlt={logoAlt || "Logo"}
        logoText={logoUrl ? undefined : "Pooja HennArt & Makeover"}
      />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <SectionHeader
            title="Book Your Look"
            subtitle="Share your date & event details"
            align="center"
          />
          <div className="mx-auto max-w-2xl space-y-8">
            {/* Quick Actions */}
            {contact && (
              <ContactQuickActions
                whatsappNumber={contact?.whatsappNumber || ""}
                phoneNumber={contact?.phoneNumber}
                instagramHandle={contact?.instagramHandle}
                email={contact?.email}
                showBookingForm={false}
              />
            )}

            {/* Booking Form */}
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Booking Form</h3>
              <BookingForm onSubmit={handleBookingSubmit} />
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter
        instagramHandle={contact?.instagramHandle}
        email={contact?.email}
        phone={contact?.phoneNumber}
      />
    </>
  );
}

