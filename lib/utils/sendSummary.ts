import {
  createEmailTransporter,
  formatEmailContent,
} from "@/lib/utils/nodemailer";

interface SendSummaryProps {
  to: string;
  subject: string;
  total: number;
  success: number;
  failed: number;
  batchId: string;
  smtpConfig: any;
}

export async function sendSummaryEmail({
  to,
  subject,
  total,
  success,
  failed,
  batchId,
  smtpConfig,
}: SendSummaryProps) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/batch/${batchId}`;
  const summaryText = `Hello,\n\nYour bulk email task has completed.\n\nSubject: ${subject}\nTotal: ${total}\nSent: ${success}\nFailed: ${failed}\n\nView the full report here:\n${link}\n\n– Staybook Team`;
  const { html, text } = formatEmailContent(summaryText);

  const { transporter, error } = await createEmailTransporter(smtpConfig);
  if (!transporter) {
    console.error("Failed to create transporter for summary email:", error);
    return;
  }

  await transporter.sendMail({
    from: smtpConfig.username,
    to,
    subject: `Email Summary: ${subject}`,
    html,
    text,
  });

  if (transporter.close) transporter.close();
}
