"use client";

/**
 * useLiveActiveUsers - Deprecated & Neutralized
 * All live-users polling and intervals have been completely removed.
 */
export function useLiveActiveUsers() {
  return {
    liveVisitors: 0,
    getChannelViewers: () => 0,
    formatViewers: () => "",
  };
}
