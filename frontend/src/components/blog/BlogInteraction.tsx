"use client";

import { useState } from "react";
import { Heart, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";

interface BlogInteractionProps {
  initialLikes?: number;
}

export default function BlogInteraction({ initialLikes = 240 }: BlogInteractionProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(null);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#14161E] border border-white/[0.08] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Like Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLike}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              hasLiked
                ? "bg-red-500/10 border-red-500 text-red-500 shadow-lg shadow-red-950/40"
                : "bg-[#181A24] border-white/[0.08] text-[#9EA3B0] hover:text-white hover:border-white/20"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                hasLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{likes} Applauds</span>
          </button>
          <span className="text-xs text-[#666C7A]">Enjoyed this guide? Show some love!</span>
        </div>

        {/* Was this helpful? */}
        <div className="flex items-center gap-2">
          {feedback ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Thanks for your feedback!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9EA3B0]">Was this helpful?</span>
              <button
                type="button"
                onClick={() => setFeedback("helpful")}
                className="w-8 h-8 rounded-lg bg-[#181A24] hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/[0.08] flex items-center justify-center text-[#9EA3B0] transition"
                title="Yes, very helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFeedback("not_helpful")}
                className="w-8 h-8 rounded-lg bg-[#181A24] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.08] flex items-center justify-center text-[#9EA3B0] transition"
                title="Not really"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
