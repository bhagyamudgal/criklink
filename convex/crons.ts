import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "Check and update bet tx status",
    { minutes: 5 },
    internal.functions.bets.actions.checkAndUpdateBetTxStatus,
    {}
);

export default crons;
