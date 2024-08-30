import { webEnv } from "@/env/web";
import { Connection } from "@solana/web3.js";

export function shortenWalletAddress(address: string, chars = 4) {
    if (address) {
        return `${address.slice(0, chars)}...${address.slice(chars * -1)}`;
    }

    return null;
}

export function getSolanaConnection() {
    return new Connection(webEnv.NEXT_PUBLIC_SOLANA_RPC_URL, "confirmed");
}
