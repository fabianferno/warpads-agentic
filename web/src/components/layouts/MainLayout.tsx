"use client";

import PrivyConnectButton from "@/components/PrivyConnectButton";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { ready, authenticated } = usePrivy();
  const pathname = usePathname();

  const navItems = [
    { name: "Post an Ad", href: "/campaign/create" },
    { name: "Register Agent", href: "/agent/create" },
  ];


  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-gradient-to-br from-black via-gray-900 to-black relative z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4">
              <Image
                className="rounded-md"
                src="/android-chrome-512x512.png"
                alt="Logo"
                width={50}
                height={50}
                priority
              />
              <div>
                <h1 className="text-2xl font-bold">WarpAds</h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered ads for your website
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-cyan-500/10 text-cyan-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-start justify-end">
            <PrivyConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      {ready ? (
        <main className="">{children}</main>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  );
}
