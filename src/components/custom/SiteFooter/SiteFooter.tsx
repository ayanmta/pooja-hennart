import React from "react";
import Link from "next/link";
import { Instagram, Mail, Phone, MessageCircle, Youtube } from "lucide-react";

interface SiteFooterProps {
  instagramHandle?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  youtubeChannelUrl?: string;
}

export function SiteFooter({
  instagramHandle,
  email,
  phone,
  whatsappNumber,
  youtubeChannelUrl,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto py-8 md:py-10 lg:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">Pooja HennArt & Makeover</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional Bridal Makeup & Mehendi Artist
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-[#25D366]"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {instagramHandle && (
                <a
                  href={`https://instagram.com/${instagramHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {youtubeChannelUrl && (
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-[#FF0000]"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Phone"
                >
                  <Phone className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 md:mt-12 lg:mt-16 border-t border-border pt-6 md:pt-8 text-center text-sm md:text-base text-muted-foreground">
          <p>© {currentYear} Pooja HennArt & Makeover. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

