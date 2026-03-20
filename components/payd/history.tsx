"use client";

import type { BatchResult } from "@/app/page";
import { FileText } from "lucide-react";

interface HistoryProps {
  batches: BatchResult[];
  onViewDetails: (batch: BatchResult) => void;
}

function StatusSummary({ totalSent, totalFailed }: { totalSent: number; totalFailed: number }) {
  if (totalFailed === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        All sent
      </span>
    );
  }

  if (totalSent === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-error" />
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      Partial
    </span>
  );
}

export function History({ batches, onViewDetails }: HistoryProps) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Previous Batches
      </h2>

      {batches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 backdrop-blur-md p-12 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted">
            No batches yet. Send your first batch above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-5 transition-colors hover:bg-card/90"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-medium text-foreground line-clamp-1">
                  {batch.name}
                </h3>
                <StatusSummary
                  totalSent={batch.totalSent}
                  totalFailed={batch.totalFailed}
                />
              </div>

              <div className="mb-4 space-y-1 text-sm text-muted">
                <p>{batch.date}</p>
                <p>{batch.recipients.length} payment{batch.recipients.length !== 1 ? "s" : ""}</p>
                <p>{batch.totalAmount.toFixed(2)} AlphaUSD</p>
              </div>

              <button
                onClick={() => onViewDetails(batch)}
                className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-muted"
              >
                View details
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
