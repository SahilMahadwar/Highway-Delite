import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { connectDB } from "./config/db";

import { ValidationError } from "express-validation";
import { authRouter, userRouter } from "./routes";
import { env } from "./utils/env";
import { ErrorResponse } from "./utils/error-response";

const app: Express = express();

// Connect to db
connectDB();

// Enable CORS
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// parsers
app.use(express.json());

// Logging middleware
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("short"));
}

// Mount routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Highway delite API");
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// Error handling middleware should be the last middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorResponse) {
    res.status(err.statusCode).json({
      success: false,
      code: err.statusCode,
      message: err.message,
      err: err,
    });
  } else if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.statusCode,
      message: "Validation Error",
      err: err.details.body,
    });
  } else {
    res.status(500).json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      err: err,
    });
  }
});

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running in ${env.NODE_ENV} at http://localhost:${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);

  // Close server and exit process
  server.close(() => process.exit(1));
});
