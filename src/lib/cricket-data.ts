import type { Match } from "@/types/cricket-data";

export function getMatchTeams(match: Match) {
    const team1 = match.teamInfo?.[0] || {
        name: match.teams[0],
        shortname: match.teams[0].substring(0, 3).toUpperCase(),
        img: "",
    };

    const team2 = match.teamInfo?.[1] || {
        name: match.teams[1],
        shortname: match.teams[1].substring(0, 3).toUpperCase(),
        img: "",
    };

    return {
        team1,
        team2,
    };
}

export function getMatchWinningTeam(match: Match, matchWinner: string) {
    const { team1, team2 } = getMatchTeams(match);

    if (team1.name === matchWinner || team1.shortname === matchWinner) {
        return team1;
    } else if (team2.name === matchWinner || team2.shortname === matchWinner) {
        return team2;
    }

    return null;
}
