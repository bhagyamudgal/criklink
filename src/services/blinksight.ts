import { apiEnv } from "@/env/api";
import { BlinksightsClient } from "blinksights-sdk";

export const blinksightClient = new BlinksightsClient(
    apiEnv.BLINKSIGHT_API_KEY
);
