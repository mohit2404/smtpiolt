import supabase from "@/lib/supabase/server";
import {
  createEmailTransporter,
  formatEmailContent,
  sendSingleEmail,
} from "@/lib/utils/nodemailer";

export async function processEmailBatch(batchId: string) {
  try {
    const { data: batch, error: batchError } = await supabase
      .from("email_batches")
      .select("*")
      .eq("id", batchId)
      .single();

    if (batchError || !batch) {
      console.error("Batch not found:", batchError);
      return;
    }

    const { data: logs, error: logsError } = await supabase
      .from("email_logs")
      .select("*")
      .eq("batch_id", batchId);

    if (logsError || !logs) {
      console.error("Failed to get recipients:", logsError);
      return;
    }

    const {
      sender_email: senderEmail,
      sender_name: senderName,
      subject,
      html_content: message,
      smtp_config: smtpConfig,
    } = batch;
    const { html, text } = formatEmailContent(message);

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
        html,
        text,
      };

      try {
        const { success, messageId } = await sendSingleEmail(
          transporter,
          emailOptions,
        );

        await supabase
          .from("email_logs")
          .update({
            status: "success",
            message_id: messageId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", recipient.id);

        totalSent++;
      } catch (err: any) {
        console.error(`Failed to send to ${recipient.recipient}:`, err.message);

        await supabase
          .from("email_logs")
          .update({
            status: "error",
            error: err.message || "Unknown error",
            updated_at: new Date().toISOString(),
          })
          .eq("id", recipient.id);

        totalFailed++;
      }
    }

    await supabase
      .from("email_batches")
      .update({
        status: "completed",
        total_sent: totalSent,
        total_failed: totalFailed,
        completed_at: new Date().toISOString(),
      })
      .eq("id", batchId);

    console.log(
      `Finished batch ${batchId}: Sent=${totalSent}, Failed=${totalFailed}`,
    );
  } catch (err: any) {
    console.error("Fatal error in batch processing:", err.message || err);
    return;
  }
}
