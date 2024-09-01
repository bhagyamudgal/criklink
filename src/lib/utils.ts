import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
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

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatSeriesDate(startDate: string, endDate: string) {
    return `${format(new Date(startDate), "yyyy, MMM d")} - ${format(
        new Date(endDate),
        "yyyy, MMM d"
    )}`;
}

export function formatMatchDateTime(dateTimeGMT: string) {
    const date = new Date(dateTimeGMT);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return formatInTimeZone(date, userTimeZone, "yyyy, MMM d p zz");
}

export function convertEndDateToISO(
    endDate: string,
    startDate: string
): string {
    const currentYear = new Date(startDate).getFullYear();

    if (!endDate) return "";

    if (/^[A-Za-z]{3}\s\d{1,2}$/.test(endDate)) {
        const [month, day] = endDate.split(" ");
        return new Date(`${month} ${day}, ${currentYear}`).toISOString();
    }

    return new Date(endDate).toISOString();
}
