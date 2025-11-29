import React from "react";
import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";

interface SiteFooterProps {
  instagramHandle?: string;
  email?: string;
  phone?: string;
}

export function SiteFooter({
  instagramHandle,
  email,
  phone,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
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
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Pooja HennArt & Makeover. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

