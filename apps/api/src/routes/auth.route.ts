import express from "express";
import { validate } from "express-validation";
import {
  login,
  requestPasswordReset,
  resetPassword,
  sendEmailVerificationOTP,
  signUp,
  verifyOtp,
} from "../controllers";
import { protectedRoute } from "../middlewares/protected-route";
import {
  loginValidationSchema,
  resetPasswordValidationSchema,
  sendEmailVerificationOTPValidationSchema,
  signUpValidationSchema,
  verifyOtpValidationSchema,
} from "../validations/auth.validation";

export const authRouter = express.Router();

authRouter.route("/login").post(validate(loginValidationSchema), login);
authRouter.route("/signup").post(validate(signUpValidationSchema), signUp);

// OTP routes
authRouter
  .route("/otp/request")
  .post(
    validate(sendEmailVerificationOTPValidationSchema),
    sendEmailVerificationOTP
  );

authRouter
  .route("/otp/verify")
  .post(validate(verifyOtpValidationSchema), verifyOtp);

// Password rest routes
authRouter
  .route("/reset-password/request")
  .post(protectedRoute, requestPasswordReset);

authRouter
  .route("/reset-password")
  .post(validate(resetPasswordValidationSchema), resetPassword);
