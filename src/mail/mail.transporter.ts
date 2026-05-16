import { createTransport } from "nodemailer";
import { env } from "@/config/env";

export const transporter = createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_ENCRYPTION === "ssl",
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
});
