"use client";

import FaucetModal from "@/components/FaucetModal";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SwitchNetwork from "@/components/SwitchNetwork";
import { UserPill } from "@privy-io/react-auth/ui";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    ready,
    user,
    authenticated,
    login,
    connectWallet,
    logout,
    linkWallet,
  } = usePrivy();
  const pathname = usePathname();

  const navItems = [
    { name: "Post an Ad", href: "/campaign/create" },
    { name: "Register Agent", href: "/agent/register" },
    { name: "My Agents", href: "/agent/myagents" },
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
              <div className="hidden md:block">
                <h1 className="text-3xl md:text-lg font-bold">WarpAds</h1>
                <p className="text-xs text-muted-foreground">
                  Ads for AI Agents
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <FaucetModal />
            {ready && (
              <div className="flex justify-end items-center gap-2 mr-2">
                <SwitchNetwork />
                <UserPill ui={{ background: "secondary" }} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800 relative">
        <div className="container mx-auto px-4">
          <nav className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors border-b-2 relative z-10 hover:bg-white/5",
                  pathname === item.href
                    ? "border-cyan-500 text-cyan-500"
                    : "border-transparent text-slate-400 hover:text-white hover:border-slate-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

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
