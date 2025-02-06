'use client';

import { Button } from './ui/button';
import { useAccount } from 'wagmi';
import { useSwitchChain } from 'wagmi';
import { toast } from "sonner";
import { useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
                <Button variant="link" className='text-sm'>
                    {chain?.name || "Select Network"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-black'>
                {chains.map((x) => (
                    <DropdownMenuItem
                        className='cursor-pointer text-sm text-cyan-500 hover:bg-black'
                        key={x.id}
                        disabled={!switchChain || x.id === chain?.id}
                        onClick={() => switchChain?.({ chainId: x.id })}
                    >
                        {x.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SwitchNetwork;
