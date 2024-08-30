import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import type { ApiResponseType } from "./types";
import { extractErrorMessage } from "./utils";

export function apiResponse({
    responseId,
    success,
    message,
    result,
}: ApiResponseType<unknown>) {
    return {
        responseId,
        success,
        message,
        result,
    };
}

export function errorHandler(responseId: string, error: unknown) {
    return apiResponse({
        responseId,
        success: false,
        message: extractErrorMessage(error),
        result: null,
    });
}

export function successHandler(
    responseId: string,
    result: ApiResponseType<unknown>["result"],
    message: string
) {
    return apiResponse({
        responseId,
        success: true,
        message,
        result,
    });
}

export class ApiResponseHandler {
    public logger: ApiLogger;
    public responseId = randomUUID();

    constructor(req: NextRequest) {
        this.logger = new ApiLogger(this.responseId);
        this.logger.req(req);
    }

    clientError(message?: string) {
        let errorMessage = "Wrong parameters provided!";

        if (message) {
            errorMessage = message;
        }

        if (message === "Required") {
            errorMessage = "Some parameters are missing!";
        }

        const error = new Error(errorMessage);

        this.logger.status(400);
        this.logger.error(errorMessage, { error, errorMessage });

        return NextResponse.json(errorHandler(this.responseId, error), {
            status: 400,
        });
    }

    rateLimitError() {
        const errorMessage = "Too many requests!";

        const error = new Error(errorMessage);

        this.logger.status(429);
        this.logger.error(errorMessage, { error, errorMessage });

        return NextResponse.json(errorHandler(this.responseId, error), {
            status: 429,
        });
    }

    authError = (message?: string) => {
        const errorMessage = message || "User not authenticated!";

        const error = new Error(errorMessage);

        this.logger.status(401);
        this.logger.error(errorMessage, { error, errorMessage });

        return NextResponse.json(errorHandler(this.responseId, error), {
            status: 401,
        });
    };

    serverError = (error: unknown) => {
        const errorMessage = extractErrorMessage(
            error,
            "Internal server error!"
        );

        this.logger.status(500);
        this.logger.error(errorMessage, { error, errorMessage });

        return NextResponse.json(
            errorHandler(
                this.responseId,
                new Error(
                    "Internal server error! Please contact us if it happens again."
                )
            ),
            {
                status: 500,
            }
        );
    };

    success(
        data: ApiResponseType["result"],
        message: string,
        status: 200 | 201 = 200
    ) {
        this.logger.info(message);

        return NextResponse.json(
            successHandler(this.responseId, data, message),
            { status }
        );
    }
}
