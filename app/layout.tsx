import "@/styles/globals.css";
import type { Metadata } from "next";
import { EB_Garamond, Geist } from "next/font/google";
import Sonner from "@/components/sonner";
import PWAInit from "@/components/pwa-init";
import IOSInstallPrompt from "@/components/IOSInstallPrompt";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading-serif",
});

export const metadata: Metadata = {
  title: "Smtpilot – Smart Email Campaign Manager",
  description:
    "Smtpilot is a modern email marketing platform to create, send, and track email campaigns with ease.",
  applicationName: "Smtpilot",
  keywords: [
    "email marketing",
    "bulk email",
    "email campaign",
    "smtp",
    "newsletter",
    "email delivery",
    "email sender",
    "supabase",
    "smtpilot",
  ],
  authors: [
    {
      name: "Smtpilot",
      url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    },
  ],
  creator: "Smtpilot",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/icons/icon-192x192.png" },
  },
  openGraph: {
    title: "Smtpilot – Smart Email Campaign Manager",
    description:
      "Create, send, and track email campaigns easily with Smtpilot.",
    url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    siteName: "Smtpilot",
    images: [
      {
        url: "/nikolay-loubet-b12IBsX54dU.jpg",
        width: 1200,
        height: 630,
        alt: "Smtpilot dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smtpilot – Smart Email Campaign Manager",
    description:
      "Send email campaigns with ease. Powered by Supabase + Next.js.",
    images: ["/nikolay-loubet-b12IBsX54dU.jpg"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  generator: "Smtpilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="Smtpilot" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${ebGaramond.variable} antialiased`}
      >
        {children}
        <PWAInit />
        <IOSInstallPrompt />
        <Sonner />
      </body>
    </html>
  );
}
