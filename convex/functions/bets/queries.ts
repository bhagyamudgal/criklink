import { BET_STATUS, BET_TX_STATUS } from "@/constants/bets";
import { DB_TABLES } from "@/constants/db";
import { v } from "convex/values";
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

export const getAllCreatedBetsByMatchId = internalQuery({
    args: {
        matchId: v.id(DB_TABLES.MATCHES.name),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.BETS.name)
            .filter((q) =>
                q.and(
                    q.eq(q.field("matchId"), args.matchId),
                    q.eq(q.field("status"), BET_STATUS.CREATED)
                )
            )
            .withIndex("by_matchId")
            .collect();
    },
});

export const getAllWinningBetsByMatchId = internalQuery({
    args: {
        matchId: v.id(DB_TABLES.MATCHES.name),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.BETS.name)
            .filter((q) =>
                q.and(
                    q.eq(q.field("matchId"), args.matchId),
                    q.eq(q.field("status"), BET_STATUS.WON),
                    q.eq(q.field("txStatus"), BET_TX_STATUS.SUCCESS)
                )
            )
            .withIndex("by_matchId")
            .collect();
    },
});

export const getAllUnpaidWinningBetsByMatchId = internalQuery({
    args: {
        matchId: v.id(DB_TABLES.MATCHES.name),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.BETS.name)
            .filter((q) =>
                q.and(
                    q.eq(q.field("matchId"), args.matchId),
                    q.eq(q.field("status"), BET_STATUS.WON),
                    q.eq(q.field("txStatus"), BET_TX_STATUS.SUCCESS),
                    q.eq(q.field("isPaidBack"), false)
                )
            )
            .withIndex("by_matchId")
            .collect();
    },
});

export const getAllLosingBetsByMatchId = internalQuery({
    args: {
        matchId: v.id(DB_TABLES.MATCHES.name),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query(DB_TABLES.BETS.name)
            .filter((q) =>
                q.and(
                    q.eq(q.field("matchId"), args.matchId),
                    q.eq(q.field("status"), BET_STATUS.LOST)
                )
            )
            .withIndex("by_matchId")
            .collect();
    },
});
