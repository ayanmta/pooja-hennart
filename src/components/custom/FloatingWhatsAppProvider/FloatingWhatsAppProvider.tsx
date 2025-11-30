"use client";

import * as React from "react";
import { FloatingWhatsApp } from "@/components/custom/FloatingWhatsApp";

interface FloatingWhatsAppProviderProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  children: React.ReactNode;
}

export function FloatingWhatsAppProvider({
  whatsappNumber,
  whatsappMessage,
  children,
}: FloatingWhatsAppProviderProps) {
  return (
    <>
      {children}
      {whatsappNumber && (
        <FloatingWhatsApp
          whatsappNumber={whatsappNumber}
          whatsappMessage={whatsappMessage}
        />
      )}
    </>
  );
}

