"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu } from "lucide-react";
import { Logo } from "@/components/custom/Logo";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  logoAlt = "Pooja HennArt & Makeover",
  showLanguageToggle = false,
  currentLanguage = "en",
  onLanguageChange,
  socialItems = [],
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);

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
    { label: "Home", link: "/", ariaLabel: "Home" },
    { label: "Portfolio", link: "/portfolio", ariaLabel: "View portfolio" },
    { label: "Social Bits", link: "/social", ariaLabel: "View social bits" },
    { label: "About", link: "/about", ariaLabel: "About Pooja" },
    { label: "Contact", link: "/contact", ariaLabel: "Contact" },
  ];

  const isActive = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname?.startsWith(link);
  };

  return (
    <motion.header
      className={cn(
        "z-50 w-full",
        isOverlay
          ? scrolled
            ? "fixed top-0 left-0"
            : "absolute top-0 left-0"
          : "sticky top-0"
      )}
      style={
        !isOverlay
          ? {
              opacity: headerOpacity,
              backdropFilter: `blur(${headerBlur}px)`,
            }
          : scrolled
            ? {
                backdropFilter: `blur(${headerBlur}px)`,
              }
            : undefined
      }
      initial={isOverlay ? { y: -100 } : false}
      animate={isOverlay ? { y: 0 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "container mx-auto flex h-14 items-center justify-between px-4 md:px-6",
          isOverlay && !scrolled
            ? "border-none bg-transparent backdrop-blur-none"
            : "border-b border-border/20 bg-background/95 backdrop-blur-md"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 transition-all duration-300",
            "hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isOverlay && !scrolled
              ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              : "text-foreground"
          )}
          aria-label="Go to home page"
        >
          {logoImage ? (
            <Logo
              src={logoImage}
              alt={logoAlt}
              width={120}
              height={28}
              className={cn(
                "h-7 w-auto transition-all duration-300",
                isOverlay && !scrolled && "brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              )}
              priority
            />
          ) : (
            <span className={cn(
              "font-serif text-lg font-medium tracking-tight",
              isOverlay && !scrolled && "text-white"
            )}>
              {logoText}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
          {menuItems.map((item) => {
            const active = isActive(item.link);
            return (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "relative px-3 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200",
                  "rounded-sm",
                  "hover:bg-background/10 hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isOverlay && !scrolled
                    ? active
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
                aria-label={item.ariaLabel || item.label}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {active && (
                  <motion.div
                    className={cn(
                      "absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2",
                      isOverlay && !scrolled ? "bg-white" : "bg-primary"
                    )}
                    layoutId="activeIndicator"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle isOverlay={isOverlay && !scrolled} />
          {showLanguageToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isOverlay && !scrolled && "text-white hover:bg-white/10"
              )}
              onClick={() => onLanguageChange?.(currentLanguage === "en" ? "hi" : "en")}
              aria-label="Toggle language"
            >
              <span className="text-xs">
                {currentLanguage === "en" ? "हिंदी" : "EN"}
              </span>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isOverlay && !scrolled && "text-white hover:bg-white/10"
                )}
                aria-label="Toggle menu"
              >
                <Menu className={cn(
                  "h-4 w-4",
                  isOverlay && !scrolled && "text-white"
                )} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center">
                  {logoImage ? (
                    <Logo
                      src={logoImage}
                      alt={logoAlt}
                      width={140}
                      height={32}
                      className="h-8 w-auto"
                    />
                  ) : (
                    <span className="text-lg font-semibold">{logoText}</span>
                  )}
                </div>

                <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                  {menuItems.map((item) => {
                    const active = isActive(item.link);
                    return (
                      <Link
                        key={item.link}
                        href={item.link}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                        aria-label={item.ariaLabel || item.label}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {socialItems.length > 0 && (
                  <div className="border-t border-border pt-6">
                    <h3 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                      Social
                    </h3>
                    <div className="flex flex-col gap-2">
                      {socialItems.map((item) => (
                        <a
                          key={item.link}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
