"use client";

import "@dialectlabs/blinks/index.css";

import { webEnv } from "@/env/web";
import { extractErrorMessage } from "@/lib/utils";
import type { Match } from "@/types/cricket-data";
import { Action, Blink } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Center } from "../common/Center";

export function MatchBlink({ match }: { match: Match }) {
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
    }, [actionApiUrl, adapter]);

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

    return action ? (
        <Center>
            <div className="w-full max-w-[500px]">
                <Blink
                    action={action}
                    stylePreset="x-dark"
                    websiteText={new URL(actionApiUrl).hostname}
                />
            </div>
        </Center>
    ) : null;
}
