import { z } from "zod";

const envSchema = z.object({
    TZ: z.string().optional().default("Etc/UTC"),
    NEXT_PUBLIC_VERCEL_ENV: z
        .union([
            z.literal("production"),
            z.literal("preview"),
            z.literal("development"),
        ])
        .optional()
        .default("development"),
    NEXT_PUBLIC_SOLANA_NETWORK: z.union([
        z.literal("devnet"),
        z.literal("mainnet-beta"),
    ]),
    NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url(),
});

const ENV_CONFIG = {
    NEXT_PUBLIC_VERCEL_ENV: process.env["NEXT_PUBLIC_VERCEL_ENV"],
    NEXT_PUBLIC_SOLANA_NETWORK: process.env["NEXT_PUBLIC_SOLANA_NETWORK"],
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env["NEXT_PUBLIC_SOLANA_RPC_URL"],
};

export function parseEnv() {
    try {
        const envValidationResult = envSchema.safeParse(ENV_CONFIG);

        if (!envValidationResult.success) {
            throw new Error(envValidationResult.error.message);
        }

        return envValidationResult.data;
    } catch (error) {
        console.error("Error parsing web environment variables =>", error);
        process.exit(1);
    }
}

export const env = parseEnv();
