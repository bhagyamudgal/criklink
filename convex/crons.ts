import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "Check and update bet tx status",
    { minutes: 5 },
    internal.functions.bets.actions.checkAndUpdateBetTxStatus,
    {}
);

crons.interval(
    "Check and update match winner and status",
    { hours: 12 },
    internal.functions.matches.actions.checkAndUpdateMatchWinnerAndStatus,
    {}
);

crons.interval(
    "Check and update bet winning status",
    { hours: 13 },
    internal.functions.matches.actions.checkAndUpdateBetWinningStatus,
    {}
);

crons.interval(
    "Calculate winning bets for started matches",
    { hours: 14 },
    internal.functions.matches.actions
        .calculateWinningAmountForWonBetsForStartedMatches,
    {}
);

crons.interval(
    "Distribute unpaid winning bets for completed matches",
    { hours: 15 },
    internal.functions.matches.actions
        .distributeUnpaidWinningBetsForCompletedMatches,
    {}
);

export default crons;
