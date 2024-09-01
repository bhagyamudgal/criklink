"use client";

import { ToastNotificationDisplay } from "@/components/common/ToastNotificationDisplay";
import dynamic from "next/dynamic";
import React from "react";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { CSPostHogProvider } from "./CSPostHogProvider";
import { WalletProvider } from "./WalletProvider";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
    ssr: false,
});

type Providers = React.ComponentProps<"div">;

export function Providers({ children }: Providers) {
    return (
        <CSPostHogProvider>
            <WalletProvider>
                <ConvexClientProvider>
                    <PostHogPageView />
                    {children}
                    <ToastNotificationDisplay />
                </ConvexClientProvider>
            </WalletProvider>
        </CSPostHogProvider>
    );
}
