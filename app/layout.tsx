import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bilbord-expo.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bilbord Expo | Izložba banera",
  description: "Bilbord Expo je platforma za izložbu banera gde možete pregledati i upravljati banerima.",
  keywords: "baneri, izložba, reklame, bilbord, oglasi",
  authors: [{ name: "Bilbord Expo" }],
  creator: "Bilbord Expo",
  publisher: "Bilbord Expo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/FINAL LOGO BILBORD-01.png',
    shortcut: '/FINAL LOGO BILBORD-01.png',
    apple: '/FINAL LOGO BILBORD-01.png',
  },
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    url: siteUrl,
    siteName: 'Bilbord Expo',
    title: "Bilbord Expo | Izložba banera",
    description: "Bilbord Expo je platforma za izložbu banera gde možete pregledati i upravljati banerima.",
    images: [
      {
        url: `${siteUrl}/FINAL LOGO BILBORD-01.png`,
        width: 1200,
        height: 630,
        alt: 'Bilbord Expo - Izložba banera',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bilbord Expo | Izložba banera",
    description: "Bilbord Expo je platforma za izložbu banera gde možete pregledati i upravljati banerima.",
    images: [`${siteUrl}/FINAL LOGO BILBORD-01.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}


