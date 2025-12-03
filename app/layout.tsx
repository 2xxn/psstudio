import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "PSStudio - Manage Your Google Street View Photospheres",
  description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
  keywords: ["photosphere", "360 photos", "street view", "google maps", "panorama", "virtual tour", "360 photography", "psstudio"],
  authors: [{ name: "PSStudio" }],
  creator: "PSStudio",
  publisher: "PSStudio",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://photosphere.sowinski.tech",
    siteName: "PSStudio",
    title: "PSStudio - Manage Your Google Street View Photospheres",
    description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "PSStudio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSStudio - Manage Your Google Street View Photospheres",
    description: "Professional photosphere management tool for Google Street View. Upload, edit, and manage your 360° photos with an intuitive interface.",
    images: ["/preview.png"],
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
      </body>
    </html>
  );
}
