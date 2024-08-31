import { SUPPORTED_BETTING_TOKENS } from "@/constants/actions";
import { BET_STATUS, BET_TX_STATUS } from "@/constants/bets";
import { MATCH_WIN_DISTRIBUTION_STATUS } from "@/constants/matches";
import { apiEnv } from "@/env/api";
import { getMatchTeams } from "@/lib/cricket-data";
import { getSolanaConnection } from "@/lib/solana";
import { extractErrorMessage, formatMatchDateTime } from "@/lib/utils";
import { blinksightClient } from "@/services/blinksight";
import { cricketDataService } from "@/services/cricket-data";
import {
    ActionGetResponse,
    createPostResponse,
    type ActionPostRequest,
} from "@solana/actions";
import {
    createTransfer,
    encodeURL,
    type CreateTransferFields,
} from "@solana/pay";
import { ComputeBudgetProgram, Keypair, PublicKey } from "@solana/web3.js";
import Big from "big.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "../../../../../../../convex/_generated/api";

type Params = {
    params: {
        matchId: string;
    };
};

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { matchId } = params;

        const match = await cricketDataService.getMatchInfo(matchId);

        const isStarted = match.data.matchStarted;

        if (match.status !== "success" || !match.data) {
            return NextResponse.json({ error: "Invalid match id!" });
        }

        const team1 = match.data.teamInfo?.[0] || {
            name: match.data.teams[0],
            shortname: match.data.teams[0].substring(0, 3).toUpperCase(),
            img: "",
        };
        const team2 = match.data.teamInfo?.[1] || {
            name: match.data.teams[1],
            shortname: match.data.teams[1].substring(0, 3).toUpperCase(),
            img: "",
        };

        const label = isStarted
            ? `Betting closed as ${match.data.status}`
            : "Place Bet";

        const result = {
            icon: `${apiEnv.FRONTEND_URL}/og/match/${matchId}.png`,
            description: `${team1.name} vs ${team2.name}\n\n${match.data.venue}\n\n${formatMatchDateTime(
                match.data.date
            )}\n\n${match.data.matchType.toUpperCase()} match`,
            label,
            title: `Place a bet on ${match.data.name}`,
            disabled: isStarted,
            links: {
                actions: [
                    {
                        label: `Place bet`,
                        href: `/api/v1/actions/place-bet/${matchId}?team={team}&token={token}&amount={amount}`,
                        parameters: [
                            {
                                name: "team",
                                label: "Select the team",
                                required: true,
                                type: "select",
                                options: [
                                    {
                                        label: team1.name,
                                        value: team1.name,
                                    },
                                    {
                                        label: team2.name,
                                        value: team2.name,
                                    },
                                ],
                            },
                            {
                                name: "token",
                                label: "Select the token",
                                required: true,
                                type: "select",
                                options: SUPPORTED_BETTING_TOKENS.map(
                                    (token) => {
                                        return {
                                            label: token.symbol,
                                            value: token.symbol,
                                            selected: true,
                                        };
                                    }
                                ),
                            },
                            {
                                name: "amount",
                                label: "Enter the betting amount",
                                required: true,
                                type: "number",
                            },
                        ],
                    },
                ],
            },
        } satisfies ActionGetResponse;

        let payload;

        try {
            payload = await blinksightClient.createActionGetResponseV1(
                req.url,
                result
            );
        } catch (error) {
            payload = result;
        }

        return NextResponse.json(payload);
    } catch (error) {
        console.error("error =>", extractErrorMessage(error));
        return NextResponse.json({ error: "Internal server error!" });
    }
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const { matchId } = params;

        const searchParams = req.nextUrl.searchParams;

        const team = searchParams.get("team");
        const token = searchParams.get("token");
        let amount: Big | string | null = searchParams.get("amount");

        if (!team) {
            return NextResponse.json({ error: "Team is required!" });
        }

        if (!amount) {
            return NextResponse.json({ error: "Amount is required!" });
        }

        const selectedToken = SUPPORTED_BETTING_TOKENS.find(
            (t) => t.symbol === token
        );

        if (!selectedToken) {
            return NextResponse.json({ error: "Invalid token!" });
        }

        amount = Big(amount);

        const body = (await req.json()) as ActionPostRequest;

        const { account } = body;

        try {
            await blinksightClient.trackActionV2(account, req.url);
        } catch (error) {
            console.error("error =>", extractErrorMessage(error));
        }

        if (!account) {
            return NextResponse.json({ error: "Account not found!" });
        }

        const accountPubkey = new PublicKey(account);

        const match = await cricketDataService.getMatchInfo(matchId);

        const seriesInfo = await fetchQuery(
            api.functions.series.queries.getSeriesBySeriesId,
            {
                seriesId: match.data.series_id,
            }
        );

        if (!seriesInfo) {
            throw new Error("Series info not found!");
        }

        const dbMatch = await fetchQuery(
            api.functions.matches.queries.getMatchByMatchId,
            {
                matchId,
                APP_SECRET: apiEnv.APP_SECRET,
            }
        );

        let dbMatchId = dbMatch?._id;

        if (!dbMatchId) {
            dbMatchId = await fetchMutation(
                api.functions.matches.mutations.createMatch,
                {
                    match: {
                        matchId,
                        seriesId: seriesInfo._id,
                        winDistributionStatus:
                            MATCH_WIN_DISTRIBUTION_STATUS.PENDING,
                    },
                    APP_SECRET: apiEnv.APP_SECRET,
                }
            );
        }

        if (!dbMatchId) {
            throw new Error("Failed to find or create match!");
        }

        const { team1, team2 } = getMatchTeams(match.data);

        let selectedTeam: typeof team1;

        if (team === team1.name) {
            selectedTeam = team1;
        } else if (team === team2.name) {
            selectedTeam = team2;
        } else {
            return NextResponse.json({ error: "Invalid team!" });
        }

        if (match.status !== "success" || !match.data) {
            return NextResponse.json({ error: "Invalid match id!" });
        }

        const isStarted = match.data.matchStarted;

        if (isStarted) {
            return NextResponse.json({ error: "Match already started!" });
        }

        let user = await fetchQuery(
            api.functions.users.queries.getUserByWallet,
            {
                wallet: accountPubkey.toBase58(),
                APP_SECRET: apiEnv.APP_SECRET,
            }
        );

        if (!user) {
            user = await fetchMutation(
                api.functions.users.mutations.createNewUser,
                {
                    wallet: accountPubkey.toBase58(),
                    APP_SECRET: apiEnv.APP_SECRET,
                }
            );
        }

        if (!user) {
            throw new Error("Failed to find or create user!");
        }

        let connection = getSolanaConnection(apiEnv.SOLANA_RPC_URL);

        const criklinkKeypair = Keypair.fromSecretKey(
            bs58.decode(apiEnv.WALLET_PRIVATE_KEY)
        );

        const criklinkWallet = criklinkKeypair.publicKey;

        const memo = `Match-Bet-${matchId}-Team-${selectedTeam.name}`;
        const reference = new Keypair().publicKey;

        const transferData = {
            splToken: new PublicKey(selectedToken.address),
            recipient: criklinkWallet,
            amount: new BigNumber(amount.toString()),
            memo,
            reference,
        } satisfies CreateTransferFields;

        const solanaPayUrl = encodeURL(transferData).toString();

        const tx = await createTransfer(
            connection,
            accountPubkey,
            transferData
        );

        const priorityFee = await connection.getRecentPrioritizationFees();

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: priorityFee[0].prioritizationFee,
        });

        tx.add(addPriorityFee);

        const betId = await fetchMutation(
            api.functions.bets.mutations.createBet,
            {
                bet: {
                    amount: amount.toNumber(),
                    matchId: dbMatchId,
                    teamName: selectedTeam.name,
                    tokenMint: selectedToken.address,
                    userId: user._id,
                    solanaPayUrl,
                    status: BET_STATUS.CREATED,
                    txStatus: BET_TX_STATUS.PENDING,
                    isPaidBack: false,
                },
                APP_SECRET: apiEnv.APP_SECRET,
            }
        );

        if (!betId) {
            throw new Error("Failed to create bet!");
        }

        tx.feePayer = accountPubkey;
        tx.recentBlockhash = (
            await getSolanaConnection(
                apiEnv.SOLANA_RPC_URL
            ).getLatestBlockhash()
        ).blockhash;

        const result = await createPostResponse({
            fields: {
                transaction: tx,
                message: "Bet placed successfully!",
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("error =>", extractErrorMessage(error));
        return NextResponse.json({ error: "Internal server error!" });
    }
}
