import cors from "cors";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { authRouter } from "./routes";
import { env } from "./utils/env";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Highway delite API");
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
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
