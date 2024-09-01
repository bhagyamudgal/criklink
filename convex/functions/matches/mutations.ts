import { DB_TABLES } from "@/constants/db";
import { checkAppSecret } from "@/lib/convex";
import { v } from "convex/values";
import { internalMutation, mutation } from "../../_generated/server";

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

export const updateMatch = internalMutation({
    args: {
        id: v.id(DB_TABLES.MATCHES.name),
        data: v.object({
            winnerTeam: v.optional(DB_TABLES.MATCHES.doc.fields.winnerTeam),
            winDistributionStatus: v.optional(
                DB_TABLES.MATCHES.doc.fields.winDistributionStatus
            ),
        }),
    },
    handler: async (ctx, args) => {
        try {
            console.log("Mutation data =>", args.data);
            await ctx.db.patch(args.id, args.data);
        } catch (error) {
            console.error("updateMatch error =>", error);
            throw error;
        }
    },
});
