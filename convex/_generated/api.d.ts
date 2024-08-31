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
import type * as crons from "../crons.js";
import type * as functions_bets_actions from "../functions/bets/actions.js";
import type * as functions_bets_mutations from "../functions/bets/mutations.js";
import type * as functions_bets_queries from "../functions/bets/queries.js";
import type * as functions_matches_actions from "../functions/matches/actions.js";
import type * as functions_matches_mutations from "../functions/matches/mutations.js";
import type * as functions_matches_queries from "../functions/matches/queries.js";
import type * as functions_series_actions from "../functions/series/actions.js";
import type * as functions_series_mutations from "../functions/series/mutations.js";
import type * as functions_series_queries from "../functions/series/queries.js";
import type * as functions_users_mutations from "../functions/users/mutations.js";
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
  crons: typeof crons;
  "functions/bets/actions": typeof functions_bets_actions;
  "functions/bets/mutations": typeof functions_bets_mutations;
  "functions/bets/queries": typeof functions_bets_queries;
  "functions/matches/actions": typeof functions_matches_actions;
  "functions/matches/mutations": typeof functions_matches_mutations;
  "functions/matches/queries": typeof functions_matches_queries;
  "functions/series/actions": typeof functions_series_actions;
  "functions/series/mutations": typeof functions_series_mutations;
  "functions/series/queries": typeof functions_series_queries;
  "functions/users/mutations": typeof functions_users_mutations;
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
