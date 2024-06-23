// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace `any` with the actual type of `user`
    }
    interface Response {
      respond: <T>(statusCode: number, data: T, message?: string) => void;
    }
  }
}
