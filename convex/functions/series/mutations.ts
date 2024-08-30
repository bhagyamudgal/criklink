import { DB_TABLES } from "@/constants/db";
import { v } from "convex/values";
import { internalMutation } from "../../_generated/server";

export const saveSeries = internalMutation({
    args: DB_TABLES.SERIES.withoutSystemFields,
    handler: async (ctx, args) => {
        return await ctx.db.insert(DB_TABLES.SERIES.name, args);
    },
});

export const updateSeries = internalMutation({
    args: {
        id: v.id(DB_TABLES.SERIES.name),
        data: v.object({
            startDate: v.optional(DB_TABLES.SERIES.doc.fields.startDate),
            endDate: v.optional(DB_TABLES.SERIES.doc.fields.endDate),
        }),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, args.data);
    },
});
