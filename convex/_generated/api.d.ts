/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_matches_queries from "../functions/matches/queries.js";
import type * as functions_series_actions from "../functions/series/actions.js";
import type * as functions_series_mutations from "../functions/series/mutations.js";
import type * as functions_series_queries from "../functions/series/queries.js";
import type * as functions_users_queries from "../functions/users/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/matches/queries": typeof functions_matches_queries;
  "functions/series/actions": typeof functions_series_actions;
  "functions/series/mutations": typeof functions_series_mutations;
  "functions/series/queries": typeof functions_series_queries;
  "functions/users/queries": typeof functions_users_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
