import { extractErrorMessage } from "@/lib/utils";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({
            status: "success",
            message: "API is working fine!",
        });
    } catch (error) {
        console.error("error =>", extractErrorMessage(error));
        return NextResponse.json({ error: "Internal server error!" });
    }
}
