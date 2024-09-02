"use client";

import "@dialectlabs/blinks/index.css";

import { webEnv } from "@/env/web";
import { extractErrorMessage } from "@/lib/utils";
import type { Match } from "@/types/cricket-data";
import { Action, Blink } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Center } from "../common/Center";

export function MatchBlink({ match }: { match: Match }) {
    const { connected } = useWallet();

    const actionApiUrl = `${webEnv.NEXT_PUBLIC_API_URL}/actions/place-bet/${match.id}`;

    const { adapter } = useActionSolanaWalletAdapter(
        webEnv.NEXT_PUBLIC_SOLANA_RPC_URL
    );

    const [action, setAction] = useState<Action | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            setIsLoading(true);
            Action.fetch(actionApiUrl).then((action) => {
                action.setAdapter(adapter);
                setAction(action);
            });
        } catch (error) {
            console.log("action fetching error =>", error);
            setError(extractErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }, [actionApiUrl, adapter, connected]);

    if (isLoading) {
        return (
            <Center className="flex-col gap-2">
                <Loader2 className="animate-spin" />
                <p>Loading Blink</p>
            </Center>
        );
    }

    if (error) {
        return <p>Failed to load Blink: {error}</p>;
    }

    if (!connected) {
        return (
            <Center>
                <p className="text-lg text-white">
                    Connect your wallet to place a bet!
                </p>
            </Center>
        );
    }

    return action ? (
        <Center>
            <div className="w-full max-w-[500px]">
                <Blink
                    websiteUrl="https://crik.link"
                    action={action}
                    stylePreset="x-dark"
                    websiteText="crik.link"
                />
            </div>
        </Center>
    ) : null;
}
