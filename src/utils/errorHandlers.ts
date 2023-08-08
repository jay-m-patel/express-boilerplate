// scope to handle errors better!!!
import { Request, Response } from "express";
import debug from "debug";
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../types/error";
import { CustomNext } from "../types/nextFunction";
import { unknownError } from "../lang/common/errors";

const errorLog: debug.IDebugger = debug("errorHandler:err");

export const helpersErrorHandler = (
    err: unknown,
    customErrorMessage: string, 
    errorLog: debug.IDebugger
) => {
    if(err instanceof Error) errorLog(err?.message);
    const customError = !(err instanceof CustomError)
        ? new CustomError({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: customErrorMessage })
        : err;
    throw customError;
}

export const controllersErrorHandler = (
    err: unknown,
    customErrorMessage: string, 
    next: CustomNext, 
    errorLog: debug.IDebugger
) => {
    if(err instanceof Error) errorLog(err?.message);
    const customError = !(err instanceof CustomError)
        ? new CustomError({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: customErrorMessage})
        : err;
    next(customError);
}

export const defaultErrorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: CustomNext
) => {
    errorLog(err?.message);

    res.status((err && err.code) || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (err && err.message) || unknownError,
    });
};
