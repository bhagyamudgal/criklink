import { DB_TABLES } from "@/constants/db";
import { checkAppSecret } from "@/lib/convex";
import { v } from "convex/values";
import { query } from "../../_generated/server";

export const getUserByWallet = query({
    args: {
        wallet: DB_TABLES.USERS.doc.fields.wallet,
        APP_SECRET: v.string(),
    },
    handler: async (ctx, args) => {
        checkAppSecret(args.APP_SECRET);

        const user = await ctx.db
            .query(DB_TABLES.USERS.name)
            .filter((q) => q.eq(q.field("wallet"), args.wallet))
            .first();

        return user;
    },
});

export const getUserById = query({
    args: {
        id: v.id(DB_TABLES.USERS.name),
        APP_SECRET: v.string(),
    },
    handler: async (ctx, args) => {
        checkAppSecret(args.APP_SECRET);

        const user = await ctx.db.get(args.id);

        return user;
    },
});
