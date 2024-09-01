import { MatchDisplay } from "@/components/home/MatchDisplay";
import { type Match } from "@/types/cricket-data";
import { fetchAction } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "../../../../convex/_generated/api";

type Params = {
    params: { matchId: string };
};

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

    console.log({ matchInfo });

    return <MatchDisplay matchInfo={matchInfo} />;
}
