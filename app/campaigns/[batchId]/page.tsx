"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Package,
  Mail,
  User,
  Tag,
  Info,
  CheckCircle2,
  CircleX,
} from "lucide-react";
import { useBatchRealtime } from "@/hooks/useBatchRealtime";
import { Container } from "@/components/container";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";

export default function BatchPageClient() {
  const { batchId } = useParams<{ batchId: string }>();
  const { batch, recipients } = useBatchRealtime(batchId);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <section>
      <Container className="py-7">
        {/* Batch Header */}
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-gray-600" />
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Batch: {batchId}
          </h1>
        </div>

        <div className="rounded-xl border p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Batch Summary
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs"
            >
              <Info className="mr-1 h-3 w-3" />
              {batch?.email_format || "text"}
            </Button>
          </div>
          <div className="grid gap-4 text-gray-700">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
              <div className="sm:flex sm:gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Sender:</span>
                </div>
                <span className="max-sm:ml-7">
                  {batch?.sender_name
                    ? `${batch?.sender_name} <${batch?.sender_email}>`
                    : batch?.sender_email}
                </span>
              </div>
              <div className="sm:flex sm:gap-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <span className="font-medium">Subject:</span>
                </div>
                <span className="line-clamp-2 max-sm:ml-7">
                  {batch?.subject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span className="font-medium">Overall Status:</span>
                {batch?.completed_at ? "Completed" : "In Progress"}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span className="font-medium">Total Emails:</span>
                <span>{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Completed:</span>
                <span>{successCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleX className="h-5 w-5" />
                <span className="font-medium">Failed:</span>
                <span>{errorCount}</span>
              </div>
            </div>
            {/* <div className="mt-4">
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
            </div> */}
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <h2 className="text-xl font-semibold tracking-tight text-gray-800">
            Email Details
          </h2>
          {recipients?.map((item, index) => {
            return (
              <div
                key={index}
                className={`w-full rounded-xl border p-5 shadow-md ${
                  item.status === "success"
                    ? "border-green-500"
                    : item.status === "error"
                      ? "border-red-500"
                      : "border-yellow-300"
                }`}
              >
                <div className="space-y-2 p-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Email:</span>
                    <span>{item.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="text-muted-foreground h-5 w-5" />
                    <span className="font-medium">Status:</span>
                    <span>{item.status}</span>
                  </div>
                  {item.message_id && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <span className="font-medium">Message ID:</span>
                      <span className="rounded bg-gray-100 p-1 font-mono text-xs break-all">
                        {item.message_id}
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

        {/* mail body preview */}
        <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
          <div
            className={`h-full w-full ${batch?.email_format === "text" ? "p-4" : ""}`}
          >
            <iframe
              srcDoc={batch?.mail_body}
              className="scrollbar-hide h-full w-full"
            />
          </div>
        </Modal>
      </Container>
    </section>
  );
}
