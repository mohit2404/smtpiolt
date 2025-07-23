import { Container } from "@/components/container";
import { Upload, Mail } from "lucide-react";

export default function Loading() {
  return (
    <section className="animate-pulse">
      <Container className="max-w-6xl py-7">
        {/* Heading */}
        <div className="mb-8 space-y-2">
          <div className="h-10 w-80 rounded bg-gray-200 mb-2" />
          <div className="h-6 w-1/2 rounded bg-gray-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Card: Manage Recipients */}
          <div className="space-y-4 rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-gray-300" />
              <div className="h-6 w-40 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-64 rounded bg-gray-200" />

            {/* Upload File Input */}
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-10 w-full rounded bg-gray-100" />
              <div className="h-3 w-40 rounded bg-gray-200" />
            </div>

            {/* Manual Emails */}
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-20 w-full rounded bg-gray-100" />
              <div className="flex justify-between">
                <div className="h-3 w-48 rounded bg-gray-200" />
                <div className="h-8 w-24 rounded bg-gray-300" />
              </div>
            </div>

            {/* Recipient List Skeleton (3 items) */}
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded border bg-white px-3 py-2"
                >
                  <div className="h-4 w-48 rounded bg-gray-200" />
                  <div className="h-4 w-4 rounded-full bg-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: Compose Email */}
          <div className="space-y-4 rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-300" />
              <div className="h-6 w-40 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-64 rounded bg-gray-200" />

            {/* Sender Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-10 w-full rounded bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-10 w-full rounded bg-gray-100" />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-10 w-full rounded bg-gray-100" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-28 w-full rounded bg-gray-100" />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <div className="h-10 w-40 rounded bg-gray-200" />
              <div className="h-10 flex-1 rounded bg-gray-300" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
