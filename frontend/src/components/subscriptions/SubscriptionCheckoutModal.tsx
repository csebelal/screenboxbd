"use client";

import { useState } from "react";
import { X, Check, ShieldCheck, Zap, Tag, ArrowRight } from "lucide-react";

export interface SelectedPlanInfo {
  id: string;
  name: string;
  price: string;
  billingCycle: "monthly" | "halfYearly" | "yearly";
  screens: string;
  resolution: string;
}

interface SubscriptionCheckoutModalProps {
  plan: SelectedPlanInfo | null;
  onClose: () => void;
}

export default function SubscriptionCheckoutModal({
  plan,
  onClose,
}: SubscriptionCheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket" | "card">("bkash");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!plan) return null;

  const cycleLabels = {
    monthly: "১ মাস (মাসিক বিলিং)",
    halfYearly: "৬ মাস (হাফ-ইয়ারলি)",
    yearly: "১২ মাস (বাৎসরিক - সেরা অফার)",
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "BDIX2026" || promoCode.trim().toUpperCase() === "OFFER30") {
      setPromoApplied(true);
    } else {
      alert("দুঃখিত, কুপন কোডটি সঠিক নয়! ট্রাই করুন: BDIX2026");
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13151D] border border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden text-left">
        {/* Glow decorative */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.05] text-[#9EA3B0] hover:text-white hover:bg-white/[0.1] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-white">অভিনন্দন! অর্ডার সম্পন্ন হয়েছে</h3>
            <p className="text-sm text-[#9EA3B0] max-w-sm mx-auto">
              আপনার <strong className="text-white">{plan.name}</strong> সাবস্ক্রিপশন সফলভাবে সক্রিয় করা হয়েছে। কোনো জটিলতা ছাড়াই এখন সব চ্যানেল ও মুভি উপভোগ করুন।
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-[#9EA3B0] space-y-1">
              <div>ট্রানজ্যাকশন আইডি: <span className="text-white font-mono">SBX-{(Math.random() * 1000000).toFixed(0)}</span></div>
              <div>পেমেন্ট মেথড: <span className="text-white uppercase font-bold">{paymentMethod}</span></div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
            >
              স্ট্রিমিং শুরু করুন
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-red-500 font-bold uppercase tracking-wider mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>অর্ডার সামারি ও চেকআউট</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {plan.name} অ্যাক্টিভেশন
              </h3>
            </div>

            {/* Plan Info Card */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9EA3B0]">নির্বাচিত প্ল্যান:</span>
                <span className="text-sm font-bold text-white">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9EA3B0]">বিলিং মেয়াদ:</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {cycleLabels[plan.billingCycle]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9EA3B0]">ডিভাইস ও কোয়ালিটি:</span>
                <span className="text-xs text-white">
                  {plan.screens} স্ক্রিন • {plan.resolution}
                </span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-baseline">
                <span className="text-xs font-bold text-white">মোট প্রদেয় মূল্য:</span>
                <div className="text-right">
                  {promoApplied && (
                    <span className="text-xs text-rose-400 line-through mr-2">
                      {plan.price}
                    </span>
                  )}
                  <span className="text-xl font-black text-white">
                    {promoApplied ? "৳" + Math.round(parseInt(plan.price.replace(/[^\d]/g, "")) * 0.85) : plan.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#666C7A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="প্রোমো কোড (যেমন: BDIX2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0E1017] border border-white/10 text-xs text-white focus:outline-none focus:border-red-500 placeholder:text-[#666C7A]"
                />
              </div>
              <button
                type="submit"
                disabled={promoApplied}
                className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white transition disabled:opacity-50 cursor-pointer"
              >
                {promoApplied ? "প্রযুক্ত" : "প্রয়োগ"}
              </button>
            </form>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9EA3B0] uppercase tracking-wider block">
                পেমেন্ট মেথড নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: "bkash", name: "bKash বিকাশ", color: "hover:border-[#D12053]" },
                    { id: "nagad", name: "Nagad নগদ", color: "hover:border-[#F35A22]" },
                    { id: "rocket", name: "Rocket রকেট", color: "hover:border-[#8A257D]" },
                    { id: "card", name: "Cards (Visa/Master)", color: "hover:border-blue-500" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      paymentMethod === item.id
                        ? "bg-white/[0.08] border-red-500 text-white shadow-md shadow-red-950/20"
                        : "bg-[#0E1017] border-white/[0.08] text-[#9EA3B0] " + item.color
                    }`}
                  >
                    <span>{item.name}</span>
                    {paymentMethod === item.id && (
                      <Check className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons & Guarantee */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-900/40 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>প্রসেসিং হচ্ছে...</span>
                ) : (
                  <>
                    <span>পেমেন্ট ও অ্যাক্টিভেশন নিশ্চিত করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#9EA3B0]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>৭ দিনের মানি-ব্যাক গ্যারান্টি • যেকোনো সময় বাতিলযোগ্য</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
