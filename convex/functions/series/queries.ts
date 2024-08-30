import { DB_TABLES } from "@/constants/db";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../../_generated/server";

export const getSeriesBySeriesId = query({
    args: { seriesId: DB_TABLES.SERIES.doc.fields.seriesId },
    handler: async (ctx, args) => {
        const series = await ctx.db
            .query(DB_TABLES.SERIES.name)
            .filter((q) => q.eq(q.field("seriesId"), args.seriesId))
            .first();
        return series;
    },
});

export const getSeriesById = query({
    args: { id: v.id(DB_TABLES.SERIES.name) },
    handler: async (ctx, args) => {
        const series = await ctx.db.get(args.id);
        return series;
    },
});

export const getAllSeries = query({
    args: {
        paginationOpts: paginationOptsValidator,
        startDate: v.string(),
    },
    handler: async (ctx, args) => {
        const series = await ctx.db
            .query(DB_TABLES.SERIES.name)
            .withIndex("by_startDate")
            .order("asc")
            .filter((q) => q.gt(q.field("endDate"), args.startDate))
            .paginate(args.paginationOpts);

        return series;
    },
});

export const getAllSeriesWithoutPagination = query({
    handler: async (ctx, args) => {
        const series = await ctx.db.query(DB_TABLES.SERIES.name).collect();

        return series;
    },
});
