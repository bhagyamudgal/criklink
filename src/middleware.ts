import { ACTIONS_CORS_HEADERS, createActionHeaders } from "@solana/actions";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    let res = NextResponse.next();

    const actionHeaders = createActionHeaders({
        chainId: "mainnet",
    });

    if (req.url.includes("actions")) {
        Object.keys({ ...ACTIONS_CORS_HEADERS, ...actionHeaders }).forEach(
            (key) => {
                const value = ACTIONS_CORS_HEADERS[key];

                res.headers.append(key, value);
            }
        );
    }

    return res;
}

export const config = {
    matcher: "/:path*",
};
