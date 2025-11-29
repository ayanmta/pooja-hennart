"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StaggeredMenu } from "@/components/custom/StaggeredMenu";
import { cn } from "@/lib/utils/cn";

interface SiteHeaderProps {
  variant?: "overlay" | "solid";
  logoText?: string;
  logoImage?: string;
  logoAlt?: string;
  showLanguageToggle?: boolean;
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  socialItems?: Array<{ label: string; link: string }>;
}

export function SiteHeader({
  variant = "solid",
  logoText = "Pooja HennArt & Makeover",
  logoImage,
  logoAlt = "Logo",
  showLanguageToggle = false,
  currentLanguage = "en",
  onLanguageChange,
  socialItems = [],
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  const isOverlay = variant === "overlay";

  useEffect(() => {
    if (isOverlay) {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isOverlay]);

  const menuItems = [
    { label: "Portfolio", link: "/portfolio", ariaLabel: "View portfolio" },
    { label: "Videos", link: "/videos", ariaLabel: "View videos" },
    { label: "About", link: "/about", ariaLabel: "About Pooja" },
    { label: "Contact", link: "/contact", ariaLabel: "Contact" },
  ];

  // Use theme colors for menu layers
  const menuColors = isOverlay && !scrolled
    ? ["hsl(var(--background) / 0.8)", "hsl(var(--muted) / 0.6)"]
    : ["hsl(var(--background))", "hsl(var(--muted))"];

  return (
    <motion.div
      className={cn(
        "z-50 w-full",
        isOverlay
          ? scrolled
            ? "fixed top-0 left-0"
            : "absolute top-0 left-0"
          : "sticky top-0"
      )}
      style={!isOverlay ? { opacity: headerOpacity } : undefined}
      initial={isOverlay ? { y: -100 } : false}
      animate={isOverlay ? { y: 0 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <StaggeredMenu
        position="right"
        colors={menuColors}
        items={menuItems}
        socialItems={socialItems}
        displaySocials={socialItems.length > 0}
        displayItemNumbering={true}
        logoText={logoText}
        logoImage={logoImage}
        logoAlt={logoAlt}
        menuButtonColor={isOverlay && !scrolled ? "hsl(var(--foreground))" : "hsl(var(--foreground))"}
        openMenuButtonColor="hsl(var(--foreground))"
        accentColor="hsl(var(--primary))"
        changeMenuColorOnOpen={true}
        isFixed={false}
        closeOnClickAway={true}
        showLanguageToggle={showLanguageToggle}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
    </motion.div>
  );
}
