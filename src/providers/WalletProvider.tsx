import { WalletNotification } from "@/components/wallet/WalletNotification";
import { webEnv } from "@/env/web";

import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import React, { useMemo } from "react";

type WalletProvider = React.ComponentProps<"div">;

export function WalletProvider({ children }: WalletProvider) {
    const wallets = useMemo(() => [], []);

    return (
        <UnifiedWalletProvider
            wallets={wallets}
            config={{
                autoConnect: true,
                env: webEnv.NEXT_PUBLIC_SOLANA_NETWORK,
                metadata: {
                    name: "UnifiedWallet",
                    description: "UnifiedWallet",
                    url: "https://jup.ag",
                    iconUrls: ["https://jup.ag/favicon.ico"],
                },
                notificationCallback: WalletNotification,
                walletlistExplanation: {
                    href: "https://station.jup.ag/docs/additional-topics/wallet-list",
                },
                theme: "dark",
            }}
        >
            {children}
        </UnifiedWalletProvider>
    );
}
