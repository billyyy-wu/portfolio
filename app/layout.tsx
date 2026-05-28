import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { GlobalScrollReveal } from "@/components/animations/GlobalScrollReveal";
import { PageTransition } from "@/components/animations/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";
import { BackToTopButton } from "@/components/ui/BackToTopButton";

import "./globals.css";

const oppoSans = localFont({
  src: "../public/fonts/oppo-sans-4.0.woff2",
  variable: "--font-oppo-sans",
  display: "swap",
  preload: false,
});

const gothamMedium = localFont({
  src: "../public/fonts/gotham-medium.woff2",
  variable: "--font-gotham-medium",
  weight: "500",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cathrine Understrup | Portfolio",
    template: "%s | Portfolio",
  },
  description:
    "Freelance art director and designer portfolio built with Next.js, Tailwind CSS, Framer Motion, and MDX.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${oppoSans.variable} ${gothamMedium.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <NavBar />
        <main className="flex-1">
          <PageTransition initialDirection="right">{children}</PageTransition>
        </main>
        <Footer />
        <BackToTopButton />
        <GlobalScrollReveal />
      </body>
    </html>
  );
}
