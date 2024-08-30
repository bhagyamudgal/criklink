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
