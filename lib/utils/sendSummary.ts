import { createEmailTransporter } from "@/lib/utils/nodemailer";
import { getSummaryEmail } from "./defaultHTML";
import { htmlToText } from "html-to-text";

interface SendSummaryProps {
  completedAt: string;
  to: string;
  subject: string;
  total: number;
  success: number;
  failed: number;
  batchId: string;
}

export async function sendSummaryEmail({
  completedAt,
  to,
  subject,
  total,
  success,
  failed,
  batchId,
}: SendSummaryProps) {
  const smtpConfig = {
    host: process.env.NEXT_PUBLIC_SMTP_HOST!,
    port: Number(process.env.NEXT_PUBLIC_SMTP_PORT || 465),
    secure: true,
    username: process.env.NEXT_PUBLIC_SMTP_USERNAME!,
    password: process.env.NEXT_PUBLIC_SMTP_PASSWORD!,
  };

  const { transporter, error } = await createEmailTransporter(smtpConfig);
  if (!transporter) {
    console.error("Failed to create transporter for summary email:", error);
    return;
  }

  const actionLink = `${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${batchId}`;
  const mail_body = getSummaryEmail(completedAt, total, success, failed, actionLink);

  await transporter.sendMail({
    from: smtpConfig.username,
    to,
    subject: `Email Campaign Summary: ${batchId}`,
    text: htmlToText(mail_body),
    html: mail_body,
  });

  if (transporter.close) transporter.close();
}
