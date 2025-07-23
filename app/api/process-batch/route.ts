import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { processEmailBatch } from "@/lib/process/emails";

export async function POST(req: Request) {
  try {
    const {
      senderEmail,
      senderName,
      subject,
      message,
      smtpConfig,
      recipients,
    } = await req.json();

    if (!senderEmail || !subject || !message || !recipients?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Create batch record
    const batchId = uuidv4();

    // step 2: insert batch record in supabase
    const { error: batchError } = await supabase.from("email_batches").insert({
      id: batchId,
      sender_email: senderEmail,
      sender_name: senderName || null,
      subject,
      html_content: message,
      smtp_config: smtpConfig || {},
      status: "in_progress",
      total_sent: 0,
      total_failed: 0,
      created_at: new Date().toISOString(),
    });

    if (batchError) {
      console.error("Failed to insert batch:", batchError);
      return NextResponse.json(
        { error: "Failed to create email batch" },
        { status: 500 }
      );
    }

    // Step 3: Insert all recipients in supabase
    const logs = recipients.map((r: any) => ({
      batch_id: batchId,
      recipient: r.email,
      name: r.name || null,
      status: "pending",
      updated_at: new Date().toISOString(),
    }));

    const { error: logsError } = await supabase.from("email_logs").insert(logs);

    if (logsError) {
      console.error("Failed to insert email logs:", logsError.message);
      return NextResponse.json(
        { error: "Failed to save email recipients" },
        { status: 500 }
      );
    }

    // step 4: start processing emails in the background
    setTimeout(() => {
      processEmailBatch(batchId);
    }, 0);

    // return the batch id and message early
    return NextResponse.json(
      {
        batchId: batchId,
        message: "Batch created and processing started",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in send-bulk-emails route:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
