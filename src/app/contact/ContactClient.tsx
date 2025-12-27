"use client";

import React from "react";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SiteFooter } from "@/components/custom/SiteFooter";
import { ContactSection } from "@/components/custom/ContactSection";
import { BookingForm } from "@/components/custom/BookingForm";
import { LocationMap } from "@/components/custom/LocationMap";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/custom/AnimatedSection";

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
        {/* Contact Section with Social Media */}
        {contact && (
          <AnimatedSection direction="up" delay={0.2}>
            <ContactSection
              whatsappNumber={contact?.whatsappNumber}
              whatsappMessage={contact?.whatsappMessage}
              phoneNumber={contact?.phoneNumber}
              instagramHandle={contact?.instagramHandle}
              facebookUrl={contact?.facebookUrl}
              youtubeChannelUrl={contact?.youtubeChannelUrl}
              email={contact?.email}
              title={contact?.contactTitle || "Get in Touch"}
              subtitle={contact?.contactSubtitle || "Connect with us on your preferred platform"}
            />
          </AnimatedSection>
        )}

        {/* Booking Form */}
        {contact?.showBookingForm && (
          <AnimatedSection direction="up" delay={0.4}>
            <div className="container mx-auto px-4 py-8">
              <div className="mx-auto max-w-2xl">
                <Card className="p-6 md:p-8">
                  <h3 className="mb-4 text-2xl">Book Your Look</h3>
                  <p className="mb-6 text-muted-foreground">
                    Share your date & event details
                  </p>
                  <BookingForm onSubmit={handleBookingSubmit} />
                </Card>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Location Map */}
        {(contact as any)?.location?.latitude && (contact as any)?.location?.longitude && (contact as any)?.location?.showOnMap && (
          <AnimatedSection direction="up" delay={0.6}>
            <div className="w-full py-12 md:py-14 lg:py-16">
              <div className="container mx-auto px-4">
                <LocationMap
                  poojaLocation={{
                    latitude: (contact as any).location.latitude,
                    longitude: (contact as any).location.longitude,
                    address: (contact as any).location.address,
                  }}
                />
              </div>
            </div>
          </AnimatedSection>
        )}
      </main>
      <SiteFooter
        instagramHandle={contact?.instagramHandle}
        email={contact?.email}
        phone={contact?.phoneNumber}
        whatsappNumber={contact?.whatsappNumber}
        youtubeChannelUrl={contact?.youtubeChannelUrl}
      />
    </>
  );
}

