"use client";

import { AdSlot } from "@/types";

interface BettingSponsorTickerProps {
  sponsor?: AdSlot | null;
}

export default function BettingSponsorTicker({ sponsor }: BettingSponsorTickerProps) {
  // All sponsor / betting sections completely disabled
  return null;
}
