import { asyncHandler } from "../middlewares/async-handler";

import { ErrorResponse } from "../utils/error-response";

export const getLoggedInUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse("User not available", 500));
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});
