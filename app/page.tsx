"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/payd/navbar";
import { Hero } from "@/components/payd/hero";
import { BatchBuilder } from "@/components/payd/batch-builder";
import { ResultsPanel } from "@/components/payd/results-panel";
import { History } from "@/components/payd/history";
import { Footer } from "@/components/payd/footer";
import { Toast, ToastContainer } from "@/components/payd/toast";

const GL = dynamic(() => import("@/components/gl").then((mod) => mod.GL), {
  ssr: false,
});

export interface Recipient {
  id: string;
  address: string;
  amount: string;
  reference: string;
  status?: "pending" | "sent" | "failed";
  txHash?: string;
}

export interface BatchResult {
  id: string;
  name: string;
  date: string;
  recipients: Recipient[];
  totalAmount: number;
  totalSent: number;
  totalFailed: number;
}

export interface ToastData {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentBatch, setCurrentBatch] = useState<BatchResult | null>(null);
  const [batchHistory, setBatchHistory] = useState<BatchResult[]>([]);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((type: ToastData["type"], message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const connectWallet = useCallback(async () => {
    // Simulated wallet connection
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockAddress = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef3b";
    setWalletAddress(mockAddress);
    addToast("info", "Wallet connected");
  }, [addToast]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    addToast("info", "Wallet disconnected");
  }, [addToast]);

  const sendBatch = useCallback(
    async (batchName: string, recipients: Recipient[]) => {
      // Simulate sending transactions
      const updatedRecipients: Recipient[] = [];

      for (const recipient of recipients) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Random success/failure for demo (90% success rate)
        const success = Math.random() > 0.1;

        updatedRecipients.push({
          ...recipient,
          status: success ? "sent" : "failed",
          txHash: success
            ? `0x${Array.from({ length: 64 }, () =>
                Math.floor(Math.random() * 16).toString(16)
              ).join("")}`
            : undefined,
        });
      }

      const totalAmount = updatedRecipients.reduce(
        (sum, r) => sum + parseFloat(r.amount || "0"),
        0
      );
      const totalSent = updatedRecipients.filter(
        (r) => r.status === "sent"
      ).length;
      const totalFailed = updatedRecipients.filter(
        (r) => r.status === "failed"
      ).length;

      const batch: BatchResult = {
        id: crypto.randomUUID(),
        name: batchName || "Unnamed Batch",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        recipients: updatedRecipients,
        totalAmount,
        totalSent,
        totalFailed,
      };

      setCurrentBatch(batch);
      setBatchHistory((prev) => [batch, ...prev]);

      if (totalFailed === 0) {
        addToast("success", "Batch sent successfully");
      } else if (totalSent > 0) {
        addToast("error", `${totalFailed} transaction(s) failed`);
      } else {
        addToast("error", "All transactions failed");
      }

      return batch;
    },
    [addToast]
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <GL hovering={false} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar
          walletAddress={walletAddress}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />

        <main className="flex-1 pt-24 pb-16">
          <div className="container flex flex-col gap-16">
            <Hero />

            <BatchBuilder
              walletConnected={!!walletAddress}
              onSendBatch={sendBatch}
            />

            {currentBatch && <ResultsPanel batch={currentBatch} />}

            <History batches={batchHistory} onViewDetails={setCurrentBatch} />
          </div>
        </main>

        <Footer />
      </div>

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </div>
  );
}
