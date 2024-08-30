import { NoOp } from "convex-helpers/server/customFunctions";
import {
    zCustomAction,
    zCustomMutation,
    zCustomQuery,
} from "convex-helpers/server/zod";
import { action, mutation, query } from "../../convex/_generated/server";

export const zQuery = zCustomQuery(query, NoOp);
export const zMutation = zCustomMutation(mutation, NoOp);
export const zAction = zCustomAction(action, NoOp);
