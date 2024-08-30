type Score = {
    r: number; // runs
    w: number; // wickets
    o: number; // overs
    inning: string;
};

type MatchType = "odi" | "t20" | "test";

export type TeamInfo = {
    name: string;
    shortname: string;
    img: string;
};

export type Match = {
    id: string;
    name: string;
    status: string;
    matchType: MatchType;
    venue: string;
    date: string;
    dateTimeGMT: string;
    teams: string[];
    teamInfo?: TeamInfo[];
    series_id: string;
    fantasyEnabled: boolean;
    bbbEnabled: boolean;
    hasSquad: boolean;
    matchStarted: boolean;
    matchEnded: boolean;
    score?: Score[]; // Keep this optional as it's not present in the JSON
};

export type Series = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    odi: number;
    t20: number;
    test: number;
    squads: number;
    matches: number;
};

export type SeriesInfo = {
    info: Series;
    matchList: Match[];
};

export type CricketDataApiResponse<DataType> = {
    apikey: string;
    data: DataType;
    status: string;
    info: {
        hitsToday: number;
        hitsUsed: number;
        hitsLimit: number;
        credits: number;
        server: number;
        offsetRows: number;
        totalRows: number;
        queryTime: number;
        s?: number;
        cache?: number;
    };
};
