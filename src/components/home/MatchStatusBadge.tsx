import type { Match } from "@/types/cricket-data";
import { Badge } from "../ui/badge";

export function MatchStatusBadge({ match }: { match: Match }) {
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
