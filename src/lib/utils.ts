import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function extractErrorMessage(error: unknown, fallbackMessage?: string) {
    let errorMessage =
        fallbackMessage ?? "Something went wrong! Please try again.";

    try {
        if (error instanceof Error && error?.message) {
            errorMessage = error.message;
        }

        return errorMessage;
    } catch (error) {
        return errorMessage;
    }
}
