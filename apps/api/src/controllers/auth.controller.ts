import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { otpTemplate } from "../libs/email-templates/otp";
import Otp from "../models/Otp";
import User from "../models/User";
import { sendMail } from "../services/email.service";
import { env } from "../utils/env";

// @desc    Register user
// @route   POST /api/v1/auth/login
// @access  Public
// @role    User
export const login = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "login",
    });
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

    const storeOTP = new Otp({
      email: email,
      otp: generateOTP,
    });

    await storeOTP.save();

    const mailOptions = {
      from: 'Highway Delite OTP" <no-reply@highway-delite.com>',
      to: email,
      subject: "Verify Email",
      html: otpTemplate({ otp: generateOTP }),
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
    res.status(200).json({
      message: "Sign Up",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Request failed try again",
    });
  }
};
