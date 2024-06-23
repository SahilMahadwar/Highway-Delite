import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.respond = function <T>(statusCode: number, data: T, message = "success") {
    this.status(statusCode).json(new APIResponse<T>(statusCode, data, message));
  };

  next();
};
