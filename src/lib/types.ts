export type StandardApiResponseType = {
    responseId: string;
    success: boolean;
    message: string;
};

export type ApiResponseType<ResultType> = StandardApiResponseType & {
    result: ResultType;
};

export type ApiResponseTypeWithPagination<ResultType> =
    StandardApiResponseType & {
        result: {
            data: ResultType;
            totalItems: number;
            totalPages: number;
            pageNumber: number;
            pageSize: number;
        };
    };
