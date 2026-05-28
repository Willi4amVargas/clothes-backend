import { Transporter } from "nodemailer";

import { env } from "@/config/env";

export class MailService {
  constructor(private mailTransporter: Transporter) {
    this.testConnection();
  }

  sendMail = async (
    to: string,
    subject: string,
    html: string,
  ): Promise<number> => {
    try {
      const info = await this.mailTransporter.sendMail({
        from: env.MAIL_FROM,
        html,
        subject,
        to,
      });
      return info.messageId;
    } catch (error: any) {
      switch (error.code) {
        case "ECONNECTION":
        case "ETIMEDOUT":
          throw new Error("Network error - retry later:", error.message);
        case "EAUTH":
          throw new Error("Authentication failed:", error.message);
        case "EENVELOPE":
          throw new Error("Invalid recipients: " + error.rejected.join(", "));
        default:
          throw new Error("Send failed:", error.message);
      }
    }
  };

  testConnection = async () => {
    try {
      await this.mailTransporter.verify();
      console.log("Successfully connect to SMTP server");
    } catch (err) {
      console.error("Verification failed in MailService:", err);
    }
  };
}
