"use client";

import { useActiveSeries } from "@/hooks/series/useActiveSeries";
import { formatSeriesDate } from "@/lib/utils";
import { Calendar, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { Center } from "../common/Center";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function Series() {
    const { results, status, loadMore, isLoading } = useActiveSeries();

    if (isLoading && results.length === 0) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="w-full h-56" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {results.map((series) => (
                <div key={series._id}>
                    <Link href={`/series/${series._id}`} key={series._id}>
                        <Card
                            key={series._id}
                            className="w-full hover:bg-primary-foreground transition-all duration-200 ease-linear"
                        >
                            <CardHeader>
                                <CardTitle>{series.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex items-center space-x-4 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <div>
                                        <p className="text-muted-foreground">
                                            {formatSeriesDate(
                                                series.startDate,
                                                series.endDate
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    <Trophy className="h-4 w-4" />
                                    <div className="flex space-x-2">
                                        <Badge variant="secondary">
                                            ODI: {series.odi}
                                        </Badge>
                                        <Badge variant="secondary">
                                            T20: {series.t20}
                                        </Badge>
                                        <Badge variant="secondary">
                                            Test: {series.test}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    <Users className="h-4 w-4" />
                                    <div>
                                        <p className="text-muted-foreground">
                                            Matches: {series.matches}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            ))}

            {status === "CanLoadMore" && (
                <Center>
                    <Button
                        onClick={() => loadMore(5)}
                        className="mt-4"
                        variant="outline"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Load More"}
                    </Button>
                </Center>
            )}
            {status === "Exhausted" && (
                <Center>
                    <p className="text-muted-foreground mt-4">
                        No more upcoming series.
                    </p>
                </Center>
            )}
        </div>
    );
}
