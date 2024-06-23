import express from "express";
import { validate } from "express-validation";
import {
  login,
  sendEmailVerificationOTP,
  signUp,
  verifyOtp,
} from "../controllers";
import {
  loginValidationSchema,
  sendEmailVerificationOTPValidationSchema,
  signUpValidationSchema,
  verifyOtpValidationSchema,
} from "../validations/auth.validation";

export const authRouter = express.Router();

authRouter.route("/login").post(validate(loginValidationSchema), login);
authRouter.route("/signup").post(validate(signUpValidationSchema), signUp);

authRouter
  .route("/otp/send")
  .post(
    validate(sendEmailVerificationOTPValidationSchema),
    sendEmailVerificationOTP
  );

authRouter
  .route("/otp/verify")
  .post(validate(verifyOtpValidationSchema), verifyOtp);
