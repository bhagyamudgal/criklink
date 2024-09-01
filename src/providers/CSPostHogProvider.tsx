"use client";

import { webEnv } from "@/env/web";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
    posthog.init(webEnv.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        loaded: (posthog) => {
            if (webEnv.NEXT_PUBLIC_VERCEL_ENV === "development") {
                posthog.debug();
            }
        },
    });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
