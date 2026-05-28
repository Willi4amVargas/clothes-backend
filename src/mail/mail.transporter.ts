import { createTransport } from "nodemailer";

import { env } from "@/config/env";

export const transporter = createTransport({
  auth: {
    pass: env.MAIL_PASSWORD,
    user: env.MAIL_USERNAME,
  },
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_ENCRYPTION === "ssl",
});
