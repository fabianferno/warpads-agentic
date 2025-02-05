import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";


const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "WarpAds",
  description: "World's first Decentralized Ad Network for AI agents",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://warpads.ai'),
  icons: [
    {
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      url: "/favicon.ico",
      sizes: "any"
    }
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://warpads.xyz",
    title: "WarpAds - Decentralized AI Ad Network",
    description: "World's first Decentralized Ad Network for AI agents",
    siteName: "WarpAds",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "WarpAds Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WarpAds - Decentralized AI Ad Network",
    description: "World's first Decentralized Ad Network for AI agents",
    images: ["/android-chrome-512x512.png"]
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-black`}>
        <Providers appId={process.env.NEXT_PRIVY_APP_ID || ""}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
