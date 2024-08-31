import { DB_TABLES } from "@/constants/db";
import { checkAppSecret } from "@/lib/convex";
import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const createMatch = mutation({
    args: {
        match: v.object(DB_TABLES.MATCHES.withoutSystemFields),
        APP_SECRET: v.string(),
    },
    handler: async (ctx, args) => {
        checkAppSecret(args.APP_SECRET);

        const matchId = await ctx.db.insert(DB_TABLES.MATCHES.name, args.match);

        return matchId;
    },
});
