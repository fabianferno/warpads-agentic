import { contractsConfig } from "./const";
import { toast } from "sonner";


export const addTokenToWallet = async (chainId: number) => {

    try {
        // @ts-ignore - window.ethereum is injected by the wallet
        const ethereum = window.ethereum;
        if (ethereum) {

            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: contractsConfig[chainId]?.warpTokenAddress,
                        symbol: 'WARP',
                        decimals: contractsConfig[chainId]?.warpTokenDecimals,
                    },
                },
            });
            toast.success('WARP token added to your wallet!');
        }
    } catch (error) {
        console.error('Error adding token to wallet:', error);
        toast.error('Failed to add token to wallet. Please try adding it manually.');
    }
};