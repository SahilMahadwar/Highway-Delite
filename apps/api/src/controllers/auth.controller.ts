import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { otpTemplate } from "../libs/email-templates/otp";
import Otp from "../models/Otp";
import User from "../models/User";
import { matchPassword, sendTokenResponse } from "../services/auth.service";
import { sendMail } from "../services/email.service";
import { env } from "../utils/env";
import { ErrorResponse } from "../utils/error-response";

// @desc    Register user
// @route   POST /api/v1/auth/login
// @access  Public
// @role    User
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Request failed try again",
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP record for the given email
    const otpRecord = await Otp.findOne({ email: email });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Check if the OTP matches and has not expired
    const currentTime = new Date();

    if (otpRecord.otp !== otp || otpRecord.expiresAt < currentTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Remove the OTP document from the database so it cant be used more than once
    await Otp.deleteOne({ email: email });

    // Generate JWT token
    const token = jwt.sign({ email: email }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Request failed try again",
    });
  }
};

export const sendEmailVerificationOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // check if the user already exist
    const userCheck = await User.findOne({ email: email });

    if (userCheck) {
      return res.status(200).json({
        message: "user already exists try logging in",
      });
    }

    const generateOTP = Math.floor(1000 + Math.random() * 9000);

    const storeOTP = await Otp.create({
      email: email,
      otp: generateOTP,
    });

    const mailOptions = {
      from: 'Highway Delite OTP" <no-reply@highway-delite.com>',
      to: email,
      subject: "Verify Email",
      html: otpTemplate({ otp: parseInt(storeOTP.otp) }),
    };

    const sendMailRes = await sendMail(mailOptions);

    if (!sendMailRes) {
      console.log(sendMailRes);
    }

    res.status(200).json({
      message: "Otp sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Request failed try again",
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, signUpToken } = req.body;

    // Check if the user already exists
    const userCheck = await User.findOne({ email: email });
    if (userCheck) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // check if email is verified
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(signUpToken, env.JWT_SECRET) as {
        email: string;
        exp: number;
      };
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Check if the token email matches the request email
    if (decoded.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Token email does not match request email",
      });
    }

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    if (decoded.exp < currentTime) {
      return res.status(400).json({
        success: false,
        message: "Token is expired",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Request failed try again",
    });
  }
};
