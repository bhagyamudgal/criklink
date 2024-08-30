import { apiEnv } from "@/env/api";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
    url: apiEnv.UPSTASH_REDIS_REST_URL,
    token: apiEnv.UPSTASH_REDIS_REST_TOKEN,
});

export const REDIS_KEYS = {
    SERIES_INFO: (id: string) => `series_info:${id}`,
    MATCH_INFO: (matchId: string) => `match_info:${matchId}`,
} as const;
