import { NextFunction, Response } from "express";
import { ProtectedReq } from "../types";
import { ErrorResponse } from "../utils/error-response";

const asyncHandler =
  <
    T extends (
      req: ProtectedReq,
      res: Response,
      next: NextFunction
    ) => Promise<unknown>,
  >(
    fn: T
  ) =>
  (req: ProtectedReq, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      next(new ErrorResponse(message, statusCode));
    });
  };

export { asyncHandler };
