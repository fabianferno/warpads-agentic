"use client";

import { Button } from "./ui/button";
import { useAccount } from "wagmi";
import { useSwitchChain } from "wagmi";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { chainLogos } from "@/lib/chainLogos";

const SwitchNetwork = () => {
  const { chain } = useAccount();
  const { chains, error: switchNetworkError, switchChain } = useSwitchChain();

  useEffect(() => {
    if (switchNetworkError) {
      toast.error(switchNetworkError.message);
    }
  }, [switchNetworkError]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="text-sm flex items-center gap-2">
          {chain?.id && chainLogos[chain.id] && (
            <Image
              src={chainLogos[chain.id]}
              alt={chain.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span className="hidden md:inline">
            {chain?.name || "Select Network"}
          </span>
          <ChevronDown className="h-4 w-4 md:ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black">
        {chains.map((x) => (
          <DropdownMenuItem
            className="cursor-pointer text-sm text-cyan-500 hover:bg-black flex items-center gap-2"
            key={x.id}
            disabled={!switchChain || x.id === chain?.id}
            onClick={() => switchChain?.({ chainId: x.id })}
          >
            {chainLogos[x.id] && (
              <Image
                src={chainLogos[x.id]}
                alt={x.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span>{x.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SwitchNetwork;
