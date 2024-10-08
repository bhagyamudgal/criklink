import { DB_TABLES } from "@/constants/db";
import { defineSchema } from "convex/server";

export default defineSchema({
    [DB_TABLES.USERS.name]: DB_TABLES.USERS.table.index("by_wallet", [
        "wallet",
    ]),

    [DB_TABLES.SERIES.name]: DB_TABLES.SERIES.table
        .index("by_seriesId", ["seriesId"])
        .index("by_startDate", ["startDate"]),

    [DB_TABLES.BETS.name]: DB_TABLES.BETS.table
        .index("by_userId", ["userId"])
        .index("by_matchId", ["matchId"]),

    [DB_TABLES.MATCHES.name]: DB_TABLES.MATCHES.table
        .index("by_matchId", ["matchId"])
        .index("by_seriesId", ["seriesId"]),
});
