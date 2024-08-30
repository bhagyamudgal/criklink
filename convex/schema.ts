import { DB_TABLES } from "@/constants/db";
import { defineSchema } from "convex/server";

export default defineSchema({
    [DB_TABLES.USERS.name]: DB_TABLES.USERS.table.index("by_wallet", [
        "wallet",
    ]),
    [DB_TABLES.SERIES.name]: DB_TABLES.SERIES.table
        .index("by_seriesId", ["seriesId"])
        .index("by_startDate", ["startDate"]),
});
