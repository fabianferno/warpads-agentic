"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { http } from "wagmi";
import { WagmiProvider } from "wagmi";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { baseSepolia, arbitrumSepolia, seiDevnet } from "viem/chains";
import { createConfig } from "@privy-io/wagmi";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [baseSepolia, arbitrumSepolia, seiDevnet], // Pass your required chains as an array
  transports: {
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [seiDevnet.id]: http(),
  },
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PRIVY_APP_ID || "cm6rexp7r0059pj00tuxlcad3"}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
