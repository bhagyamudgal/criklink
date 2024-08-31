import { DB_TABLES } from "@/constants/db";
import { checkAppSecret } from "@/lib/convex";
import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const createNewUser = mutation({
    args: {
        wallet: DB_TABLES.USERS.doc.fields.wallet,
        APP_SECRET: v.string(),
    },
    handler: async (ctx, args) => {
        checkAppSecret(args.APP_SECRET);

        const newUserId = await ctx.db.insert(DB_TABLES.USERS.name, {
            wallet: args.wallet,
        });

        const user = await ctx.db.get(newUserId);

        return user;
    },
});
