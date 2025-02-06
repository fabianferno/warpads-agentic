"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { http } from "wagmi";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import {
  baseSepolia, arbitrumSepolia, seiDevnet
} from "viem/chains";
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

// Create wagmi config with all supported chains
export const config = createConfig({
  chains: [baseSepolia, arbitrumSepolia, seiDevnet],
  transports: {
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [seiDevnet.id]: http(),
  },
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function Providers({ children, appId }: { children: React.ReactNode, appId: string }) {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          logo: "/android-chrome-512x512.png",
          landingHeader: 'Warp Ads is the world\'s first ads network for ai agents',
          loginMessage: 'Welcome to Warp Ads',
          theme: "dark",
          showWalletLoginFirst: true,
          walletChainType: "ethereum-only",
          walletList: ['metamask', 'rainbow', 'wallet_connect'],
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: true,
        },
        loginMethods: ["email", "wallet", "google", 'twitter'],
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia, arbitrumSepolia, seiDevnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider reconnectOnMount={false} config={config}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster theme="dark" richColors className="bg-zinc-900 rounded-lg shadow-inner text-cyan-500" closeButton position="bottom-right" />
          </ThemeProvider>
        </WagmiProvider>
      </QueryClientProvider>



    </PrivyProvider>
  );
}
