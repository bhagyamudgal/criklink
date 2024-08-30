import { cricketDataService } from "@/services/cricket-data";
import { redis, REDIS_KEYS } from "@/services/redis";
import type { Match } from "@/types/cricket-data";
import { v } from "convex/values";
import { action } from "../../_generated/server";

export const getMatchInfo = action({
    args: { matchId: v.string() },
    handler: async (ctx, args) => {
        const cachedMatchInfo = (await redis.get(
            REDIS_KEYS.SERIES_INFO(args.matchId)
        )) as Match | null;

        if (cachedMatchInfo) {
            return cachedMatchInfo;
        }

        const matchInfoResponse = await cricketDataService.getMatchInfo(
            args.matchId
        );

        if (matchInfoResponse.status !== "success") {
            throw new Error("Failed to fetch match info");
        }

        await redis.set(
            REDIS_KEYS.MATCH_INFO(args.matchId),
            JSON.stringify(matchInfoResponse.data),
            {
                nx: true,
                ex: 60 * 5, // 5 minutes in seconds
            }
        );

        return matchInfoResponse.data;
    },
});
