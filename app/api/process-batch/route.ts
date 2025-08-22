import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { processEmailBatch } from "@/lib/process/emails";
import { createEmailLogs, createEmailBatch } from "@/lib/firebase/functions";
import { Batch } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const {
      senderEmail,
      senderName,
      subject,
      emailFormat,
      mailBody,
      smtpConfig,
      recipients,
    } = await req.json();

    if (!senderEmail || !subject || !mailBody || !recipients?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const batchId = nanoid();

    const batchRes = await createEmailBatch(batchId, {
      sender_email: senderEmail,
      sender_name: senderName || null,
      subject,
      email_format: emailFormat,
      mail_body: mailBody,
      smtp_config: smtpConfig || {},
      status: "in_progress",
      total_sent: 0,
      total_failed: 0,
      created_at: new Date().toISOString(),
    } as Batch);

    if (!batchRes.status) {
      console.error("Failed to create batch:", batchRes.error);
      return NextResponse.json(
        { error: "Failed to create email batch" },
        { status: 500 },
      );
    }

    // Insert all recipients
    const recipientsRes = await createEmailLogs(batchId, recipients);
    if (!recipientsRes.status) {
      console.error("Failed to insert recipients:", recipientsRes.error);
      return NextResponse.json(
        { error: "Failed to insert recipients" },
        { status: 500 },
      );
    }

    // Start background email sending
    setTimeout(() => {
      processEmailBatch(batchId);
    }, 0);

    return NextResponse.json(
      { batchId, message: "Processing started" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error:", error?.message || error);
    return NextResponse.json({ error: error?.message || error }, { status: 500 });
  }
}
