import bcrypt from "bcryptjs";
import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../utils/env";

// Get token from model, create cookie and send response
export const sendTokenResponse = (
  user: User,
  statusCode: number,
  res: Response
) => {
  // Create Token
  const token = getSignedJwtToken({ userId: user._id });

  const options: CookieOptions = {
    expires: new Date(
      Date.now() + parseInt(env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .cookie("token", token, options)
    .respond(200, { token: token, user: user.transform() });
};

// Sign JWT and return
export const getSignedJwtToken = ({ userId }: { userId: string }) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const matchPassword = async ({
  enteredPassword,
  passwordHash,
}: {
  enteredPassword: string;
  passwordHash: string;
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(
      enteredPassword,
      passwordHash,
      function (err, isPasswordMatch) {
        return err == null ? resolve(isPasswordMatch) : reject(err);
      }
    );
  });
};
