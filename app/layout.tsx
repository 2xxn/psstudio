import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Umami Cloud. Defaults target the official instance, but any self-hosted
// deployment can override these or disable analytics with an empty website ID.
const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ??
  "8570ed3e-5c4c-439a-bb11-dbbfe0d2295d";
const UMAMI_SRC =
  process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";
const UMAMI_DOMAINS =
  process.env.NEXT_PUBLIC_UMAMI_DOMAINS ?? "photosphere.2xxn.dev";

export const metadata: Metadata = {
  title: "PSStudio - Manage Your Google Street View Photospheres",
  description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
  keywords: ["photosphere", "360 photos", "street view", "google maps", "panorama", "virtual tour", "360 photography", "psstudio"],
  authors: [{ name: "PSStudio" }],
  creator: "PSStudio",
  publisher: "PSStudio",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://photosphere.2xxn.dev",
    siteName: "PSStudio",
    title: "PSStudio - Manage Your Google Street View Photospheres",
    description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "PSStudio - Professional Photosphere Management",
      },
      {
        url: "/preview2.png",
        width: 1200,
        height: 630,
        alt: "PSStudio - Intuitive Street View Editing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSStudio - Manage Your Google Street View Photospheres",
    description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
    images: ["/preview.png", "/preview2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" />
        {UMAMI_WEBSITE_ID && (
          <Script
            src={UMAMI_SRC}
            data-website-id={UMAMI_WEBSITE_ID}
            data-domains={UMAMI_DOMAINS}
            data-exclude-search="true"
            data-exclude-hash="true"
            data-do-not-track="true"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
