import { Container } from "@/components/common/Container";
import { MatchCard } from "@/components/home/MatchCard";
import { Badge } from "@/components/ui/badge";
import { TypographyH1 } from "@/components/ui/typography/typography-h1";
import { TypographyH2 } from "@/components/ui/typography/typography-h2";
import { formatSeriesDate } from "@/lib/utils";
import { SeriesInfo } from "@/types/cricket-data";
import { fetchAction } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

type Params = {
    params: { seriesId: string };
};

export default async function SeriesPage({ params }: Params) {
    const { seriesId } = params;

    const seriesInfo: SeriesInfo | null = await fetchAction(
        api.functions.series.actions.getSeriesInfo,
        {
            id: seriesId as Id<"series">,
        }
    );

    if (!seriesInfo) {
        return notFound();
    }

    const { info } = seriesInfo;

    let { matchList } = seriesInfo;

    matchList = matchList.sort((a, b) => {
        return a.matchStarted ? 1 : b.matchStarted ? -1 : 0;
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Container id="series" className="space-y-12 py-12">
                <div className="text-center space-y-4">
                    <TypographyH1>{info.name}</TypographyH1>
                    <p className="text-lg text-gray-600">
                        {formatSeriesDate(info.startDate, info.endDate)}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Badge variant="outline">{info.odi} ODI</Badge>
                        <Badge variant="outline">{info.t20} T20</Badge>
                        <Badge variant="outline">{info.test} Test</Badge>
                    </div>
                </div>

                <div className="space-y-8">
                    <TypographyH2 className="text-center">Matches</TypographyH2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchList.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </div>
            </Container>
        </main>
    );
}
