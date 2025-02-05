"use client";

import PrivyConnectButton from "@/components/PrivyConnectButton";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full  bg-gradient-to-br from-black via-gray-900 to-black ">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              className="rounded-md"
              src="/logo.gif"
              alt="Logo"
              width={50}
              height={50}
              priority
            />
            <div>
              <h1 className="text-2xl font-bold">some app</h1>
              <p className="text-sm text-muted-foreground">
                this app does something
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <PrivyConnectButton />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="">{children}</main>
    </div>
  );
}
