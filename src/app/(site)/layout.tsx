import React from "react";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { getContact } from "@/lib/sanity/queries";
import { FloatingWhatsAppProvider } from "@/components/custom/FloatingWhatsAppProvider";
import "../globals.css";
import "../../components/custom/StaggeredMenu/StaggeredMenu.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif-alt",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getContact();

  return (
    <div className={`${inter.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} antialiased`}>
      <FloatingWhatsAppProvider
        whatsappNumber={contact?.whatsappNumber}
        whatsappMessage={contact?.whatsappMessage}
      >
        {children}
      </FloatingWhatsAppProvider>
    </div>
  );
}

