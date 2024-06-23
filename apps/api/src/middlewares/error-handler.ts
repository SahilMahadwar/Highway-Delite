import { Request, Response } from "express";
import { Error } from "mongoose";
import { ErrorResponse } from "../utils/error-response";

interface CustomError extends Error {
  code?: number;
  value?: string;
  statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response) => {
  let error: CustomError = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.log(err.name);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate Key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

export { errorHandler };
