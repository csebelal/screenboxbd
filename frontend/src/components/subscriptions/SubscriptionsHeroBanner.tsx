import { Sparkles, Tv, ShieldCheck, Zap, Radio } from "lucide-react";

export default function SubscriptionsHeroBanner() {
  return (
    <div className="relative overflow-hidden pt-8 pb-4 text-center">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
        {/* Promotional Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 via-red-500/10 to-amber-500/20 border border-red-500/30 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-950/20">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>বিশেষ অফার: বাৎসরিক প্যাকেজে সর্বোচ্চ ৩৩% পর্যন্ত ছাড়!</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          সীমাহীন বিনোদন, বাফারলেস BDIX <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
            ও ২৫০+ লাইভ টিভি চ্যানেল
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[#9EA3B0] max-w-2xl mx-auto leading-relaxed">
          আপনার স্মার্ট টিভি, মোবাইল ও পিসিতে উপভোগ করুন সেরা লাইভ স্পোর্টস, ব্লকবাস্টার মুভি ও ওয়েব সিরিজ। দেশীয় টাকায় bKash বা নগদে ১০০% নিরাপদ পেমেন্ট।
        </p>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-3 text-xs sm:text-sm text-[#E2E4E9]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span>২৫০+ লাইভ টিভি ও স্পোর্টস</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>বাফারলেস BDIX রুট</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>৭ দিনের মানি-ব্যাক গ্যারান্টি</span>
          </div>
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-amber-400" />
            <span>স্মার্ট টিভি ও মোবাইল সাপোর্ট</span>
          </div>
        </div>
      </div>
    </div>
  );
}
