import nodemailer from "nodemailer";
import { env } from "../utils/env";

export const mailHogTransporter = nodemailer.createTransport({
  port: 1025,
});

export const brevoTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

mailHogTransporter.verify((error) => {
  if (error) {
    console.log("error with mailhog email connection");
  }
});

brevoTransporter.verify((error) => {
  if (error) {
    console.log("error with brevo email connection");
  }
});
