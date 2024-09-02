import { MatchDisplay } from "@/components/home/MatchDisplay";
import { getMatchTeams } from "@/lib/cricket-data";
import { type Match } from "@/types/cricket-data";
import { fetchAction } from "convex/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "../../../../convex/_generated/api";

type Params = {
    params: { matchId: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { matchId } = params;

    const matchInfo: Match | null = await fetchAction(
        api.functions.matches.actions.getMatchInfo,
        {
            matchId,
        }
    );

    if (!matchInfo) {
        return {
            title: "Match Not Found",
        };
    }

    const { team1, team2 } = getMatchTeams(matchInfo);

    const title = `${matchInfo.name} - Cricket Match`;
    const description = `Match between ${team1.name} and ${team2.name}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            images: `https://crik.link/og/match/${matchId}.png`,
            siteName: "criklink",
        },
        twitter: {
            title,
            description,
            images: `https://crik.link/og/match/${matchId}.png`,
            card: "summary_large_image",
            site: "criklink",
        },
    };
}

export default async function MatchPage({ params }: Params) {
    const { matchId } = params;

    const matchInfo: Match | null = await fetchAction(
        api.functions.matches.actions.getMatchInfo,
        {
            matchId,
        }
    );

    if (!matchInfo) {
        return notFound();
    }

    matchInfo.dateTimeGMT = new Date(matchInfo.dateTimeGMT).toUTCString();

    return <MatchDisplay matchInfo={matchInfo} />;
}
