import { ShieldCheck, Zap, Lock, CreditCard } from "lucide-react";

export default function PaymentPartnersBanner() {
  const paymentMethods = [
    {
      name: "bKash",
      bangla: "বিকাশ",
      badgeColor: "bg-[#D12053]/15 text-[#FF3E78] border-[#D12053]/40",
      dotColor: "bg-[#D12053]",
      desc: "ইনস্ট্যান্ট পেমেন্ট",
    },
    {
      name: "Nagad",
      bangla: "নগদ",
      badgeColor: "bg-[#F35A22]/15 text-[#FF7038] border-[#F35A22]/40",
      dotColor: "bg-[#F35A22]",
      desc: "জিরো চার্জ",
    },
    {
      name: "Rocket",
      bangla: "রকেট",
      badgeColor: "bg-[#8A257D]/15 text-[#C45EBA] border-[#8A257D]/40",
      dotColor: "bg-[#8A257D]",
      desc: "DBBL সিকিউর",
    },
    {
      name: "Upay",
      bangla: "উপায়",
      badgeColor: "bg-[#00897B]/15 text-[#26A69A] border-[#00897B]/40",
      dotColor: "bg-[#00897B]",
      desc: "UCB স্পিড",
    },
    {
      name: "Visa / Master",
      bangla: "কার্ড",
      badgeColor: "bg-[#1A1F71]/30 text-[#60A5FA] border-[#3B82F6]/40",
      dotColor: "bg-[#3B82F6]",
      desc: "ডেবিট ও ক্রেডিট",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="streamit-card p-6 sm:p-8 bg-gradient-to-r from-[#11131A] via-[#161822] to-[#11131A] border border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Column: Title and Security Highlights */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5" />
              <span>ইনস্ট্যান্ট অটো-অ্যাক্টিভেশন (Instant Access)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              দেশীয় সকল পেমেন্ট মেথড সমর্থিত
            </h3>
            <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed">
              বিকাশ, নগদ, রকেট বা যেকোনো ডেবিট/ক্রেডিট কার্ড দিয়ে ঝামেলাহীন পেমেন্ট করুন। পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই অ্যাকাউন্ট অ্যাক্টিভ হয়ে যাবে।
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#9EA3B0]">
              <span className="flex items-center gap-1.5 text-white/90">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ২৫৬-বিট SSL এনক্রিপ্টেড
              </span>
              <span className="flex items-center gap-1.5 text-white/90">
                <Lock className="w-4 h-4 text-emerald-400" />
                ১০০% নিরাপদ ট্রানজ্যাকশন
              </span>
              <span className="flex items-center gap-1.5 text-white/90">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                কোনো হিডেন ফি নেই
              </span>
            </div>
          </div>

          {/* Right Column: Supported Wallets / Card Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {paymentMethods.map((m) => (
              <div
                key={m.name}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm transition-all hover:scale-105 ${m.badgeColor}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${m.dotColor} animate-pulse`} />
                <div className="text-left">
                  <div className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                    <span>{m.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">({m.bangla})</span>
                  </div>
                  <div className="text-[10px] opacity-80 font-medium">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
