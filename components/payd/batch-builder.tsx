"use client";

import { useState, useCallback } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import type { Recipient, BatchResult } from "@/app/page";

interface BatchBuilderProps {
  walletConnected: boolean;
  onSendBatch: (batchName: string, recipients: Recipient[]) => Promise<BatchResult>;
}

export function BatchBuilder({ walletConnected, onSendBatch }: BatchBuilderProps) {
  const [batchName, setBatchName] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: crypto.randomUUID(), address: "", amount: "", reference: "" },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [sendingIndex, setSendingIndex] = useState<number | null>(null);

  const addRecipient = useCallback(() => {
    setRecipients((prev) => [
      ...prev,
      { id: crypto.randomUUID(), address: "", amount: "", reference: "" },
    ]);
  }, []);

  const removeRecipient = useCallback((id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRecipient = useCallback(
    (id: string, field: keyof Recipient, value: string) => {
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
    },
    []
  );

  const handleSend = useCallback(async () => {
    if (!walletConnected || recipients.length === 0) return;

    const validRecipients = recipients.filter(
      (r) => r.address.trim() && r.amount.trim()
    );
    if (validRecipients.length === 0) return;

    setIsSending(true);

    // Simulate sending each recipient sequentially with visual feedback
    for (let i = 0; i < validRecipients.length; i++) {
      setSendingIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for UI
    }

    await onSendBatch(batchName, validRecipients);

    // Reset form
    setBatchName("");
    setRecipients([
      { id: crypto.randomUUID(), address: "", amount: "", reference: "" },
    ]);
    setIsSending(false);
    setSendingIndex(null);
  }, [walletConnected, recipients, batchName, onSendBatch]);

  const validRecipientsCount = recipients.filter(
    (r) => r.address.trim() && r.amount.trim()
  ).length;

  const canSend = walletConnected && validRecipientsCount > 0 && !isSending;

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Batch Builder
      </h2>

      {/* Batch Name Input */}
      <input
        type="text"
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
        placeholder="Batch name — e.g. March Payroll 2026"
        className="mb-6 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
      />

      {/* Recipients Table/List */}
      <div className="mb-4 space-y-3">
        {/* Header - Desktop */}
        <div className="hidden md:grid md:grid-cols-[1fr_120px_1fr_40px] gap-3 px-1 text-sm text-muted">
          <span>Wallet Address</span>
          <span>Amount (AlphaUSD)</span>
          <span>Reference</span>
          <span />
        </div>

        {/* Recipient Rows */}
        {recipients.map((recipient, index) => (
          <div
            key={recipient.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 md:grid md:grid-cols-[1fr_120px_1fr_40px] md:items-center md:p-0 md:border-0 md:bg-transparent md:rounded-none"
          >
            <input
              type="text"
              value={recipient.address}
              onChange={(e) =>
                updateRecipient(recipient.id, "address", e.target.value)
              }
              placeholder="0x..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              disabled={isSending}
            />
            <input
              type="text"
              value={recipient.amount}
              onChange={(e) =>
                updateRecipient(recipient.id, "amount", e.target.value)
              }
              placeholder="0.00"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              disabled={isSending}
            />
            <input
              type="text"
              value={recipient.reference}
              onChange={(e) =>
                updateRecipient(recipient.id, "reference", e.target.value)
              }
              placeholder="e.g. FREELANCER-001"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              disabled={isSending}
            />
            <div className="flex justify-end md:justify-center">
              {isSending && sendingIndex === index ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
              ) : (
                <button
                  onClick={() => removeRecipient(recipient.id)}
                  disabled={recipients.length === 1 || isSending}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-border hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Remove recipient"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Recipient Button */}
      <button
        onClick={addRecipient}
        disabled={isSending}
        className="mb-6 flex items-center gap-2 text-sm text-foreground transition-colors hover:text-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
        Add recipient
      </button>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className="w-full rounded-lg bg-foreground py-4 text-base font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : !walletConnected ? (
          "Connect wallet to send"
        ) : (
          "Send Batch"
        )}
      </button>
    </section>
  );
}
