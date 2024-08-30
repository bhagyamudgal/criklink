"use client";

import { webEnv } from "@/env/web";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(webEnv.NEXT_PUBLIC_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
        },
    },
});
convexQueryClient.connect(queryClient);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProvider client={convex}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ConvexProvider>
    );
}
