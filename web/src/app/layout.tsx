import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WarpAds",
  description: "World's first Decentralized Ad Network for AI agents",
  icons: ["/android-chrome-512x512.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-black`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
