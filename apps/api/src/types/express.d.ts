import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace `any` with the actual type of `user`
    }
  }
}
