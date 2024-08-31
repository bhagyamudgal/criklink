import { BET_TX_STATUS } from "@/constants/bets";
import { DB_TABLES } from "@/constants/db";
import { internalQuery } from "../../_generated/server";

export const getBetById = internalQuery({
    args: {
        id: DB_TABLES.BETS._id,
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getAllPendingBets = internalQuery({
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.BETS.name)
            .filter((q) => q.eq(q.field("txStatus"), BET_TX_STATUS.PENDING))
            .collect();
    },
});
