import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { otpTemplate } from "../libs/email-templates/otp";
import { passwordResetTemplate } from "../libs/email-templates/password-reset";
import { asyncHandler } from "../middlewares/async-handler";
import Otp from "../models/Otp";
import User from "../models/User";
import { matchPassword, sendTokenResponse } from "../services/auth.service";
import { sendMail } from "../services/email.service";
import { env } from "../utils/env";
import { ErrorResponse } from "../utils/error-response";

// @desc    Register user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("User not found please register", 401));
    }

    // Check if password matches
    const isMatch = await matchPassword({
      enteredPassword: password,
      passwordHash: user.password,
    });

    if (!isMatch) {
      return next(new ErrorResponse("Invalid email or password", 401));
    }

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Verify OTP
// @route   POST /api/v1/otp/verify
// @access  Public
export const verifyOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    // Find the OTP record for the given email
    const otpRecord = await Otp.findOne({ email: email });

    if (!otpRecord) {
      return next(new ErrorResponse("Invalid or expired OTP", 400));
    }

    // Check if the OTP matches and has not expired
    const currentTime = new Date();

    if (otpRecord.otp !== otp || otpRecord.expiresAt < currentTime) {
      return next(new ErrorResponse("Invalid or expired OTP", 400));
    }

    // Remove the OTP document from the database so it can't be used more than once
    await Otp.deleteOne({ email: email });

    const token = jwt.sign({ email: email }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.respond(200, { token: token }, "OTP verified successfully");
  }
);

// @desc    Send OTP email
// @route   POST /api/v1/otp/request
// @access  Public
export const sendEmailVerificationOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Check if the user already exist
    const userCheck = await User.findOne({ email: email });

    if (userCheck) {
      return next(new ErrorResponse("User already exists try logging in", 500));
    }

    const generateOTP = Math.floor(1000 + Math.random() * 9000);

    // Create OTP record
    const otpRecord = await Otp.create({
      email: email,
      otp: generateOTP,
    });

    // Send mail
    const mailOptions = {
      from: 'Highway Delite OTP" <no-reply@highway-delite.com>',
      to: email,
      subject: "Verify Email",
      html: otpTemplate({ otp: parseInt(otpRecord.otp) }),
    };

    const sendMailRes = await sendMail(mailOptions);

    if (!sendMailRes) {
      return next(new ErrorResponse("Failed to send otp", 500));
    }

    res.respond(200, { email: email }, "Otp sent");
  }
);

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, signUpToken } = req.body;

    // Check if the user already exists
    const userCheck = await User.findOne({ email: email });
    if (userCheck) {
      return next(new ErrorResponse("User already exists", 400));
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(signUpToken, env.JWT_SECRET) as {
        email: string;
        exp: number;
      };
    } catch (err) {
      return next(new ErrorResponse("Invalid or expired token", 400));
    }

    // Check if the token email matches the request email
    if (decoded.email !== email) {
      return next(
        new ErrorResponse("Token email does not match request email", 400)
      );
    }

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    if (decoded.exp < currentTime) {
      return next(new ErrorResponse("Token is expired", 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return next(new ErrorResponse("Failed to create user", 400));
    }

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Request password reset (send reset link to email)
// @route   POST /api/v1/auth/reset-password/request
// @access  Private
export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user.email;

    // Find user
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Generate JWT token for password reset
    const token = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: "1h" });

    // Frontend reset-password page
    const resetLink = `${env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: 'Highway Delite Password Reset" <no-reply@highway-delite.com>',
      to: email,
      subject: "Password Reset",
      html: passwordResetTemplate({ resetLink: resetLink }),
    };

    const sendMailRes = await sendMail(mailOptions);

    if (!sendMailRes) {
      return next(
        new ErrorResponse("Failed to send password reset email", 500)
      );
    }

    res.respond(200, { email: email }, "Password reset email sent");
  }
);

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, token } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as { email: string };
    } catch (err) {
      return next(new ErrorResponse("Invalid or expired token", 400));
    }

    // Find user
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Update user's password
    user.password = password;
    await user.save();

    // Invalidate all existing sessions
    // WIP

    res.respond(200, { email: user.email }, "Password reset successful");
  }
);
