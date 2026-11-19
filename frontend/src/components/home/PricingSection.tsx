"use client";

import { useState, useEffect } from "react";
import { Check, Sparkles, ShieldCheck, Zap, Flame } from "lucide-react";
import SubscriptionCheckoutModal, { SelectedPlanInfo } from "@/components/subscriptions/SubscriptionCheckoutModal";
import { getSubscriptionPlans } from "@/lib/api";

interface PlanItem {
  id: string;
  name: string;
  badge?: string;
  description: string;
  monthlyDisplay: string;
  halfYearlyDisplay: string;
  yearlyDisplay: string;
  monthlyRateInYearly: string;
  isPopular?: boolean;
  screens: string;
  resolution: string;
  features: string[];
}

const DEFAULT_PLANS: PlanItem[] = [
  {
    id: "basic",
    name: "Basic HD (বেসিক)",
    badge: "ব্যক্তিগত ব্যবহার",
    description:
      "স্টুডেন্ট ও একক ব্যবহারের জন্য সেরা পছন্দ। মোবাইল ও ল্যাপটপে ৭২০p HD স্ট্রিমিং উপভোগ করুন।",
    monthlyDisplay: "৳১৪৯",
    halfYearlyDisplay: "৳৭৪৯",
    yearlyDisplay: "৳১,১৯০",
    monthlyRateInYearly: "৳৯৯/মাস",
    screens: "১টি ডিভাইস",
    resolution: "720p HD",
    features: [
      "১টি স্ক্রিনে স্ট্রিমিং (ফোন/ট্যাবলেট/পিসি)",
      "৭২০p HD ক্রিস্টাল ক্লিয়ার স্ট্রিমিং",
      "১০০+ লাইভ টিভি চ্যানেল ও নিউজ ফিড",
      "হলিউড, বলিউড ও বাংলা মুভি লাইব্রেরি",
      "স্ট্যান্ডার্ড BDIX ফাস্ট কানেক্টিভিটি",
      "মুভি ও সিরিজে কোনো বিজ্ঞাপন নেই",
      "৭ দিনের মানি-ব্যাক গ্যারান্টি",
    ],
  },
  {
    id: "standard",
    name: "Standard 1080p (স্ট্যান্ডার্ড)",
    badge: "সবচেয়ে জনপ্রিয়",
    description:
      "স্পোর্টস প্রেমী ও পরিবারের জন্য আদর্শ। ফুল HD 60fps-এ সকল স্পোর্টস চ্যানেল এবং স্মার্ট টিভি সমর্থন।",
    monthlyDisplay: "৳২৯৯",
    halfYearlyDisplay: "৳১,৪৯৯",
    yearlyDisplay: "৳২,৪৯৯",
    monthlyRateInYearly: "৳২০৮/মাস",
    isPopular: true,
    screens: "২টি ডিভাইস",
    resolution: "1080p Full HD (60fps)",
    features: [
      "২টি ডিভাইসে একসাথে (Smart TV + Mobile)",
      "১০৮০p Full HD @ 60fps আল্ট্রা-স্মুথ ফ্রেম",
      "২০০+ লাইভ টিভি ও VIP লাইভ স্পোর্টস (T Sports, Star Sports, Sony)",
      "হাই-স্পিড প্রায়োরিটি BDIX বাফারলেস রুট",
      "মোবাইল ও ব্রাউজারে অফলাইন ডাউনলোড",
      "৩টি আলাদা ইউজার প্রোফাইল",
      "১০০% বিজ্ঞাপনহীন প্রিমিয়াম স্ট্রিমিং",
    ],
  },
  {
    id: "premium",
    name: "Premium 4K VIP (ভিআইপি)",
    badge: "আল্টিমেট সিনেমা",
    description:
      "প্রকৃত সিনেমাটিক হোম থিয়েটার অভিজ্ঞতা। 4K Ultra HD, Dolby Atmos ৫.১ অডিও এবং ৪টি স্ক্রিন।",
    monthlyDisplay: "৳৪৯৯",
    halfYearlyDisplay: "৳২,৪৯৯",
    yearlyDisplay: "৳৩,৯৯৯",
    monthlyRateInYearly: "৳৩৩৩/মাস",
    screens: "৪টি ডিভাইস",
    resolution: "4K UHD + HDR10",
    features: [
      "৪টি ডিভাইসে একযোগে স্ট্রিমিং (Android TV, Apple TV, Fire TV, PC)",
      "4K Ultra HD + HDR10 + Dolby Vision",
      "২৫০+ সম্পূর্ণ লাইভ চ্যানেল (অল স্পোর্টস ও প্রিমিয়াম মুভিজ)",
      "ডলবি অ্যাটমস ৫.১ সারাউন্ড স্পেশিয়াল অডিও",
      "ডেডিকেটেড ভিআইপি এজ BDIX রুট (কোনো ল্যাগ নেই)",
      "আনলিমিটেড অফলাইন ডাউনলোড সুবিধা",
      "৬টি ডেডিকেটেড কিডস-লক প্রোফাইল",
      "২৪/৭ ভিআইপি হোয়াটসঅ্যাপ ও লাইভ সাপোর্ট",
    ],
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "halfYearly" | "yearly">("yearly");
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SelectedPlanInfo | null>(null);
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);

  useEffect(() => {
    async function loadDynamicPlans() {
      try {
        const data = await getSubscriptionPlans();
        if (data && data.length > 0) {
          const mapped: PlanItem[] = data.map((item) => ({
            id: item.slug,
            name: item.name,
            badge: item.badge || undefined,
            description: item.highlight ? "স্পোর্টস প্রেমী ও পরিবারের জন্য আদর্শ।" : "বাফারলেস আল্ট্রা BDIX স্ট্রিমিং।",
            monthlyDisplay: `৳${item.monthly_price}`,
            halfYearlyDisplay: `৳${item.half_yearly_price}`,
            yearlyDisplay: `৳${item.yearly_price}`,
            monthlyRateInYearly: `৳${Math.round(item.yearly_price / 12)}/মাস`,
            isPopular: item.highlight,
            screens: item.slug.includes("basic") ? "১টি ডিভাইস" : item.slug.includes("standard") ? "২টি ডিভাইস" : "৪টি ডিভাইস",
            resolution: item.slug.includes("basic") ? "720p HD" : item.slug.includes("standard") ? "1080p Full HD" : "4K Ultra HD",
            features: Array.isArray(item.features) && item.features.length > 0 ? item.features : [
              "BDIX আল্ট্রা-ফাস্ট লাইভ টিভি",
              "HD মুভি ও ওয়েব সিরিজ লাইব্রেরি",
              "স্মার্ট টিভি ও মোবাইল সাপোর্ট",
              "মানি-ব্যাক গ্যারান্টি",
            ],
          }));
          setPlans(mapped);
        }
      } catch {
        // Fallback to default
      }
    }
    loadDynamicPlans();
  }, []);

  const handleSelectPlan = (plan: PlanItem) => {
    let currentPrice = plan.monthlyDisplay;
    if (billingCycle === "halfYearly") currentPrice = plan.halfYearlyDisplay;
    if (billingCycle === "yearly") currentPrice = plan.yearlyDisplay;

    setSelectedPlanForModal({
      id: plan.id,
      name: plan.name,
      price: currentPrice,
      billingCycle,
      screens: plan.screens,
      resolution: plan.resolution,
    });
  };

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header + Billing Switch */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/25 text-red-500 text-xs font-black tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>স্বচ্ছ ও সাশ্রয়ী মেম্বারশিপ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            আপনার পছন্দের প্ল্যানটি বেছে নিন
          </h2>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
            কোনো ধরনের লুকানো ফি ছাড়াই দেশীয় টাকায় bKash, Nagad বা কার্ডে সহজ পেমেন্ট। বাৎসরিক প্ল্যানে উপভোগ করুন সর্বোচ্চ ৩৩% পর্যন্ত বিশেষ ছাড়!
          </p>
        </div>

        {/* 3 Billing Cycle Switchers */}
        <div className="flex items-center gap-1 bg-[#10121A] border border-white/[0.08] rounded-2xl p-1.5 shrink-0 self-start lg:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#1E212B] text-white shadow-md shadow-black/40 border border-white/10"
                : "text-[#9EA3B0] hover:text-white"
            }`}
          >
            মাসিক
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle("halfYearly")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              billingCycle === "halfYearly"
                ? "bg-[#1E212B] text-white shadow-md shadow-black/40 border border-white/10"
                : "text-[#9EA3B0] hover:text-white"
            }`}
          >
            <span>৬ মাস</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black px-1.5 py-0.2 rounded-full">
              -১৬%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              billingCycle === "yearly"
                ? "bg-[#E50000] text-white shadow-lg shadow-red-900/40"
                : "text-[#9EA3B0] hover:text-white"
            }`}
          >
            <span>বাৎসরিক</span>
            <span className="text-[10px] bg-black/40 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
              Save ৩৩%
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan) => {
          let priceDisplay = plan.monthlyDisplay;
          let subText = "/ মাস";

          if (billingCycle === "halfYearly") {
            priceDisplay = plan.halfYearlyDisplay;
            subText = "/ ৬ মাস";
          } else if (billingCycle === "yearly") {
            priceDisplay = plan.yearlyDisplay;
            subText = "/ বছর";
          }

          return (
            <div
              key={plan.id}
              className={`streamit-card p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                plan.isPopular
                  ? "border-red-500/80 bg-gradient-to-b from-[#191C28] to-[#12141D] shadow-2xl shadow-red-950/40 scale-[1.02]"
                  : "hover:border-white/20 bg-[#12141C]"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#E50000] to-[#FF2E2E] text-white shadow-md shadow-red-900/50 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>সবচেয়ে জনপ্রিয় চয়েস</span>
                </div>
              )}

              {/* Card Header & Price */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#9EA3B0]">
                    {plan.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#9EA3B0] mt-2.5 min-h-[40px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="my-6 py-4 border-y border-white/[0.08] space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {priceDisplay}
                    </span>
                    <span className="text-xs text-[#9EA3B0] font-semibold">
                      {subText}
                    </span>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      <span>কার্যকর মূল্য মাত্র {plan.monthlyRateInYearly}</span>
                    </div>
                  )}
                  {billingCycle === "halfYearly" && (
                    <div className="text-xs text-amber-300/90 font-medium">
                      ৬ মাসের এককালীন প্যাকেজ
                    </div>
                  )}
                </div>

                {/* Specs quick pill */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-bold text-white">
                    📱 {plan.screens}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-bold text-white">
                    🎬 {plan.resolution}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#E2E4E9]">
                      <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? "btn-screenbox-red shadow-lg shadow-red-900/40"
                      : "btn-screenbox-dark hover:border-red-500/50"
                  }`}
                >
                  <span>এখনই সাবস্ক্রাইব করুন</span>
                </button>

                <p className="text-[11px] text-center text-[#666C7A] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> bKash / Nagad / Card এ ইনস্ট্যান্ট অ্যাক্টিভ
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Checkout Modal */}
      <SubscriptionCheckoutModal
        plan={selectedPlanForModal}
        onClose={() => setSelectedPlanForModal(null)}
      />
    </section>
  );
}
