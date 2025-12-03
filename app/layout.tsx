import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photosphere Studio - Manage Your Google Street View Photospheres",
  description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
  keywords: ["photosphere", "360 photos", "street view", "google maps", "panorama", "virtual tour", "360 photography"],
  authors: [{ name: "Photosphere Studio" }],
  creator: "Photosphere Studio",
  publisher: "Photosphere Studio",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://photosphere.studio",
    siteName: "Photosphere Studio",
    title: "Photosphere Studio - Manage Your Google Street View Photospheres",
    description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Photosphere Studio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photosphere Studio - Manage Your Google Street View Photospheres",
    description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
    images: ["/preview.png"],
    creator: "@photospherestudio",
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
      </body>
    </html>
  );
}
