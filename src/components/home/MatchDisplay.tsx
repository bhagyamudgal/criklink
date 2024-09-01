"use client";

import { formatMatchDateTime } from "@/lib/utils";
import type { Match } from "@/types/cricket-data";
import { Calendar, Clock, Loader, MapPin, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { useIsClient } from "usehooks-ts";
import { Center } from "../common/Center";
import { Container } from "../common/Container";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TypographyH1 } from "../ui/typography/typography-h1";
import { MatchBlink } from "./MatchBlink";
import { MatchStatusBadge } from "./MatchStatusBadge";

export function MatchDisplay({ matchInfo }: { matchInfo: Match }) {
    const isClient = useIsClient();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Container id="match" className="space-y-12 py-12">
                <div className="text-center space-y-4">
                    <TypographyH1>{matchInfo.name}</TypographyH1>
                    <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <p>
                            {isClient ? (
                                formatMatchDateTime(matchInfo.dateTimeGMT)
                            ) : (
                                <Loader className="w-4 h-4 animate-spin" />
                            )}
                        </p>
                        <Clock className="w-5 h-5 ml-4" />
                    </div>
                    <Center>
                        <Badge
                            variant="outline"
                            className="w-fit text-lg flex items-center space-x-1"
                        >
                            <Trophy className="w-4 h-4" />
                            <span>{matchInfo.matchType.toUpperCase()}</span>
                        </Badge>
                    </Center>
                </div>

                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
                            <MapPin className="w-6 h-6" />
                            <span>{matchInfo.venue}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center">
                            {matchInfo.teamInfo?.map((team) => (
                                <div
                                    key={team.shortname}
                                    className="text-center space-y-2"
                                >
                                    <Image
                                        src={team.img}
                                        alt={team.name}
                                        width={80}
                                        height={80}
                                        className="mx-auto rounded-full"
                                    />
                                    <p className="font-semibold">{team.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xl font-bold flex items-center justify-center space-x-2">
                                <Users className="w-5 h-5" />
                                <span>{matchInfo.status}</span>
                            </p>
                            {matchInfo.score && (
                                <div className="space-y-1">
                                    {matchInfo.score.map((score, index) => (
                                        <p key={index} className="text-lg">
                                            {score.inning}: {score.r}/{score.w}{" "}
                                            ({score.o} overs)
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center space-x-4">
                            <MatchStatusBadge match={matchInfo} />
                        </div>
                    </CardContent>
                </Card>

                {!matchInfo.matchStarted && <MatchBlink match={matchInfo} />}
            </Container>
        </main>
    );
}
