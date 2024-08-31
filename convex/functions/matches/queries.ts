import { DB_TABLES } from "@/constants/db";
import { checkAppSecret } from "@/lib/convex";
import { v } from "convex/values";
import { query } from "../../_generated/server";

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
