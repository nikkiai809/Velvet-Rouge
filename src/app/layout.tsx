import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const display = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velvet Rouge — Global Creative Network",
  description:
    "Velvet Rouge is a private global creative network connecting the world's most creative cities. Mexico City · Tokyo · Seoul · Berlin · Los Angeles · Shanghai. 11 · 11 · 2026.",
  keywords: [
    "Velvet Rouge",
    "global creative network",
    "culture",
    "cities",
    "Mexico City",
    "Tokyo",
    "Seoul",
    "Berlin",
    "Los Angeles",
    "Shanghai",
  ],
  authors: [{ name: "Velvet Rouge" }],
  openGraph: {
    title: "Velvet Rouge — Global Creative Network",
    description:
      "A private global creative network connecting the world's most creative cities.",
    siteName: "Velvet Rouge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velvet Rouge",
    description: "Global Creative Network.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${display.variable} ${sans.variable} antialiased bg-ink text-bone font-sans selection:bg-rouge selection:text-bone`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
