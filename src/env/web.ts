import { parseEnv, webEnvSchema } from "@/lib/env";

export const webEnv = parseEnv(webEnvSchema);
