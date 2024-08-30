"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMatchDateTime } from "@/lib/utils";
import { Match } from "@/types/cricket-data";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function RenderMatchStatusBadge({ match }: { match: Match }) {
    let variant: "default" | "secondary" | "destructive" = "secondary";
    let text = "Upcoming";

    if (match.matchStarted) {
        variant = "default";
        text = "Live";
    }

    if (match.matchEnded) {
        variant = "destructive";
        text = "Ended";
    }

    return <Badge variant={variant}>{text}</Badge>;
}

export function MatchCard({ match }: { match: Match }) {
    console.log({ match });

    if (!match?.teamInfo || match?.teamInfo?.length === 0) {
        return null;
    }

    return (
        <div key={match.id}>
            <Link href={`/matches/${match.id}`}>
                <Card className="w-full hover:bg-primary-foreground transition-all duration-200 ease-linear">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{match.name}</span>
                            <RenderMatchStatusBadge match={match} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            {match.teamInfo.map((team) => (
                                <div
                                    key={team.shortname}
                                    className="flex flex-col items-center"
                                >
                                    <Image
                                        src={team.img}
                                        alt={team.name}
                                        width={64}
                                        height={64}
                                        className="rounded-full"
                                    />
                                    <span className="mt-2 font-semibold">
                                        {team.shortname}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                {formatMatchDateTime(match.dateTimeGMT)}
                            </div>
                            <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {match.venue}
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-center">
                            <Badge variant="outline" className="capitalize">
                                {match.matchType}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}
