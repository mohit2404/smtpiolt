import { Container } from "@/components/container";
import {
  Package,
  Mail,
  User,
  Tag,
  Info,
  CheckCircle2,
  CircleX,
} from "lucide-react";

export default function Loading() {
  const icons = [User, Tag, Info, Mail, CheckCircle2, CircleX];

  return (
    <section>
      <Container className="py-7">
        {/* Batch Header Skeleton */}
        <div className="mb-8 flex animate-pulse items-center gap-3">
          <Package className="h-8 w-8 text-gray-300" />
          <div className="h-8 w-64 rounded bg-gray-200"></div>
        </div>

        {/* Batch Summary Card Skeleton */}
        <div className="animate-pulse rounded-xl border p-6 shadow-lg">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => {
                const Icon = icons[i];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-300" />
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-sm">
                <div className="h-4 w-20 rounded bg-gray-200"></div>
                <div className="h-4 w-12 rounded bg-gray-200"></div>
              </div>
              <div className="h-2.5 w-full rounded bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Email Details Section Skeleton */}
        <div className="mt-8 grid gap-6">
          <h2 className="text-xl font-semibold tracking-tight text-gray-800">
            <div className="h-6 w-40 rounded bg-gray-200"></div>
          </h2>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse border-gray-200 shadow-md"
            >
              <div className="grid gap-2 p-6">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-300" />
                  <div className="h-4 w-20 rounded bg-gray-200"></div>
                  <div className="h-4 w-48 rounded bg-gray-200"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 rounded bg-gray-200"></div>
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-4 w-64 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
