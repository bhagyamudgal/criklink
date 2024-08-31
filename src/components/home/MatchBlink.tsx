"use client";

import "@dialectlabs/blinks/index.css";

import { webEnv } from "@/env/web";
import type { Match } from "@/types/cricket-data";
import { Blink, useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";

export function MatchBlink({ match }: { match: Match }) {
    const actionApiUrl = `${webEnv.NEXT_PUBLIC_API_URL}/actions/place-bet/${match.id}`;

    console.log({ actionApiUrl });

    const { adapter } = useActionSolanaWalletAdapter(
        webEnv.NEXT_PUBLIC_SOLANA_RPC_URL
    );

    console.log({ adapter });

    const { action, isLoading } = useAction({
        url: actionApiUrl,
        adapter,
    });

    console.log({ isLoading, action });

    return action ? (
        <Blink
            action={action}
            stylePreset="x-dark"
            websiteText={new URL(actionApiUrl).hostname}
        />
    ) : (
        "Something went wrong!"
    );
}
