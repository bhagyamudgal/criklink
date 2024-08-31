import { DB_TABLES } from "@/constants/db";
import { checkAppSecret } from "@/lib/convex";
import { v } from "convex/values";
import { internalMutation, mutation } from "../../_generated/server";

export const createBet = mutation({
    args: {
        bet: v.object(DB_TABLES.BETS.withoutSystemFields),
        APP_SECRET: v.string(),
    },
    handler: async (ctx, args) => {
        checkAppSecret(args.APP_SECRET);

        const betId = await ctx.db.insert(DB_TABLES.BETS.name, args.bet);

        return betId;
    },
});

export const updateBet = internalMutation({
    args: {
        id: v.id(DB_TABLES.BETS.name),
        data: v.object({
            txStatus: v.optional(DB_TABLES.BETS.doc.fields.txStatus),
            status: v.optional(DB_TABLES.BETS.doc.fields.status),
            paidBackAmount: v.optional(
                DB_TABLES.BETS.doc.fields.paidBackAmount
            ),
            paidBackAt: v.optional(DB_TABLES.BETS.doc.fields.paidBackAt),
            paidBackTx: v.optional(DB_TABLES.BETS.doc.fields.paidBackTx),
            isPaidBack: v.optional(DB_TABLES.BETS.doc.fields.isPaidBack),
        }),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, args.data);
    },
});
