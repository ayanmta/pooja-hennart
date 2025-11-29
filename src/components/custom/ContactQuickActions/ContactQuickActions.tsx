"use client";

import React from "react";
import { MessageCircle, Phone, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContactQuickActionsProps {
  whatsappNumber: string;
  phoneNumber?: string;
  instagramHandle?: string;
  email?: string;
  showBookingForm?: boolean;
}

export function ContactQuickActions({
  whatsappNumber,
  phoneNumber,
  instagramHandle,
  email,
  showBookingForm = false,
}: ContactQuickActionsProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  const phoneUrl = phoneNumber ? `tel:${phoneNumber}` : undefined;
  const instagramUrl = instagramHandle
    ? `https://instagram.com/${instagramHandle.replace("@", "")}`
    : undefined;
  const emailUrl = email ? `mailto:${email}` : undefined;

  return (
    <Card className="mx-auto max-w-2xl p-8 text-center">

          {/* Quick Action Buttons - Stacked */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => window.open(whatsappUrl, "_blank")}
              aria-label={`Chat on WhatsApp: ${whatsappNumber}`}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat on WhatsApp
            </Button>
            {phoneUrl && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.open(phoneUrl)}
                aria-label={`Call Pooja: ${phoneNumber}`}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Pooja
              </Button>
            )}
            {instagramUrl && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.open(instagramUrl, "_blank")}
                aria-label={`View Instagram: @${instagramHandle}`}
              >
                <Instagram className="mr-2 h-5 w-5" />
                View Instagram
              </Button>
            )}
            {emailUrl && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.open(emailUrl)}
                aria-label={`Send email to: ${email}`}
              >
                <Mail className="mr-2 h-5 w-5" />
                Email
              </Button>
            )}
          </div>

          {/* Optional Booking Form */}
          {showBookingForm && (
            <div className="mt-8 border-t border-border pt-8">
              <p className="mb-4 text-sm text-muted-foreground">
                Booking form coming soon
              </p>
            </div>
          )}
    </Card>
  );
}

