import { DB_TABLES } from "@/constants/db";
import { sleep } from "@/lib/utils";
import { cricketDataService } from "@/services/cricket-data";
import { redis, REDIS_KEYS } from "@/services/redis";
import type { SeriesInfo } from "@/types/cricket-data";
import { v } from "convex/values";
import { api, internal } from "../../_generated/api";
import { action, internalAction } from "../../_generated/server";

export const getAndSaveSeries = internalAction({
    handler: async (ctx) => {
        const response = await cricketDataService.getAllSeries();
        const totalRows = response.info.totalRows;

        for (const series of response.data) {
            const existingSeries = await ctx.runQuery(
                api.functions.series.queries.getSeriesBySeriesId,
                { seriesId: series.id }
            );
            if (!existingSeries) {
                const startDate = new Date(series.startDate).toISOString();

                const currentYear = new Date(startDate).getFullYear();

                let endDate = series.endDate;

                if (!endDate) {
                    continue;
                }

                console.log("Current year", currentYear);
                console.log("End date", endDate);
                if (
                    typeof endDate === "string" &&
                    /^[A-Za-z]{3}\s\d{1,2}$/.test(endDate)
                ) {
                    const [month, day] = endDate.split(" ");
                    console.log("Month", month);
                    console.log("Day", day);
                    endDate = new Date(
                        `${month} ${day}, ${currentYear}`
                    ).toISOString();
                    console.log("End date", endDate);
                } else {
                    endDate = new Date(endDate).toISOString();
                    console.log("End date", endDate);
                }

                await ctx.runMutation(
                    internal.functions.series.mutations.saveSeries,
                    {
                        name: series.name,
                        seriesId: series.id,
                        startDate,
                        endDate,
                        odi: series.odi,
                        t20: series.t20,
                        test: series.test,
                        squads: series.squads,
                        matches: series.matches,
                    }
                );
            }
        }

        console.log("Total rows", totalRows);

        let offset = response.data.length;

        console.log("Offset", offset);

        while (offset < totalRows) {
            await sleep(200);

            const response = await cricketDataService.getAllSeries(offset);

            console.log("Response", response);

            for (const series of response.data) {
                const existingSeries = await ctx.runQuery(
                    api.functions.series.queries.getSeriesBySeriesId,
                    { seriesId: series.id }
                );

                if (!existingSeries) {
                    const startDate = new Date(series.startDate).toISOString();

                    const currentYear = new Date(startDate).getFullYear();

                    let endDate = series.endDate;

                    if (!endDate) {
                        continue;
                    }

                    console.log("Current year", currentYear);
                    console.log("End date", endDate);
                    if (
                        typeof endDate === "string" &&
                        /^[A-Za-z]{3}\s\d{1,2}$/.test(endDate)
                    ) {
                        const [month, day] = endDate.split(" ");
                        console.log("Month", month);
                        console.log("Day", day);
                        endDate = new Date(
                            `${month} ${day}, ${currentYear}`
                        ).toISOString();
                        console.log("End date", endDate);
                    } else {
                        endDate = new Date(endDate).toISOString();
                        console.log("End date", endDate);
                    }

                    await ctx.runMutation(
                        internal.functions.series.mutations.saveSeries,
                        {
                            name: series.name,
                            seriesId: series.id,
                            startDate,
                            endDate,
                            odi: series.odi,
                            t20: series.t20,
                            test: series.test,
                            squads: series.squads,
                            matches: series.matches,
                        }
                    );
                }
            }

            offset += response.data.length;
        }

        return { success: true };
    },
});

export const fixSeriesDate = internalAction({
    handler: async (ctx) => {
        const series = await ctx.runQuery(
            internal.functions.series.queries.getAllSeriesWithoutPagination,
            {}
        );

        for (const s of series) {
            const currentYear = new Date(s.startDate).getFullYear();

            let endDate = s.endDate;

            console.log("Current year", currentYear);
            console.log("End date", endDate);
            if (
                typeof endDate === "string" &&
                /^[A-Za-z]{3}\s\d{1,2}$/.test(endDate)
            ) {
                const [month, day] = endDate.split(" ");
                console.log("Month", month);
                console.log("Day", day);
                endDate = new Date(
                    `${month} ${day}, ${currentYear}`
                ).toISOString();
                console.log("End date", endDate);
            } else {
                endDate = new Date(endDate).toISOString();
                console.log("End date", endDate);
            }

            await ctx.runMutation(
                internal.functions.series.mutations.updateSeries,
                {
                    id: s._id,
                    data: {
                        endDate,
                    },
                }
            );
        }

        return { success: true };
    },
});

export const getSeriesInfo = action({
    args: { id: v.id(DB_TABLES.SERIES.name) },
    handler: async (ctx, args) => {
        const series = await ctx.runQuery(
            api.functions.series.queries.getSeriesById,
            {
                id: args.id,
            }
        );

        if (!series) {
            return null;
        }

        const cachedSeriesInfo = (await redis.get(
            REDIS_KEYS.SERIES_INFO(series._id)
        )) as SeriesInfo | null;

        if (cachedSeriesInfo) {
            return cachedSeriesInfo;
        }

        const seriesInfoResponse = await cricketDataService.getSeriesInfo(
            series.seriesId
        );

        if (seriesInfoResponse.status !== "success") {
            throw new Error("Failed to fetch series info");
        }

        seriesInfoResponse.data.info.startDate = series.startDate;
        seriesInfoResponse.data.info.endDate = series.endDate;

        await redis.set(
            REDIS_KEYS.SERIES_INFO(series._id),
            JSON.stringify(seriesInfoResponse.data),
            {
                ex: 60 * 5, // 5 minutes
            }
        );

        return seriesInfoResponse.data;
    },
});
