import {
  createEmailTransporter,
  sendSingleEmail,
} from "@/lib/utils/nodemailer";
import {
  getBatchById,
  getBatchEmailLogs,
  updateBatchStatus,
  updateEmailLogStatus,
} from "../firebase/functions";
import { htmlToText } from "html-to-text";
import { sendSummaryEmail } from "../utils/sendSummary";

export async function processEmailBatch(batchId: string) {
  try {
    const { data: batch, error: batchError } = await getBatchById(batchId);
    if (batchError || !batch) {
      console.error("Batch not found:", batchError);
      return;
    }

    const { data: logs, error: logsError } = await getBatchEmailLogs(batchId);
    if (logsError || !logs) {
      console.error("Failed to get recipients:", logsError);
      return;
    }

    const {
      sender_email: senderEmail,
      sender_name: senderName,
      subject,
      mail_body: mail_body,
      smtp_config: smtpConfig,
    } = batch;

    if (!smtpConfig || !smtpConfig.host) {
      console.error("SMTP config missing or invalid");
      return;
    }

    const { transporter, error: transportError } =
      await createEmailTransporter(smtpConfig);

    if (!transporter) {
      console.error("Transporter error:", transportError);
      return;
    }

    let totalSent = 0;
    let totalFailed = 0;

    for (const recipient of logs) {
      const emailOptions = {
        from: senderName ? `${senderName} <${senderEmail}>` : senderEmail,
        to: recipient.recipient,
        subject,
        text: htmlToText(mail_body),
        html: mail_body,
      };

      try {
        const { messageId } = await sendSingleEmail(transporter, emailOptions);

        await updateEmailLogStatus(batchId, recipient.recipient, {
          status: "success",
          message_id: messageId,
          error: null,
          updated_at: new Date().toISOString(),
        });

        totalSent++;
      } catch (error: any) {
        console.error(`Failed to send to ${recipient.recipient}:`, error?.message || error);

        await updateEmailLogStatus(batchId, recipient.recipient, {
          status: "error",
          message_id: null,
          error: error?.message || error,
          updated_at: new Date().toISOString(),
        });

        totalFailed++;
      }
    }

    const completedAt = new Date().toISOString();

    await updateBatchStatus(batchId, {
      status: "completed",
      total_sent: totalSent,
      total_failed: totalFailed,
      completed_at: completedAt,
    });

    // Send summary email
    await sendSummaryEmail({
      completedAt,
      to: senderEmail,
      subject,
      total: logs.length,
      success: totalSent,
      failed: totalFailed,
      batchId,
    });
  } catch (error: any) {
    console.error("Fatal error in batch processing:", error?.message || error);
    return;
  }
}
