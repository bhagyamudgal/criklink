"use client";

import logoImg from "@/public/logo.svg";
import { UnifiedWalletButton, useWallet } from "@jup-ag/wallet-adapter";
import Image from "next/image";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { Container } from "./Container";

export function Header() {
    const { connected, publicKey } = useWallet();
    const posthog = usePostHog();

    useEffect(() => {
        if (connected && publicKey) {
            posthog.identify(publicKey.toBase58());
        }
    }, [connected, publicKey, posthog]);

    return (
        <Container>
            <header className="flex justify-between items-center">
                <Link href="/" className="text-2xl text-primary">
                    <Image src={logoImg} alt="criklink-logo" />
                </Link>

                <UnifiedWalletButton
                    buttonClassName="bg-primary"
                    currentUserClassName="bg-primary p-5"
                />
            </header>
        </Container>
    );
}
