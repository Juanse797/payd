"use client";

import { useState } from "react";

interface NavbarProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Navbar({ walletAddress, onConnect, onDisconnect }: NavbarProps) {
  const [showDisconnect, setShowDisconnect] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <span className="text-2xl font-bold text-foreground">Payd</span>

        {/* Network Badge - Center */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Tempo Testnet
        </div>

        {/* Wallet Connection - Right */}
        {walletAddress ? (
          <div
            className="relative"
            onMouseEnter={() => setShowDisconnect(true)}
            onMouseLeave={() => setShowDisconnect(false)}
          >
            <button className="flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-2 text-sm transition-colors hover:bg-card">
              <span className="font-mono text-foreground">
                {truncateAddress(walletAddress)}
              </span>
              <span className="text-muted">Tempo Testnet</span>
            </button>

            {showDisconnect && (
              <button
                onClick={onDisconnect}
                className="absolute top-full right-0 mt-2 w-full rounded-lg border border-border bg-card/90 backdrop-blur-sm px-4 py-2 text-sm text-error transition-colors hover:bg-card"
              >
                Disconnect
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="rounded-full border border-foreground bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
