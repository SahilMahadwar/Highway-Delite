import express from "express";

import { getLoggedInUser } from "../controllers";
import { protectedRoute } from "../middlewares/protected-route";

export const userRouter = express.Router();

userRouter.route("/me").get(protectedRoute, getLoggedInUser);
