"use client";

import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/custom/Logo";
import { cn } from "@/lib/utils/cn";
import "./StaggeredMenu.css";

interface MenuItem {
  label: string;
  link: string;
  ariaLabel?: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  logoText?: string;
  logoImage?: string;
  logoAlt?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  showLanguageToggle?: boolean;
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export function StaggeredMenu({
  position = "right",
  colors,
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl,
  logoText = "Pooja HennArt & Makeover",
  logoImage,
  logoAlt = "Logo",
  menuButtonColor,
  openMenuButtonColor,
  accentColor,
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  showLanguageToggle = false,
  currentLanguage = "en",
  onLanguageChange,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement>(null);
  const plusVRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  const textWrapRef = useRef<HTMLSpanElement>(null);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  // Use theme colors if not provided
  const defaultColors = colors || ["hsl(var(--background))", "hsl(var(--muted))"];
  const defaultAccentColor = accentColor || "hsl(var(--primary))";
  const defaultMenuButtonColor = menuButtonColor || "hsl(var(--foreground))";
  const defaultOpenMenuButtonColor = openMenuButtonColor || "hsl(var(--foreground))";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      const toggleBtn = toggleBtnRef.current;
      
      if (!panel || !plusH || !plusV || !icon || !textInner) {
        // Initialize preLayers as empty array if elements aren't ready
        preLayerElsRef.current = [];
        return;
      }

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        try {
          const layers = preContainer.querySelectorAll<HTMLElement>(".sm-prelayer");
          if (layers && layers.length > 0) {
            preLayers = Array.from(layers);
          }
        } catch (e) {
          console.warn("Error querying prelayers:", e);
        }
      }
      preLayerElsRef.current = preLayers;

      try {
        const offscreen = position === "left" ? -100 : 100;
        // Ensure all elements are valid before passing to GSAP
        const validPreLayers = preLayers.filter((el): el is HTMLElement => el !== null && el !== undefined);
        const elementsToSet: HTMLElement[] = [panel];
        if (validPreLayers.length > 0) {
          elementsToSet.push(...validPreLayers);
        }
        
        if (elementsToSet.length > 0) {
          gsap.set(elementsToSet, { xPercent: offscreen });
        }
        
        // Set individual element properties with null checks
        if (plusH) {
          gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
        }
        if (plusV) {
          gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
        }
        if (icon) {
          gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
        }
        if (textInner) {
          gsap.set(textInner, { yPercent: 0 });
        }
        
        // Set button color directly via style (GSAP can't handle CSS variables)
        if (toggleBtn && defaultMenuButtonColor && typeof defaultMenuButtonColor === "string") {
          if (toggleBtn instanceof HTMLElement) {
            // Check if it's a CSS variable, if so get computed value
            if (defaultMenuButtonColor.includes("var(")) {
              // For CSS variables, set directly via style
              toggleBtn.style.color = defaultMenuButtonColor;
            } else {
              // For regular colors, we can use GSAP
              try {
                gsap.set(toggleBtn, { color: defaultMenuButtonColor });
              } catch {
                toggleBtn.style.color = defaultMenuButtonColor;
              }
            }
          }
        }
      } catch (e) {
        console.warn("Error setting GSAP properties:", e);
      }
    });
    return () => ctx.revert();
  }, [defaultMenuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current || [];
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item"));
    const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>(".sm-socials-link"));

    const layerStates = layers
      .filter(Boolean)
      .map((el) => ({
        el,
        start: Number(gsap.getProperty(el, "xPercent")),
      }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { "--sm-num-opacity": 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    if (!openRef.current) return; // Don't open if state changed
    
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
        // State will be managed by the toggle/close functions
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    // Set busy immediately to prevent multiple close calls
    busyRef.current = true;
    
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current || [];
    if (!panel) {
      busyRef.current = false;
      return;
    }

    const all = [...layers.filter(Boolean), panel].filter(Boolean) as HTMLElement[];
    if (all.length === 0) {
      busyRef.current = false;
      return;
    }
    
    closeTweenRef.current?.kill();
    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        // Reset all elements to initial state
        const itemEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        const numberEls = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item"));
        if (numberEls.length) {
          gsap.set(numberEls, { "--sm-num-opacity": 0 });
        }
        const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
        const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>(".sm-socials-link"));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        
        busyRef.current = false;
        // State will be managed by the toggle/close functions
      },
    });
  }, [position]);

  const animateIcon = useCallback(
    (opening: boolean) => {
      const icon = iconRef.current;
      if (!icon) return;
      spinTweenRef.current?.kill();
      if (opening) {
        spinTweenRef.current = gsap.to(icon, {
          rotate: 225,
          duration: 0.8,
          ease: "power4.out",
          overwrite: "auto",
        });
      } else {
        spinTweenRef.current = gsap.to(icon, {
          rotate: 0,
          duration: 0.35,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      }
    },
    []
  );

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn || !(btn instanceof HTMLElement)) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? defaultOpenMenuButtonColor : defaultMenuButtonColor;
        // GSAP can't handle CSS variables, so use direct style manipulation
        if (targetColor.includes("var(") || defaultMenuButtonColor.includes("var(")) {
          // Use CSS transition for smooth color change with CSS variables
          btn.style.transition = "color 0.3s ease-out";
          btn.style.color = targetColor;
          // Clear transition after animation
          setTimeout(() => {
            btn.style.transition = "";
          }, 300);
        } else {
          // For regular colors, use GSAP
          try {
            colorTweenRef.current = gsap.to(btn, {
              color: targetColor,
              delay: 0.18,
              duration: 0.3,
              ease: "power2.out",
            });
          } catch {
            btn.style.color = targetColor;
          }
        }
      } else {
        // Set initial color
        if (defaultMenuButtonColor.includes("var(")) {
          btn.style.color = defaultMenuButtonColor;
        } else {
          try {
            gsap.set(btn, { color: defaultMenuButtonColor });
          } catch {
            btn.style.color = defaultMenuButtonColor;
          }
        }
      }
    },
    [defaultOpenMenuButtonColor, defaultMenuButtonColor, changeMenuColorOnOpen]
  );

  useEffect(() => {
    const btn = toggleBtnRef.current;
    if (!btn || !(btn instanceof HTMLElement)) return;
    
    if (changeMenuColorOnOpen) {
      const targetColor = openRef.current ? defaultOpenMenuButtonColor : defaultMenuButtonColor;
      // Use direct style for CSS variables
      if (targetColor.includes("var(")) {
        btn.style.color = targetColor;
      } else {
        try {
          gsap.set(btn, { color: targetColor });
        } catch {
          btn.style.color = targetColor;
        }
      }
    } else {
      if (defaultMenuButtonColor.includes("var(")) {
        btn.style.color = defaultMenuButtonColor;
      } else {
        try {
          gsap.set(btn, { color: defaultMenuButtonColor });
        } catch {
          btn.style.color = defaultMenuButtonColor;
        }
      }
    }
  }, [changeMenuColorOnOpen, defaultMenuButtonColor, defaultOpenMenuButtonColor]);

  const animateText = useCallback(
    (opening: boolean) => {
      const inner = textInnerRef.current;
      if (!inner) return;
      textCycleAnimRef.current?.kill();

      // When opening: Menu -> Close
      // When closing: Close -> Menu
      const currentLabel = opening ? "Menu" : "Close";
      const targetLabel = opening ? "Close" : "Menu";
      const cycles = 3;
      const seq: string[] = [currentLabel];
      let last = currentLabel;
      for (let i = 0; i < cycles; i++) {
        last = last === "Menu" ? "Close" : "Menu";
        seq.push(last);
      }
      if (last !== targetLabel) seq.push(targetLabel);
      seq.push(targetLabel);
      setTextLines(seq);

      gsap.set(inner, { yPercent: 0 });
      const lineCount = seq.length;
      const finalShift = ((lineCount - 1) / lineCount) * 100;
      textCycleAnimRef.current = gsap.to(inner, {
        yPercent: -finalShift,
        duration: 0.5 + lineCount * 0.07,
        ease: "power4.out",
      });
    },
    []
  );

  const toggleMenu = useCallback((e?: React.MouseEvent) => {
    // Prevent event propagation to avoid conflicts with click outside
    e?.stopPropagation();
    
    const target = !openRef.current;
    const wasOpen = openRef.current;
    
    // Only proceed if state is actually changing
    if (target === wasOpen) return;
    
    // If closing, allow it even if busy (user wants to close)
    if (!target && busyRef.current) {
      // Force close - kill any running animations
      openTlRef.current?.kill();
      openTlRef.current = null;
      closeTweenRef.current?.kill();
      busyRef.current = false;
    }
    
    // If opening and busy, don't proceed
    if (target && busyRef.current) return;
    
    // Update ref and state synchronously
    openRef.current = target;
    setOpen(target);
    
    // Trigger animations
    if (target) {
      // Opening
      onMenuOpen?.();
      animateIcon(true);
      animateColor(true);
      animateText(true);
      playOpen();
    } else {
      // Closing
      onMenuClose?.();
      animateIcon(false);
      animateColor(false);
      animateText(false);
      playClose();
    }
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback((force = false) => {
    // If already closed, do nothing
    if (!openRef.current) return;
    
    // If busy and not forcing, allow close but kill animations
    if (busyRef.current && !force) {
      // Kill any running animations to allow immediate close
      openTlRef.current?.kill();
      openTlRef.current = null;
      closeTweenRef.current?.kill();
      busyRef.current = false;
    }
    
    // Update state immediately
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    
    // Trigger closing animations
    animateIcon(false);
    animateColor(false);
    animateText(false);
    playClose();
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const panel = panelRef.current;
      const toggleBtn = toggleBtnRef.current;
      
      // Don't close if clicking on toggle button (it handles its own toggle)
      if (toggleBtn && toggleBtn.contains(target)) {
        return;
      }
      
      // Close if clicking outside panel
      if (panel && !panel.contains(target)) {
        event.stopPropagation();
        closeMenu(true); // Force close
      }
    };

    // Use capture phase to catch events early
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [closeOnClickAway, open, closeMenu]);

  const menuItems: MenuItem[] = items.length
    ? items
    : [
        { label: "Portfolio", link: "/portfolio", ariaLabel: "View portfolio" },
        { label: "Videos", link: "/videos", ariaLabel: "View videos" },
        { label: "About", link: "/about", ariaLabel: "About Pooja" },
        { label: "Contact", link: "/contact", ariaLabel: "Contact" },
      ];

  return (
    <div
      className={cn(
        "staggered-menu-wrapper",
        isFixed && "fixed-wrapper",
        className
      )}
      style={
        defaultAccentColor
          ? ({ "--sm-accent": defaultAccentColor } as React.CSSProperties)
          : undefined
      }
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = defaultColors && defaultColors.length ? defaultColors.slice(0, 4) : ["hsl(var(--background))", "hsl(var(--muted))"];
          const arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => (
            <div key={i} className="sm-prelayer" style={{ background: c }} />
          ));
        })()}
      </div>
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <Link
          href="/"
          className="sm-logo"
          aria-label="Go to home page"
          onClick={() => closeMenu()}
        >
          {logoImage ? (
            <Logo
              src={logoImage}
              alt={logoAlt}
              width={110}
              height={24}
              className="sm-logo-img"
            />
          ) : logoUrl ? (
            <Logo
              src={logoUrl}
              alt={logoAlt}
              width={110}
              height={24}
              className="sm-logo-img"
            />
          ) : (
            <span className="sm-logo-text">{logoText}</span>
          )}
        </Link>
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((l, i) => (
                <span className="sm-toggle-line" key={i}>
                  {l}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        <div className="sm-panel-inner">
          <ul
            className="sm-panel-list"
            role="list"
            data-numbering={displayItemNumbering || undefined}
          >
            {menuItems && menuItems.length ? (
              menuItems.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  <Link
                    className="sm-panel-item"
                    href={it.link}
                    aria-label={it.ariaLabel || it.label}
                    data-index={idx + 1}
                    onClick={() => {
                      // Close menu when link is clicked
                      closeMenu();
                    }}
                  >
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>
          {showLanguageToggle && (
            <div className="sm-panel-itemWrap">
              <Button
                variant="outline"
                onClick={() => {
                  onLanguageChange?.(currentLanguage === "en" ? "hi" : "en");
                  closeMenu();
                }}
                className="sm-panel-item-button"
              >
                <Globe className="mr-2 h-4 w-4" />
                {currentLanguage === "en" ? "हिंदी" : "English"}
              </Button>
            </div>
          )}
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

