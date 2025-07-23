"use client";

import { useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { Package, Mail, User, Tag, Info, CheckCircle2 } from "lucide-react";
import { apiHandler } from "@/lib/class/apiHandler";

export default function BatchPageClient() {
  const { batchId } = useParams<{ batchId: string }>();
  const [recipients, setRecipients] = useState<any[]>([]);
  const [batch, setBatch] = useState<any>(null);
  const [retrying, setRetrying] = useState(false);

  // Count
  const total = recipients.length;
  const successCount = useMemo(
    () => recipients.filter((r) => r.status === "success").length,
    [recipients],
  );
  const errorCount = useMemo(
    () => recipients.filter((r) => r.status === "error").length,
    [recipients],
  );

  useEffect(() => {
    // 1. Initial fetch
    const fetchData = async () => {
      const data = await apiHandler.fetchBatch(batchId);
      setBatch(data);
      setRecipients(data.recipients || []);
    };

    fetchData();

    // 2. Listen for updates in email_logs
    const logsChannel = supabase
      .channel(`realtime:email_logs:${batchId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "email_logs",
          filter: `batch_id=eq.${batchId}`,
        },
        (payload: any) => {
          const updated = payload.new;
          setRecipients((prev) =>
            prev.map((r) =>
              r.id === updated.id
                ? {
                    ...r,
                    status: updated.status,
                    messageId: updated.message_id,
                    error: updated.error,
                  }
                : r,
            ),
          );
        },
      )
      .subscribe();

    // 3. Listen for updates in email_batches
    const batchChannel = supabase
      .channel(`realtime:email_batches:${batchId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "email_batches",
          filter: `id=eq.${batchId}`,
        },
        (payload: any) => {
          setBatch((prev: any) => ({
            ...prev,
            ...payload.new,
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(logsChannel);
      supabase.removeChannel(batchChannel);
    };
  }, [batchId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <div className="bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Success
          </div>
        );
      case "in_progress":
        return (
          <div className="bg-yellow-100 text-yellow-800">
            <Info className="mr-1 h-3 w-3" /> In Progress
          </div>
        );
      case "failed":
        return <div>Failed</div>;
      case "pending":
        return <div>Pending</div>;
      default:
        return <div>{status}</div>;
    }
  };

  return (
    <section>
      <div className="container mx-auto min-h-screen px-4 py-8 md:px-6 lg:px-8">
        {/* Batch Header */}
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-gray-600" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Batch: {batchId}
          </h1>
        </div>

        <div className="rounded-xl border p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Batch Summary
          </h2>
          <div className="grid gap-4 text-gray-700">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">Sender:</span>
                <span>
                  {batch?.sender_name
                    ? `${batch?.sender_name} <${batch?.sender_email}>`
                    : batch?.sender_email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span className="font-medium">Subject:</span>
                <span>{batch?.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span className="font-medium">Overall Status:</span>
                {batch?.completed_at
                  ? new Date(batch.completed_at).toLocaleString()
                  : "In Progress"}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span className="font-medium">Total Emails:</span>
                <span>{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Completed:</span>
                <span>
                  {successCount} / {total} sent
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>{(successCount / total) * 100}%</span>
              </div>
              <div
                className="h-2.5 rounded-full bg-black transition-all"
                style={{
                  width: `${(successCount / total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <h2 className="text-xl font-semibold tracking-tight text-gray-800">
            Email Details
          </h2>
          {recipients.map((item, index) => {
            return (
              <div
                key={index}
                className={`rounded-xl border p-6 shadow-md ${
                  item.status === "success"
                    ? "border-green-500"
                    : item.status === "error"
                      ? "border-red-500"
                      : "border-yellow-300"
                }`}
              >
                <div className="grid gap-2 p-6 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Email:</span>
                    <span>{item.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="text-muted-foreground h-5 w-5" />
                    <span className="font-medium">Status:</span>
                    {/* {getStatusBadge(detail.status)} */}
                    <span>{item.status}</span>
                  </div>
                  {item.messageId && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <span className="font-medium">Message ID:</span>
                      <span className="rounded bg-gray-100 p-1 font-mono text-xs break-all">
                        {item.messageId}
                      </span>
                    </div>
                  )}
                  {item.error && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Error:</span>
                      <span className="rounded bg-gray-100 p-1 font-mono text-xs break-all">
                        {item.error}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
