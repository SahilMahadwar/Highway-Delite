import dotenv from "dotenv";
import { z } from "zod";

// load env vars
dotenv.config();

const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.string().min(1),

  MONGODB_URL: z.string().min(1),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().min(1),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  MONGODB_URL: process.env.MONGODB_URL,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};

type ServerInput = z.input<typeof server>;
type ServerOutput = z.infer<typeof server>;
type ServerSafeParseReturn = z.SafeParseReturnType<ServerInput, ServerOutput>;

let env = process.env as ServerOutput;

const parsed = server.safeParse(processEnv) as ServerSafeParseReturn;

if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

env = parsed.data as ServerOutput;

export { env };
