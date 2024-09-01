import { z } from "zod";

export const webEnvSchema = z.object({
    NEXT_PUBLIC_VERCEL_ENV: z
        .union([
            z.literal("production"),
            z.literal("preview"),
            z.literal("development"),
        ])
        .optional()
        .default("development"),
    NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url(),
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
});

export const apiEnvSchema = z.object({
    TZ: z.string().optional().default("Etc/UTC"),
    CRICKET_DATA_API_KEY: z.string(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    FRONTEND_URL: z.string().url(),
    SOLANA_RPC_URL: z.string().url(),
    WALLET_PRIVATE_KEY: z.string(),
    APP_SECRET: z.string(),
    BLINKSIGHT_API_KEY: z.string(),
});

const ENV_CONFIG = {
    NEXT_PUBLIC_VERCEL_ENV: process.env["NEXT_PUBLIC_VERCEL_ENV"],
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env["NEXT_PUBLIC_SOLANA_RPC_URL"],
    NEXT_PUBLIC_CONVEX_URL: process.env["NEXT_PUBLIC_CONVEX_URL"],
    NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"],
    CRICKET_DATA_API_KEY: process.env["CRICKET_DATA_API_KEY"],
    UPSTASH_REDIS_REST_URL: process.env["UPSTASH_REDIS_REST_URL"],
    UPSTASH_REDIS_REST_TOKEN: process.env["UPSTASH_REDIS_REST_TOKEN"],
    FRONTEND_URL: process.env["FRONTEND_URL"],
    SOLANA_RPC_URL: process.env["SOLANA_RPC_URL"],
    WALLET_PRIVATE_KEY: process.env["WALLET_PRIVATE_KEY"],
    APP_SECRET: process.env["APP_SECRET"],
    BLINKSIGHT_API_KEY: process.env["BLINKSIGHT_API_KEY"],
    NEXT_PUBLIC_POSTHOG_KEY: process.env["NEXT_PUBLIC_POSTHOG_KEY"],
};

export function parseEnv<T extends z.ZodRawShape>(envSchema: z.ZodObject<T>) {
    try {
        const envValidationResult = envSchema.safeParse(ENV_CONFIG);

        if (!envValidationResult.success) {
            throw new Error(envValidationResult.error.message);
        }

        return envValidationResult.data;
    } catch (error) {
        console.error("Error parsing web environment variables =>", error);
        throw error;
    }
}
