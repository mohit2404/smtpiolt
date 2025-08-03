import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sonner from "@/components/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="Smtpilot" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Sonner />
      </body>
    </html>
  );
}
