import nodemailer from "nodemailer";
import { SMTPConfig, EmailOptions } from "@/lib/types";

export async function createEmailTransporter(smtpConfig: SMTPConfig) {
  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });

    await transporter.verify();
    return { transporter, error: null };
  } catch (error) {
    console.error("Failed to create email transporter:", error);
    return {
      transporter: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create email transporter",
    };
  }
}

export async function sendSingleEmail(
  transporter: any,
  emailOptions: EmailOptions,
) {
  try {
    const info = await transporter.sendMail(emailOptions);
    return { success: true, messageId: info.messageId, error: null };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      messageId: null,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
