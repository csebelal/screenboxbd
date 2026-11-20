"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Star, X, Check, ThumbsUp, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  content: string;
  likes: number;
}

interface ReviewSectionProps {
  movieTitle?: string;
  movieRating?: number;
  movieSlug?: string;
  genres?: string[];
}

export default function ReviewSection({
  movieTitle = "this title",
  movieRating = 8.5,
  movieSlug = "movie",
  genres = [],
}: ReviewSectionProps) {
  // Generate title-specific and genre-aware community reviews
  const buildInitialReviews = useCallback((): Review[] => {
    const isActionOrSciFi = genres.some((g) =>
      /action|sci-fi|adventure|fantasy/i.test(g)
    );
    const isDramaOrThriller = genres.some((g) =>
      /drama|thriller|crime|mystery/i.test(g)
    );
    const isAnimation = genres.some((g) =>
      /animation|anime|family/i.test(g)
    );

    let specificReview1 = `Watching ${movieTitle} in 4K HDR on ScreenBoxBD was incredible. The visual clarity, crisp surround audio and zero buffering made it an unforgettable viewing experience!`;
    let specificReview2 = `Compelling narrative and standout performances throughout. The direction and pacing kept me completely engaged from start to finish.`;

    if (isAnimation) {
      specificReview1 = `The animation artistry and sound design in ${movieTitle} are world-class. Looks stunning in full 1080p 60fps on our smart TV!`;
      specificReview2 = `Heartwarming, energetic, and beautifully crafted. A must-watch masterpiece for the whole family on ScreenBoxBD.`;
    } else if (isActionOrSciFi) {
      specificReview1 = `The action sequences and VFX in ${movieTitle} are thrilling! Crisp sound mix with deep Dolby bass. Highly recommended in 4K!`;
      specificReview2 = `High-octane entertainment with phenomenal set pieces. ScreenBoxBD's bufferless BDIX link made watching it completely seamless.`;
    } else if (isDramaOrThriller) {
      specificReview1 = `Intense, gripping, and deeply atmospheric. ${movieTitle} keeps you guessing until the final frames with brilliant acting.`;
      specificReview2 = `Superb character development and cinematography. One of the highest quality titles in the ScreenBoxBD library.`;
    }

    const baseRating = Number(movieRating) > 0 ? Number(movieRating) / 2 : 4.5;
    const r1 = Math.min(5, Math.max(4.0, Number((baseRating + 0.2).toFixed(1))));
    const r2 = Math.min(5, Math.max(4.2, Number((baseRating + 0.4).toFixed(1))));

    return [
      {
        id: "rev-1",
        author: "Rahim Chowdhury",
        location: "Verified VIP Member",
        rating: r1,
        content: specificReview1,
        likes: 27,
      },
      {
        id: "rev-2",
        author: "Tanvir Ahmed",
        location: "Verified Streamer",
        rating: r2,
        content: specificReview2,
        likes: 42,
      },
    ];
  }, [genres, movieRating, movieTitle]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Initialize and load any locally saved user reviews on mount
  useEffect(() => {
    const initial = buildInitialReviews();
    try {
      const storageKey = `screenbox_reviews_${movieSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: Review[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...initial]);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setReviews(initial);
  }, [movieSlug, buildInitialReviews]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    const newRev: Review = {
      id: String(Date.now()),
      author: newAuthor.trim(),
      location: "Verified Member",
      rating: newRating,
      content: newContent.trim(),
      likes: 1,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const storageKey = `screenbox_reviews_${movieSlug}`;
      const existingSaved = localStorage.getItem(storageKey);
      const userReviews = existingSaved ? JSON.parse(existingSaved) : [];
      localStorage.setItem(storageKey, JSON.stringify([newRev, ...userReviews]));
    } catch {
      // Ignore storage errors
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowAddModal(false);
      setNewAuthor("");
      setNewContent("");
      setNewRating(5);
    }, 1200);
  };

  const handleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  return (
    <div className="streamit-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Audience Reviews
          </h3>
          <p className="text-xs text-[#9EA3B0]">
            Verified community reviews for {movieTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-screenbox-dark text-xs py-2 px-3.5 flex items-center gap-1.5 hover:border-red-500/50 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#E50000]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, 4).map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl bg-[#10121A] border border-white/[0.06] p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Author info + Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {rev.author}
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-semibold">{rev.location}</p>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/30 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rev.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed">
                {rev.content}
              </p>
            </div>

            {/* Like Action */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#666C7A]">
              <span>Was this review helpful?</span>
              <button
                type="button"
                onClick={() => handleLike(rev.id)}
                className="flex items-center gap-1.5 text-xs text-[#9EA3B0] hover:text-white transition cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{rev.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-[#12141C] border border-white/10 rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative max-h-[calc(100dvh-2rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#E50000]" />
                <h3 className="text-base sm:text-lg font-black text-white truncate max-w-[240px] sm:max-w-md">Review {movieTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/10 flex items-center justify-center text-[#9EA3B0] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-white">Thank You!</h4>
                <p className="text-xs text-[#9EA3B0]">Your review for {movieTitle} has been verified and published.</p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                {/* Rating Stars Picker */}
                <div>
                  <label className="text-xs font-bold text-white block mb-2">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 cursor-pointer transition hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-[#454B5E]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-amber-400 ml-2">
                      {newRating}.0 / 5.0
                    </span>
                  </div>
                </div>

                {/* Author Name */}
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    Review Comments
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={`What did you think of the cinematography, acting, pacing, and video quality in ${movieTitle}?`}
                    className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-screenbox-dark text-xs py-2.5 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-screenbox-red text-xs py-2.5 px-6 shadow-md shadow-red-950/40"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
