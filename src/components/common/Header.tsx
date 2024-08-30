"use client";

import logoImg from "@/public/logo.svg";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";

export function Header() {
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
