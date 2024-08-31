import { SUPPORTED_BETTING_TOKENS } from "@/constants/actions";
import { apiEnv } from "@/env/api";
import { extractErrorMessage, formatMatchDateTime } from "@/lib/utils";
import { cricketDataService } from "@/services/cricket-data";
import {
    ActionGetResponse,
    createPostResponse,
    MEMO_PROGRAM_ID,
    type ActionPostRequest,
} from "@solana/actions";
import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import Big from "big.js";
import { NextResponse, type NextRequest } from "next/server";

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
            icon: `${apiEnv.FRONTEND_URL}/og/match/${matchId}`,
            description: `Place a bet on ${team1.name} or ${team2.name}\n\n${formatMatchDateTime(
                match.data.date
            )}\n\n${match.data.venue}`,
            label,
            title: `${team1.name} vs ${team2.name}`,
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

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: extractErrorMessage(error) });
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

        const tokenDetails = SUPPORTED_BETTING_TOKENS.find(
            (t) => t.symbol === token
        );

        if (!tokenDetails) {
            return NextResponse.json({ error: "Invalid token!" });
        }

        amount = Big(amount);

        const body = (await req.json()) as ActionPostRequest;

        const { account } = body;

        if (!account) {
            return NextResponse.json({ error: "Account not found!" });
        }

        const accountPubkey = new PublicKey(account);

        const match = await cricketDataService.getMatchInfo(matchId);

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

        const memo = `Placing bet on ${selectedTeam.name} for ${amount} ${tokenDetails.symbol}`;

        const tx = new Transaction().add(
            new TransactionInstruction({
                keys: [
                    {
                        pubkey: accountPubkey,
                        isSigner: true,
                        isWritable: true,
                    },
                ],
                data: Buffer.from(memo, "utf-8"),
                programId: new PublicKey(MEMO_PROGRAM_ID),
            })
        );

        tx.feePayer = accountPubkey;
        tx.recentBlockhash = (
            await new Connection(apiEnv.SOLANA_RPC_URL).getLatestBlockhash()
        ).blockhash;

        const result = await createPostResponse({
            fields: {
                transaction: tx,
                message: "Transaction created successfully!",
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("error =>", extractErrorMessage(error));
        return NextResponse.json({ error: extractErrorMessage(error) });
    }
}
