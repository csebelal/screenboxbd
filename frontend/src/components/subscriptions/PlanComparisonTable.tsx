import { Check, X, Sparkles } from "lucide-react";

export default function PlanComparisonTable() {
  const comparisonRows = [
    {
      feature: "মাসিক মূল্য (Monthly)",
      basic: "৳১৪৯ / মাস",
      standard: "৳২৯৯ / মাস",
      premium: "৳৪৯৯ / মাস",
    },
    {
      feature: "বাৎসরিক প্যাকেজ (Yearly)",
      basic: "৳১,১৯০ (মাত্র ৳৯৯/মা.)",
      standard: "৳২,৪৯৯ (মাত্র ৳২০৮/মা.)",
      premium: "৳৩,৯৯৯ (মাত্র ৳৩৩৩/মা.)",
    },
    {
      feature: "কনটেন্ট লাইব্রেরি",
      basic: "১০০+ টিভি চ্যানেল ও ফুল মুভি",
      standard: "২০০+ লাইভ টিভি + সকল স্পোর্টস",
      premium: "২৫০+ টিভি, VIP স্পোর্টস ও প্রিমিয়ার",
    },
    {
      feature: "ভিডিও রেজোলিউশন ও FPS",
      basic: "720p HD",
      standard: "1080p Full HD @ 60fps",
      premium: "4K Ultra HD + HDR10 + Dolby Vision",
    },
    {
      feature: "একযোগে স্ক্রিন / ডিভাইস",
      basic: "১টি ডিভাইস (Phone/PC)",
      standard: "২টি ডিভাইস (TV + Mobile)",
      premium: "৪টি ডিভাইস একসাথে",
    },
    {
      feature: "অডিও কোয়ালিটি",
      basic: "স্টেরিও ২.০",
      standard: "সারাউন্ড ৫.১ অডিও",
      premium: "ডলবি অ্যাটমস ৫.১ ও স্পেশিয়াল",
    },
    {
      feature: "বাফারলেস BDIX রুট",
      basic: "স্ট্যান্ডার্ড স্পিড",
      standard: "হাই-স্পিড প্রায়োরিটি রুট",
      premium: "আল্ট্রা ভিআইপি এজ রুট (পিক টাইমেও ফাস্ট)",
    },
    {
      feature: "লাইভ স্পোর্টস (T Sports, Star, Sony)",
      basic: "সীমিত চ্যানেল",
      standard: "সম্পূর্ণ আনলকড (Full HD)",
      premium: "ভিআইপি জিরো-লেটেন্সি ফিড",
    },
    {
      feature: "অফলাইন ভিডিও ডাউনলোড",
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: "বিজ্ঞাপনহীন স্ট্রিমিং (Ad-Free)",
      basic: "মুভিতে নো-অ্যাড",
      standard: true,
      premium: true,
    },
    {
      feature: "ফ্যামিলি ইউজার প্রোফাইল",
      basic: "১টি প্রোফাইল",
      standard: "৩টি প্রোফাইল",
      premium: "৬টি কিডস-লক প্রোফাইল",
    },
    {
      feature: "কাস্টমার সাপোর্ট",
      basic: "সাধারণ হেল্পডেস্ক",
      standard: "প্রায়োরিটি সাপোর্ট",
      premium: "২৪/৭ ভিআইপি হোয়াটসঅ্যাপ ও কল",
    },
    {
      feature: "মানি-ব্যাক গ্যারান্টি",
      basic: "৭ দিন",
      standard: "৭ দিন",
      premium: "৭ দিন",
    },
  ];

  return (
    <section id="compare" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-bold text-[#E50000] uppercase tracking-wider">
          স্বচ্ছ তুলনা ম্যাট্রিক্স
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          প্ল্যান ও ফিচারের বিস্তারিত তুলনা
        </h2>
        <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
          আপনার প্রয়োজন অনুযায়ী সঠিক প্ল্যানটি বেছে নিতে রেজোলিউশন, ডিভাইসের সীমা, অডিও সাপোর্ট এবং BDIX নেটওয়ার্ক ফিচারের পূর্ণ তালিকা নিচে দেখুন।
        </p>
      </div>

      {/* Comparison Table Container */}
      <div>
        <div className="sm:hidden flex items-center justify-between text-xs text-[#9EA3B0] mb-2 px-1">
          <span>ফিচার তুলনা</span>
          <span className="text-[#E50000] font-bold flex items-center gap-1">
            সোয়াইপ করে দেখুন &rarr;
          </span>
        </div>
        <div className="streamit-card overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto touch-pan-x">
            <table className="w-full text-left border-collapse min-w-[580px]">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0E1016]">
                  <th className="p-3.5 sm:p-6 text-xs sm:text-sm font-bold text-[#9EA3B0] uppercase tracking-wider w-1/4">
                    ফিচার ও সুবিধাসমূহ
                  </th>
                  <th className="p-3.5 sm:p-6 text-xs sm:text-sm font-bold text-white w-1/4">
                    Basic HD
                  </th>
                  <th className="p-3.5 sm:p-6 text-xs sm:text-sm font-bold text-white w-1/4 bg-red-950/20 border-x border-red-500/20">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black">Standard 1080p</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E50000] text-white shadow-sm">
                        জনপ্রিয়
                      </span>
                    </div>
                  </th>
                  <th className="p-3.5 sm:p-6 text-xs sm:text-sm font-bold text-white w-1/4">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Premium 4K VIP</span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02] transition">
                    {/* Feature Title */}
                    <td className="p-3.5 sm:p-6 font-bold text-white">
                      {row.feature}
                    </td>

                    {/* Basic Column */}
                    <td className="p-3.5 sm:p-6 text-[#9EA3B0]">
                      {typeof row.basic === "boolean" ? (
                        row.basic ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/[0.05] text-[#666C7A] flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )
                      ) : (
                        row.basic
                      )}
                    </td>

                    {/* Standard Column (Highlighted) */}
                    <td className="p-3.5 sm:p-6 text-white font-medium bg-red-950/10 border-x border-red-500/15">
                      {typeof row.standard === "boolean" ? (
                        row.standard ? (
                          <div className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center border border-red-500/40">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/[0.05] text-[#666C7A] flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )
                      ) : (
                        row.standard
                      )}
                    </td>

                    {/* Premium Column */}
                    <td className="p-3.5 sm:p-6 text-[#E2E4E9] font-medium">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/[0.05] text-[#666C7A] flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )
                      ) : (
                        <span className="text-white font-semibold">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
