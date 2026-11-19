"use client";

import { ChannelStream } from "@/types";
import { Server, ShieldCheck, Zap } from "lucide-react";

interface ServerSelectorProps {
  streams: ChannelStream[];
  currentStreamUrl: string;
  isUsingProxy: boolean;
  onSelectStream: (stream: ChannelStream, useProxy: boolean) => void;
}

export default function ServerSelector({
  streams,
  currentStreamUrl,
  isUsingProxy,
  onSelectStream,
}: ServerSelectorProps) {
  if (!streams || streams.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 sm:p-2.5 bg-[#12141C] rounded-xl border border-white/[0.08] backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#9EA3B0] mr-1 uppercase tracking-wider">
        <Server className="w-3.5 h-3.5 text-[#E50000]" />
        <span>Server:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {streams.map((stream, idx) => {
          const isDirectActive =
            !isUsingProxy && currentStreamUrl === stream.stream_url;
          const isProxyActive =
            isUsingProxy && currentStreamUrl === stream.proxy_url;

          return (
            <div key={stream.id || idx} className="flex items-center gap-1">
              {/* Direct Server Button */}
              <button
                type="button"
                onClick={() => onSelectStream(stream, false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isDirectActive
                    ? "bg-[#E50000] text-white shadow-md shadow-red-950/40 ring-1 ring-red-400"
                    : "bg-[#181A24] hover:bg-[#202330] text-[#E2E4E9] border border-white/[0.06]"
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{stream.server_name || `Server ${idx + 1}`}</span>
              </button>

              {/* CORS Proxy Alternative Button */}
              {stream.proxy_url && (
                <button
                  type="button"
                  onClick={() => onSelectStream(stream, true)}
                  title="CORS Bypass Proxy Server"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isProxyActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400"
                      : "bg-[#181A24] hover:bg-[#202330] text-[#9EA3B0] border border-white/[0.06]"
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Proxy</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
