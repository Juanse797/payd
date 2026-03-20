"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import type { BatchResult } from "@/app/page";

interface ResultsPanelProps {
  batch: BatchResult;
}

function StatusBadge({ status }: { status: "sent" | "pending" | "failed" }) {
  const config = {
    sent: { color: "bg-success", label: "Sent" },
    pending: { color: "bg-warning", label: "Pending" },
    failed: { color: "bg-error", label: "Failed" },
  };

  const { color, label } = config[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function CopyableHash({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedHash = `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-foreground"
      title="Click to copy"
    >
      {truncatedHash}
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function ResultsPanel({ batch }: ResultsPanelProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const totalAmountSent = batch.recipients
    .filter((r) => r.status === "sent")
    .reduce((sum, r) => sum + parseFloat(r.amount || "0"), 0);

  return (
    <section className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-6">
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Batch Results — {batch.name}
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="pb-3 font-medium">Recipient</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Reference</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">TX Hash</th>
              <th className="pb-3 font-medium">Explorer</th>
            </tr>
          </thead>
          <tbody>
            {batch.recipients.map((recipient) => (
              <tr
                key={recipient.id}
                className="border-b border-border last:border-0"
              >
                <td className="py-4 font-mono text-sm text-foreground">
                  {truncateAddress(recipient.address)}
                </td>
                <td className="py-4 text-sm text-foreground">
                  {recipient.amount} AlphaUSD
                </td>
                <td className="py-4 text-sm text-muted">
                  {recipient.reference || "—"}
                </td>
                <td className="py-4">
                  <StatusBadge status={recipient.status || "pending"} />
                </td>
                <td className="py-4">
                  {recipient.txHash ? (
                    <CopyableHash hash={recipient.txHash} />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-4">
                  {recipient.txHash ? (
                    <a
                      href={`https://explorer.tempo.xyz/tx/${recipient.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-muted transition-colors hover:text-foreground"
                      aria-label="View on explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {batch.recipients.map((recipient) => (
          <div
            key={recipient.id}
            className="rounded-lg border border-border bg-background p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-foreground">
                {truncateAddress(recipient.address)}
              </span>
              <StatusBadge status={recipient.status || "pending"} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Amount</span>
              <span className="text-foreground">{recipient.amount} AlphaUSD</span>
            </div>
            {recipient.reference && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Reference</span>
                <span className="text-foreground">{recipient.reference}</span>
              </div>
            )}
            {recipient.txHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">TX Hash</span>
                <div className="flex items-center gap-2">
                  <CopyableHash hash={recipient.txHash} />
                  <a
                    href={`https://explorer.tempo.xyz/tx/${recipient.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-foreground"
                    aria-label="View on explorer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-border pt-6 text-sm">
        <div>
          <span className="text-muted">Total Sent:</span>{" "}
          <span className="font-medium text-foreground">{batch.totalSent}</span>
        </div>
        <div>
          <span className="text-muted">Total Failed:</span>{" "}
          <span className="font-medium text-foreground">{batch.totalFailed}</span>
        </div>
        <div>
          <span className="text-muted">Total Amount:</span>{" "}
          <span className="font-medium text-foreground">
            {totalAmountSent.toFixed(2)} AlphaUSD
          </span>
        </div>
      </div>
    </section>
  );
}
