import jwt from "jsonwebtoken";
import User from "../models/User";
import { env } from "../utils/env";
import { ErrorResponse } from "../utils/error-response";
import { asyncHandler } from "./async-handler";

export const protectedRoute = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
      };
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id);

    if (user) {
      const transformedUser = user.transform();

      req.user = transformedUser;

      next();
    } else {
      next(new ErrorResponse("User not found", 404));
    }
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});
