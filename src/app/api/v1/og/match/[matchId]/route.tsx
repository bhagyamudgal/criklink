/* eslint-disable @next/next/no-img-element */
import { getMatchTeams } from "@/lib/cricket-data";
import { extractErrorMessage, formatMatchDateTime } from "@/lib/utils";
import { cricketDataService } from "@/services/cricket-data";
import { redis, REDIS_KEYS } from "@/services/redis";
import type { Match, TeamInfo } from "@/types/cricket-data";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    req: NextRequest,
    { params }: { params: { matchId: string } }
) {
    try {
        let { matchId } = params;

        matchId = matchId.split(".")[0];

        let matchInfo = (await redis.get(
            REDIS_KEYS.MATCH_INFO(matchId)
        )) as Match | null;

        if (!matchInfo) {
            const matchInfoResponse =
                await cricketDataService.getMatchInfo(matchId);
            matchInfo = matchInfoResponse.data;
        }

        if (!matchInfo) {
            return new Response("Match not found", { status: 404 });
        }

        const { team1, team2 } = getMatchTeams(matchInfo);

        const imageResponse = new ImageResponse(
            (
                <div
                    style={{
                        position: "relative",
                        background: "hsl(var(--og-background))",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontFamily: "sans-serif",
                        color: "white",
                        padding: "20px",
                    }}
                >
                    <h1
                        style={{
                            marginTop: "0px",
                            fontSize: 36,
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        {matchInfo.name}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            marginBottom: "20px",
                        }}
                    >
                        <TeamDisplay team={team1} />
                        <div style={{ fontSize: 28, fontWeight: "bold" }}>
                            VS
                        </div>
                        <TeamDisplay team={team2} />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            fontSize: 18,
                        }}
                    >
                        <div
                            style={{
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>{matchInfo.venue}</span>
                        </div>
                        <div
                            style={{
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>
                                {formatMatchDateTime(matchInfo.dateTimeGMT)}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 2l3 3-3 3"></path>
                                <path d="M2 18l3 3 3-3"></path>
                                <path d="M21 5H9"></path>
                                <path d="M3 19h12"></path>
                            </svg>
                            <span>{matchInfo.matchType.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 700,
                height: 450,
            }
        );

        const arrayBuffer = await imageResponse.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=43200, s-maxage=43200",
            },
        });
    } catch (error) {
        console.error("Error in OG image generation:", error);
        return NextResponse.json(
            { error: extractErrorMessage(error) },
            { status: 500 }
        );
    }
}

function TeamDisplay({ team }: { team: TeamInfo }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "200px",
            }}
        >
            <img
                src={team.img}
                alt={team.name}
                width="60"
                height="60"
                style={{ borderRadius: "50%", marginBottom: "10px" }}
            />
            <p
                style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    textAlign: "center",
                }}
            >
                {team.name}
            </p>
        </div>
    );
}
