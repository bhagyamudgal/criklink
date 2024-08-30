import { apiEnv } from "@/env/api";
import type {
    CricketDataApiResponse,
    Match,
    Series,
    SeriesInfo,
} from "@/types/cricket-data";
import ky from "ky";

class CricketDataService {
    private apiKey: string;
    private baseUrl = "https://api.cricapi.com/v1/";
    private apiInstance: typeof ky;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiInstance = ky.create({
            prefixUrl: this.baseUrl,
            retry: 0,
        });
    }

    async getAllSeries(offset: number = 0) {
        const response = await this.apiInstance.get(
            `series?apikey=${this.apiKey}&offset=${offset}`
        );
        return response.json<CricketDataApiResponse<Series[]>>();
    }

    async getSeriesInfo(seriesId: string) {
        const response = await this.apiInstance.get(
            `series_info?apikey=${this.apiKey}&id=${seriesId}`
        );
        return response.json<CricketDataApiResponse<SeriesInfo>>();
    }

    async getAllMatches(offset: number = 0) {
        const response = await this.apiInstance.get(
            `matches?apikey=${this.apiKey}&offset=${offset}`
        );
        return response.json<CricketDataApiResponse<Match[]>>();
    }
}

export const cricketDataService = new CricketDataService(
    apiEnv.CRICKET_DATA_API_KEY
);
