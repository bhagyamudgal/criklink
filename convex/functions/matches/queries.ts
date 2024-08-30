import { cricketDataService } from "@/services/cricket-data";
import { query } from "../../_generated/server";

export const getMatches = query({
    handler: async (ctx) => {
        const response = await cricketDataService.getAllMatches();
        return response;
    },
});
