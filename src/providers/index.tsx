"use client";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WalletProvider } from "./WalletProvider";
import { ToastNotificationDisplay } from "@/components/common/ToastNotificationDisplay";

type Providers = React.ComponentProps<"div">;

const queryClient = new QueryClient();

export function Providers({ children }: Providers) {
    return (
        <WalletProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <ToastNotificationDisplay />
            </QueryClientProvider>
        </WalletProvider>
    );
}
