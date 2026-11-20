"use client";

import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

interface ArtPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  isLive?: boolean;
  onFallbackNeeded?: (failedUrl: string) => void;
  onToggleFullscreen?: () => void;
  className?: string;
}

export default function ArtPlayer({
  url,
  poster,
  isLive = true,
  onFallbackNeeded,
  onToggleFullscreen,
  className = "",
}: ArtPlayerProps) {
  const artRef = useRef<HTMLDivElement | null>(null);
  const playerInstance = useRef<Artplayer | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!artRef.current || !url) return;

    setHasError(false);
    setErrorMessage("");

    let hlsInstance: Hls | null = null;

    // Create Artplayer instance
    const art = new Artplayer({
      container: artRef.current,
      url: url,
      poster: poster || "",
      theme: "#e50914",
      volume: 0.8,
      isLive: isLive,
      muted: true,
      autoplay: true,
      pip: true,
      autoSize: false,
      autoMini: true,
      screenshot: false,
      setting: true,
      loop: false,
      flip: false,
      playbackRate: false,
      aspectRatio: true,
      fullscreen: !onToggleFullscreen,
      fullscreenWeb: !onToggleFullscreen,
      controls: onToggleFullscreen
        ? [
            {
              name: "custom-fullscreen",
              position: "right",
              html: '<span class="art-icon" style="display:flex;align-items:center;justify-content:center;padding:0 8px;cursor:pointer;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></span>',
              tooltip: "Full Screen",
              click: function () {
                onToggleFullscreen();
              },
            },
          ]
        : [],
      miniProgressBar: isLive ? false : true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      lock: true,
      fastForward: false,
      autoOrientation: true,
      customType: {
        m3u8: function (video: HTMLVideoElement, streamUrl: string, artInstance: Artplayer) {
          if (Hls.isSupported()) {
            if (hlsInstance) {
              hlsInstance.destroy();
            }

            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90,
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hlsInstance = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
              setHasError(false);
              // Quality levels
              if (data.levels && data.levels.length > 1) {
                const qualityLevels = data.levels.map((level, index) => ({
                  html: `${level.height || "Auto"}p`,
                  level: index,
                  default: index === hls.currentLevel,
                }));

                qualityLevels.unshift({
                  html: "Auto",
                  level: -1,
                  default: hls.currentLevel === -1,
                });

                artInstance.setting.update({
                  name: "quality",
                  width: 150,
                  html: "Quality",
                  tooltip: "Auto",
                  selector: qualityLevels,
                  onSelect: function (item) {
                    const level = (item as unknown as { level?: number }).level;
                    if (typeof level === "number") {
                      hls.currentLevel = level;
                    }
                  },
                });
              }
            });

            hls.on(Hls.Events.ERROR, (_, errorData) => {
              console.warn("HLS Error:", errorData);
              if (errorData.fatal) {
                switch (errorData.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.warn("Fatal Network/CORS Error in HLS stream. Triggering proxy fallback...");
                    setHasError(true);
                    setErrorMessage("Direct stream network/CORS issue detected. Switching to CORS Proxy...");
                    if (onFallbackNeeded) {
                      onFallbackNeeded(streamUrl);
                    }
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.warn("Fatal Media Error in HLS. Attempting recovery...");
                    hls.recoverMediaError();
                    break;
                  default:
                    setHasError(true);
                    setErrorMessage("Stream could not be decoded or loaded.");
                    hls.destroy();
                    break;
                }
              }
            });

            // Store hls on player for future cleanup
            (artInstance as unknown as { hls: Hls }).hls = hls;
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
          } else {
            artInstance.notice.show = "Unsupported HLS stream on this browser.";
          }
        },
      },
    });

    playerInstance.current = art;

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [url, poster, isLive, onFallbackNeeded, onToggleFullscreen]);

  const handleRetry = () => {
    setHasError(false);
    if (playerInstance.current) {
      playerInstance.current.switchUrl(url);
    }
  };

  return (
    <div
      className={`artplayer-wrapper relative w-full h-full aspect-video overflow-hidden group ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        aspectRatio: "16 / 9",
        backgroundColor: "#000",
      }}
    >
      {/* Player container */}
      <div
        ref={artRef}
        className="artplayer-app"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Error state overlay */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center text-white">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3 animate-pulse" />
          <h4 className="text-lg font-bold">Stream Playback Warning</h4>
          <p className="text-zinc-400 text-sm max-w-md mt-1 mb-5">
            {errorMessage || "The primary video stream failed or is restricted by provider CORS."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Stream</span>
            </button>
            {onFallbackNeeded && (
              <button
                onClick={() => onFallbackNeeded(url)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switch to CORS Proxy</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
