"use client";

import { useConvexPaginatedQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

const startDate = new Date().toISOString();

export function useActiveSeries() {
    return useConvexPaginatedQuery(
        api.functions.series.queries.getAllSeries,
        { startDate },
        { initialNumItems: 5 }
    );
}
