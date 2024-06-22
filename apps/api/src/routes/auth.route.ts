import express from "express";

import {
  login,
  sendEmailVerificationOTP,
  signUp,
  verifyOtp,
} from "../controllers";

export const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/signup").post(signUp);

authRouter.route("/otp/send").post(sendEmailVerificationOTP);
authRouter.route("/otp/verify").post(verifyOtp);
