"use node";

import { BET_STATUS, BET_TX_STATUS } from "@/constants/bets";
import { MATCH_WIN_DISTRIBUTION_STATUS } from "@/constants/matches";
import { apiEnv } from "@/env/api";
import { getMatchWinningTeam } from "@/lib/cricket-data";
import { getSolanaConnection } from "@/lib/solana";
import { cricketDataService } from "@/services/cricket-data";
import { redis, REDIS_KEYS } from "@/services/redis";
import type { Match } from "@/types/cricket-data";
import { createTransfer } from "@solana/pay";
import {
    ComputeBudgetProgram,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import Big from "big.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import { v } from "convex/values";
import { api, internal } from "../../_generated/api";
import { action, internalAction } from "../../_generated/server";

export const getMatchInfo = action({
    args: { matchId: v.string() },
    handler: async (ctx, args) => {
        const cachedMatchInfo = (await redis.get(
            REDIS_KEYS.SERIES_INFO(args.matchId)
        )) as Match | null;

        if (cachedMatchInfo) {
            return cachedMatchInfo;
        }

        const matchInfoResponse = await cricketDataService.getMatchInfo(
            args.matchId
        );

        if (matchInfoResponse.status !== "success") {
            throw new Error("Failed to fetch match info");
        }

        await redis.set(
            REDIS_KEYS.MATCH_INFO(args.matchId),
            JSON.stringify(matchInfoResponse.data),
            {
                ex: 60 * 5, // 5 minutes in seconds
            }
        );

        return matchInfoResponse.data;
    },
});

export const checkAndUpdateMatchWinnerAndStatus = internalAction({
    handler: async (ctx, args) => {
        try {
            const pendingMatches = await ctx.runQuery(
                internal.functions.matches.queries.getAllPendingMatches,
                {}
            );

            console.log("Pending matches =>", pendingMatches);

            for (const match of pendingMatches) {
                console.log("Checking match =>", match);

                try {
                    const matchInfoResponse =
                        await cricketDataService.getMatchInfo(match.matchId);

                    if (matchInfoResponse.status !== "success") {
                        throw new Error(
                            `Failed to fetch match info: ${match.matchId}`
                        );
                    }

                    const matchInfo = matchInfoResponse.data;

                    console.log("Match info =>", matchInfo);

                    if (matchInfo.matchEnded && matchInfo?.matchWinner) {
                        const winningTeam = getMatchWinningTeam(
                            matchInfo,
                            matchInfo.matchWinner
                        );

                        if (!winningTeam) {
                            console.error("Failed to get winning team", {
                                match,
                                matchInfo,
                            });
                            throw new Error(
                                `Failed to get winning team: ${match.matchId}`
                            );
                        }

                        await ctx.runMutation(
                            internal.functions.matches.mutations.updateMatch,
                            {
                                id: match._id,
                                data: {
                                    matchWinner: winningTeam.name,
                                    winDistributionStatus:
                                        MATCH_WIN_DISTRIBUTION_STATUS.STARTED,
                                },
                            }
                        );
                    }
                } catch (error) {
                    console.error(
                        `Failed to update match winner and status: ${match.matchId}`,
                        error
                    );
                }
            }
        } catch (error) {
            console.error("Failed to update match winner and status", error);
        }
    },
});

export const checkAndUpdateBetWinningStatus = internalAction({
    handler: async (ctx, args) => {
        try {
            const startedMatches = await ctx.runQuery(
                internal.functions.matches.queries.getAllStartedMatches,
                {}
            );

            console.log("Started matches =>", startedMatches);

            for (const match of startedMatches) {
                try {
                    console.log("Checking match =>", match);

                    const createdBets = await ctx.runQuery(
                        internal.functions.bets.queries
                            .getAllCreatedBetsByMatchId,
                        {
                            matchId: match._id,
                        }
                    );

                    console.log("Created bets =>", createdBets);

                    for (const bet of createdBets) {
                        try {
                            console.log("Bet =>", bet);

                            if (bet.txStatus === BET_TX_STATUS.PENDING) {
                                await ctx.runMutation(
                                    internal.functions.bets.mutations.updateBet,
                                    {
                                        id: bet._id,
                                        data: {
                                            txStatus: BET_TX_STATUS.FAILED,
                                        },
                                    }
                                );

                                console.log(
                                    "Bet marked as failed as tx was pending!",
                                    bet
                                );

                                continue;
                            }

                            const winningTeam = match.winnerTeam;

                            if (!winningTeam) {
                                console.error("Failed to get winning team", {
                                    match,
                                    bet,
                                });
                                throw new Error(
                                    `Failed to get winning team: ${match._id}`
                                );
                            }

                            if (bet.teamName === winningTeam) {
                                await ctx.runMutation(
                                    internal.functions.bets.mutations.updateBet,
                                    {
                                        id: bet._id,
                                        data: {
                                            status: BET_STATUS.WON,
                                        },
                                    }
                                );
                            } else {
                                await ctx.runMutation(
                                    internal.functions.bets.mutations.updateBet,
                                    {
                                        id: bet._id,
                                        data: {
                                            status: BET_STATUS.LOST,
                                        },
                                    }
                                );
                            }
                        } catch (error) {
                            console.error(
                                `Failed to update bet winning status: ${bet._id}`,
                                error
                            );
                        }
                    }
                } catch (error) {
                    console.error(
                        `Failed to update bet winning status: ${match._id}`,
                        error
                    );
                }
            }
        } catch (error) {
            console.error("Failed to update bet winning status", error);
        }
    },
});

export const calculateWinningAmountForWonBetsForStartedMatches = internalAction(
    {
        handler: async (ctx, args) => {
            try {
                const startedMatches = await ctx.runQuery(
                    internal.functions.matches.queries.getAllStartedMatches,
                    {}
                );

                console.log("Started matches =>", startedMatches);

                for (const match of startedMatches) {
                    try {
                        console.log(
                            "Calculating winning bets for match =>",
                            match
                        );

                        let totalLosingBetsAmount = Big(0);
                        let totalWinningBetsAmount = Big(0);

                        const losingBets = await ctx.runQuery(
                            internal.functions.bets.queries
                                .getAllLosingBetsByMatchId,
                            { matchId: match._id }
                        );

                        for (const bet of losingBets) {
                            totalLosingBetsAmount = totalLosingBetsAmount.plus(
                                Big(bet.amount)
                            );
                        }

                        const winningBets = await ctx.runQuery(
                            internal.functions.bets.queries
                                .getAllWinningBetsByMatchId,
                            { matchId: match._id }
                        );

                        for (const bet of winningBets) {
                            totalWinningBetsAmount =
                                totalWinningBetsAmount.plus(Big(bet.amount));
                        }

                        console.log(
                            "Total losing bets amount =>",
                            totalLosingBetsAmount.toString()
                        );
                        console.log(
                            "Total winning bets amount =>",
                            totalWinningBetsAmount.toString()
                        );

                        for (const bet of winningBets) {
                            try {
                                if (bet?.paidBackAmount !== undefined) {
                                    console.log(
                                        `Skipping Bet ${bet._id} as amount already calculated!`,
                                        {
                                            paidBackAmount: bet.paidBackAmount,
                                        }
                                    );
                                    continue;
                                }

                                const betRatio = Big(bet.amount).div(
                                    totalWinningBetsAmount
                                );
                                const winningAmount = betRatio
                                    .times(totalLosingBetsAmount)
                                    .plus(Big(bet.amount));

                                await ctx.runMutation(
                                    internal.functions.bets.mutations.updateBet,
                                    {
                                        id: bet._id,
                                        data: {
                                            paidBackAmount:
                                                winningAmount.toNumber(),
                                        },
                                    }
                                );
                            } catch (error) {
                                console.error(
                                    `Failed to update bet winning amount: ${bet._id}`,
                                    error
                                );
                            }
                        }

                        await ctx.runMutation(
                            internal.functions.matches.mutations.updateMatch,
                            {
                                id: match._id,
                                data: {
                                    winDistributionStatus:
                                        MATCH_WIN_DISTRIBUTION_STATUS.COMPLETED,
                                },
                            }
                        );
                    } catch (error) {
                        console.error(
                            `Failed to calculate winning bets for match: ${match._id}`,
                            error
                        );
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to calculate winning bets for started matches",
                    error
                );
            }
        },
    }
);

export const distributeUnpaidWinningBetsForCompletedMatches = internalAction({
    handler: async (ctx, args) => {
        try {
            const completedMatches = await ctx.runQuery(
                internal.functions.matches.queries.getAllCompletedMatches,
                {}
            );

            console.log("Completed matches =>", completedMatches);

            for (const match of completedMatches) {
                try {
                    console.log(
                        "Distributing winning bets for match =>",
                        match
                    );

                    const unpaidWinningBets = await ctx.runQuery(
                        internal.functions.bets.queries
                            .getAllUnpaidWinningBetsByMatchId,
                        { matchId: match._id }
                    );

                    for (const bet of unpaidWinningBets) {
                        try {
                            console.log("Bet =>", bet);

                            if (bet?.paidBackAmount) {
                                let connection = getSolanaConnection(
                                    apiEnv.SOLANA_RPC_URL
                                );

                                const criklinkKeypair = Keypair.fromSecretKey(
                                    bs58.decode(apiEnv.WALLET_PRIVATE_KEY)
                                );

                                const criklinkWallet =
                                    criklinkKeypair.publicKey;

                                const user = await ctx.runQuery(
                                    api.functions.users.queries.getUserByWallet,
                                    {
                                        wallet: bet.userId,
                                        APP_SECRET: apiEnv.APP_SECRET,
                                    }
                                );

                                if (!user) {
                                    console.error(
                                        `Failed to get user: ${bet.userId}`
                                    );
                                    throw new Error(
                                        `Failed to get user: ${bet.userId}`
                                    );
                                }

                                const tx = await createTransfer(
                                    connection,
                                    criklinkWallet,
                                    {
                                        recipient: new PublicKey(user.wallet),
                                        amount: new BigNumber(
                                            bet.paidBackAmount
                                        ),
                                        splToken: new PublicKey(bet.tokenMint),
                                        memo: `You won the bet! ${bet.paidBackAmount}`,
                                    }
                                );

                                const priorityFee =
                                    await connection.getRecentPrioritizationFees();

                                const addPriorityFee =
                                    ComputeBudgetProgram.setComputeUnitPrice({
                                        microLamports:
                                            priorityFee[0].prioritizationFee,
                                    });

                                connection = getSolanaConnection(
                                    apiEnv.SOLANA_RPC_URL
                                );

                                tx.add(addPriorityFee);
                                tx.feePayer = criklinkWallet;
                                tx.recentBlockhash = (
                                    await connection.getLatestBlockhash()
                                ).blockhash;

                                const txSig = await sendAndConfirmTransaction(
                                    connection,
                                    tx,
                                    [criklinkKeypair],
                                    {
                                        commitment: "confirmed",
                                    }
                                );

                                console.log("Transaction signature =>", txSig);

                                await ctx.runMutation(
                                    internal.functions.bets.mutations.updateBet,
                                    {
                                        id: bet._id,
                                        data: {
                                            isPaidBack: true,
                                            paidBackAt: new Date().getTime(),
                                            paidBackTx: txSig,
                                        },
                                    }
                                );

                                console.log("Bet updated =>", bet);
                            }
                        } catch (error) {
                            console.error(
                                `Failed to distribute winning bets for bet: ${bet._id}`,
                                error
                            );
                        }
                    }
                } catch (error) {
                    console.error(
                        `Failed to distribute unpaid winning bets for match: ${match._id}`,
                        error
                    );
                }
            }
        } catch (error) {
            console.error(
                "Failed to distribute unpaid winning bets for completed matches",
                error
            );
        }
    },
});
