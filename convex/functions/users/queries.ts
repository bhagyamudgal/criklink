import { DB_TABLES } from "@/constants/db";
import { v } from "convex/values";
import { query } from "../../_generated/server";

export const getUserById = query({
    args: {
        userId: v.id(DB_TABLES.USERS.name),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user;
    },
});
