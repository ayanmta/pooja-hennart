"use client";

import * as React from "react";
import {
  MessageCircle,
  Phone,
  Instagram,
  Mail,
  Facebook,
  Youtube,
} from "lucide-react";
import { WhatsAppContactForm } from "@/components/custom/WhatsAppContactForm";
import { cn } from "@/lib/utils/cn";

interface ContactSectionProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  phoneNumber?: string;
  instagramHandle?: string;
  facebookUrl?: string;
  youtubeChannelUrl?: string;
  email?: string;
  title?: string;
  subtitle?: string;
  onSocialClick?: (platform: string, url: string) => void;
}

const socialIcons = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  email: Mail,
  phone: Phone,
};

export function ContactSection({
  whatsappNumber,
  whatsappMessage,
  phoneNumber,
  instagramHandle,
  facebookUrl,
  youtubeChannelUrl,
  email,
  title = "Get in Touch",
  subtitle,
  onSocialClick,
}: ContactSectionProps) {
  const trackSocialClick = React.useCallback(
    (platform: string, url: string) => {
      // Analytics tracking
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "social_click", {
          platform,
          url,
        });
      }
      onSocialClick?.(platform, url);
    },
    [onSocialClick]
  );

  const socialLinks = React.useMemo(() => {
    const links: Array<{
      platform: string;
      url: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
    }> = [];

    if (instagramHandle) {
      const handle = instagramHandle.replace("@", "");
      links.push({
        platform: "instagram",
        url: `https://instagram.com/${handle}`,
        label: "Instagram",
        icon: Instagram,
      });
    }

    if (facebookUrl) {
      links.push({
        platform: "facebook",
        url: facebookUrl,
        label: "Facebook",
        icon: Facebook,
      });
    }

    if (youtubeChannelUrl) {
      links.push({
        platform: "youtube",
        url: youtubeChannelUrl,
        label: "YouTube",
        icon: Youtube,
      });
    }

    if (email) {
      links.push({
        platform: "email",
        url: `mailto:${email}`,
        label: "Email",
        icon: Mail,
      });
    }

    if (phoneNumber) {
      links.push({
        platform: "phone",
        url: `tel:${phoneNumber}`,
        label: "Phone",
        icon: Phone,
      });
    }

    return links;
  }, [instagramHandle, facebookUrl, youtubeChannelUrl, email, phoneNumber]);

  return (
    <section className="py-16 md:py-18 lg:py-20" aria-label="Contact section">
      <div className="container mx-auto">
        {/* Title */}
        {(title || subtitle) && (
          <div className="mb-10 text-center md:text-left md:mb-12 lg:mb-14">
            {title && (
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground sm:text-base md:text-base lg:text-lg">{subtitle}</p>
            )}
          </div>
        )}

        {/* WhatsApp Contact Form - Featured First */}
        {whatsappNumber && (
          <div className="mx-auto mb-10 max-w-2xl md:mb-12 lg:mb-14 lg:max-w-2xl">
            <WhatsAppContactForm
              whatsappNumber={whatsappNumber}
              defaultMessage={whatsappMessage}
            />
          </div>
        )}

        {/* Minimal Social Links - Following shadcn menu principles */}
        {socialLinks.length > 0 && (
          <div className="mx-auto max-w-md md:max-w-lg lg:max-w-xl">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target={link.platform === "email" || link.platform === "phone" ? "_self" : "_blank"}
                    rel={link.platform === "email" || link.platform === "phone" ? undefined : "noopener noreferrer"}
                    onClick={() => trackSocialClick(link.platform, link.url)}
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      "md:px-4 md:py-2.5 md:text-base",
                      "transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "text-muted-foreground"
                    )}
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
