"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  whatsappMessage?: string;
  className?: string;
}

export function FloatingWhatsApp({
  whatsappNumber,
  whatsappMessage,
  className,
}: FloatingWhatsAppProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    const message = whatsappMessage
      ? encodeURIComponent(whatsappMessage)
      : encodeURIComponent("Hi! I'd like to know more about your services.");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

    // Track analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "floating_whatsapp_click", {});
    }

    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3, ease: "easeOut" }}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "md:bottom-8 md:right-8",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        onClick={handleClick}
        className={cn(
          "group relative flex h-12 w-12 items-center justify-center",
          "rounded-full border border-border bg-background/80 backdrop-blur-sm",
          "shadow-sm transition-all duration-300",
          "hover:bg-accent hover:border-accent-foreground/20",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "active:scale-95"
        )}
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />

        {/* Tooltip on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-popover px-3 py-2 text-sm font-medium text-popover-foreground shadow-md"
            >
              Chat on WhatsApp
              <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rotate-45 bg-popover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

