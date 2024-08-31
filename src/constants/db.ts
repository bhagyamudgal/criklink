import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const DB_TABLES = {
    USERS: Table("users", {
        name: v.optional(v.string()),
        wallet: v.string(),
    }),

    SERIES: Table("series", {
        seriesId: v.string(),
        name: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        odi: v.number(),
        t20: v.number(),
        test: v.number(),
        squads: v.number(),
        matches: v.number(),
    }),

    BETS: Table("bets", {
        userId: v.id("users"),
        matchId: v.id("matches"),
        teamName: v.string(),
        amount: v.float64(),
        tokenMint: v.string(),
        solanaPayUrl: v.string(),
        txStatus: v.string(),
        status: v.string(),
        isPaidBack: v.boolean(),
        paidBackAmount: v.optional(v.float64()),
        paidBackAt: v.optional(v.number()),
        paidBackTx: v.optional(v.string()),
    }),

    MATCHES: Table("matches", {
        matchId: v.string(),
        seriesId: v.id("series"),
        winnerTeam: v.optional(v.string()),
        winDistributionStatus: v.string(),
    }),
} as const;
