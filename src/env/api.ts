import { apiEnvSchema, parseEnv } from "@/lib/env";

export const apiEnv = parseEnv(apiEnvSchema);
