import { CheckCircle2, XCircle, TrendingUp, Sparkles, Layers } from "lucide-react";

export default function SavingsComparisonSection() {
  const competitorBreakdown = [
    { service: "হলিউড ও গ্লোবাল মুভিজ (Netflix BD)", cost: "৳৪৮০+", tag: "আন্তর্জাতিক কার্ড লাগে" },
    { service: "বাংলা অরিজিনাল ও নাটক (চরকি)", cost: "৳৯৯", tag: "সীমিত চ্যানেল" },
    { service: "বাংলা ওয়েব সিরিজ (হইচই)", cost: "৳১৫০", tag: "শুধু সিরিজ" },
    { service: "ডিস লাইন ও লাইভ স্পোর্টস (Cable TV)", cost: "৳৩৫০", tag: "বাফারিং ও তারের ঝামেলা" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="streamit-card p-6 sm:p-10 bg-gradient-to-br from-[#12141D] via-[#161822] to-[#0E1017] border border-white/10 relative overflow-hidden">
        {/* Decorative ambient elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>স্মার্ট ভ্যালু ও সাশ্রয় বিশ্লেষণ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            কেন ScreenBoxBD দেশের সবচেয়ে সাশ্রয়ী স্ট্রিমিং সেবা?
          </h2>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
            আলাদা আলাদা ৪টি সার্ভিসের জন্য মাসে ১৫০০+ টাকা খরচের দিন শেষ। ScreenBoxBD-তে লাইভ টিভি, স্পোর্টস, মুভি ও ওয়েব সিরিজ পাচ্ছেন এক ছাদের নিচে।
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Card: Other Subscriptions Combined */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0D12] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm sm:text-base">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span>আলাদা আলাদা সাবস্ক্রিপশন নিলে</span>
                </div>
                <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                  অতিরিক্ত ব্যয়বহুল
                </span>
              </div>

              <div className="mt-6 space-y-3.5">
                {competitorBreakdown.map((item) => (
                  <div
                    key={item.service}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white/90">
                        {item.service}
                      </div>
                      <div className="text-[11px] text-[#666C7A]">{item.tag}</div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#E2E4E9]">
                      {item.cost}/মাস
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between bg-rose-950/20 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-rose-500/20">
              <div>
                <div className="text-xs text-rose-300 font-medium">আলাদা নিলে মোট মাসিক খরচ</div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  ৳১,০৭৯ - ৳১,৭৯৯ <span className="text-xs font-normal text-rose-200">/মাস</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-rose-300/80">বছরে অপচয় প্রায়</span>
                <div className="text-sm font-bold text-rose-400">৳১৩,০০০ - ৳২১,৫০০</div>
              </div>
            </div>
          </div>

          {/* Right Card: ScreenBoxBD All-in-One Solution */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1C141E] to-[#12141D] border-2 border-red-500/40 relative shadow-2xl shadow-red-950/30 flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>অল-ইন-ওয়ান সমাধান</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-red-500/20">
                <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg font-black text-white">ScreenBoxBD স্ট্রিমিং</span>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  সেরা সাশ্রয়ী
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      ২৫০+ লাইভ চ্যানেল ও ফুল HD স্পোর্টস
                    </div>
                    <div className="text-[11px] text-[#9EA3B0]">T Sports, Star Sports, Sony Ten & Willow</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      হাজারো মুভি, সিরিজ ও এক্সক্লুসিভ VOD
                    </div>
                    <div className="text-[11px] text-[#9EA3B0]">হলিউড, বলিউড, বাংলা ড্রামা ও এনিমে ১ ক্লিকে</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      বাফারলেস BDIX আল্ট্রা স্পিড
                    </div>
                    <div className="text-[11px] text-[#9EA3B0]">দেশের যেকোনো ব্রডব্যান্ডে পিক আওয়ারেও বাফারলেস</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-red-500/20 flex items-center justify-between bg-gradient-to-r from-red-950/40 to-[#1F131A] -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-red-500/30">
              <div>
                <div className="text-xs text-red-300 font-semibold">স্ট্যান্ডার্ড প্ল্যানে মাসিক খরচ</div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ৳২৯৯ <span className="text-xs font-medium text-[#9EA3B0]">/মাস</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                  বাৎসরিক নিলে মাত্র ৳২০৮/মাস!
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-300 font-semibold">বছরে সাশ্রয় হবে প্রায়</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                  ৳১০,০০০ - ৳১৫,০০০+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
