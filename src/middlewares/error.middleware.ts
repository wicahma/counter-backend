import { IGlobalResponse } from "../interfaces/global.interface";
import { Request, Response, NextFunction } from "express";

export const MErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";

  if (err instanceof Error) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message,
    };

    const errorObj: {
      message: string;
      trace?: string | undefined;
    } = { message: err.message };

    if (isDevelopment && err.stack) {
      errorObj.trace = err.stack;
    }

    response.error = errorObj;

    res.status(400).json(response);
  } else {
    const response: IGlobalResponse = {
      status: false,
      message: "An unexpected error occurred",
      error: {
        message: "Internal server error",
      },
    };

    res.status(500).json(response);
  }
};
