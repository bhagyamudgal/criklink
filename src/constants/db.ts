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

    MATCHES: Table("matches", {
        name: v.string(),
    }),
} as const;
