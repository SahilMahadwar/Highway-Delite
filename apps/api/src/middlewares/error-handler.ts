import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import { ErrorResponse } from "../utils/error-response";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof ErrorResponse) {
    res.status(err.statusCode).json({
      success: false,
      code: err.statusCode,
      message: err.message,
      err: err,
    });
  } else if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.statusCode,
      message: "Validation Error",
      err: err.details,
    });
  } else {
    res.status(500).json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      err: err.message,
    });
  }
};

export { errorHandler };
