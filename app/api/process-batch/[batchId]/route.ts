import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const { batchId } = await params;

  const { data: batch, error: batchError } = await supabase
    .from("email_batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (batchError || !batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  const { data: logs, error: logsError } = await supabase
    .from("email_logs")
    .select("*")
    .eq("batch_id", batchId);

  if (logsError) {
    return NextResponse.json(
      { error: "Failed to fetch recipients" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ...batch,
    recipients: logs,
  });
}
