import { DB_TABLES } from "@/constants/db";
import { MATCH_WIN_DISTRIBUTION_STATUS } from "@/constants/matches";
import { checkAppSecret } from "@/lib/convex";
import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";

export const getMatchByMatchId = query({
    args: {
        matchId: v.string(),
        APP_SECRET: v.string(),
    },
    handler: async (ctx, args) => {
        checkAppSecret(args.APP_SECRET);

        return await ctx.db
            .query(DB_TABLES.MATCHES.name)
            .filter((q) => q.eq(q.field("matchId"), args.matchId))
            .first();
    },
});

export const getAllPendingMatches = internalQuery({
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.MATCHES.name)
            .filter((q) =>
                q.eq(
                    q.field("winDistributionStatus"),
                    MATCH_WIN_DISTRIBUTION_STATUS.PENDING
                )
            )
            .collect();
    },
});

export const getAllStartedMatches = internalQuery({
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.MATCHES.name)
            .filter((q) =>
                q.eq(
                    q.field("winDistributionStatus"),
                    MATCH_WIN_DISTRIBUTION_STATUS.STARTED
                )
            )
            .collect();
    },
});

export const getAllCompletedMatches = internalQuery({
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.MATCHES.name)
            .filter((q) =>
                q.eq(
                    q.field("winDistributionStatus"),
                    MATCH_WIN_DISTRIBUTION_STATUS.COMPLETED
                )
            )
            .collect();
    },
});
