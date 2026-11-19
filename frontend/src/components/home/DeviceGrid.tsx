import {
  Smartphone,
  Tablet,
  Tv,
  Laptop,
  Gamepad2,
  Cast,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";

export default function DeviceGrid() {
  const devices = [
    {
      title: "স্মার্টফোন (Smartphones)",
      badge: "iOS ও Android",
      icon: Smartphone,
      specs: ["টাচ কন্ট্রোল", "অফলাইন ডাউনলোড", "পিকচার-ইন-পিকচার"],
      description:
        "রাস্তায় চলার পথে বা যেকোনো জায়গায় স্মার্টফোনে আল্ট্রা-স্মুথ স্ট্রিমিং। ভলিউম ও ব্রাইটনেস সোয়াইপ জেশ্চার এবং মোবাইল ডেটা সেভিং মোড অন্তর্ভুক্ত।",
      highlight: "কোনো অ্যাপ ইনস্টল ছাড়াই ব্রাউজারে ইনস্ট্যান্ট প্লে",
    },
    {
      title: "স্মার্ট টিভি (Smart TV & TV Box)",
      badge: "Android TV, Tizen, WebOS & Apple TV",
      icon: Tv,
      specs: ["4K Ultra HD", "ডলবি অ্যাটমস ৫.১", "টিভি রিমোট সাপোর্ট"],
      description:
        "ড্রয়িং রুমের বড় স্ক্রিনে স্টেডিয়ামের মতো লাইভ স্পোর্টস ও সিনেমা হল অভিজ্ঞতা। ফুল 4K HDR 60fps এবং টিভি রিমোট দিয়ে সহজে চ্যানেল চেঞ্জ করার সুবিধা।",
      highlight: "Mi Box, FireStick ও Chromecast সম্পূর্ণ সাপোর্টেড",
    },
    {
      title: "ল্যাপটপ ও পিসি (Laptops & Desktops)",
      badge: "Chrome, Edge, Safari, Firefox",
      icon: Laptop,
      specs: ["কিবোর্ড শর্টকাটস", "BDIX ডিরেক্ট স্পিড", "মাল্টি-মনিটর"],
      description:
        "কাজের ফাঁকে ব্রাউজারে সরাসরি বাফারলেস HLS প্লেয়ার। কোনো প্লাগইন ছাড়াই স্পেসবার দিয়ে প্লে/পজ, অ্যারো কি দিয়ে ১০ সেকেন্ড ফরওয়ার্ড এবং ফ্লুইড প্লেব্যাক।",
      highlight: "হার্ডওয়্যার অ্যাকসেলেরেশন ও জিরো সিপিইউ ড্রপ",
    },
    {
      title: "ট্যাবলেট ও আইপ্যাড (Tablets)",
      badge: "iPadOS & Galaxy Tab",
      icon: Tablet,
      specs: ["রেটিনা ডিসপ্লে", "স্প্লিট-স্ক্রিন", "মাল্টি-উইন্ডো"],
      description:
        "বিছানায় শুয়ে আরাম করে মুভি বা ওয়েব সিরিজ দেখার সেরা মাধ্যম। হাই-রেজোলিউশন রেটিনা ডিসপ্লেতে ক্রিস্টাল ক্লিয়ার পিকচার ও স্প্লিট-স্ক্রিন মোড।",
      highlight: "ফুল স্ক্রিন জেশ্চার ও আল্ট্রা-ওয়াইড ভিউ",
    },
    {
      title: "টিভি স্টিক ও কাস্ট (Streaming Sticks)",
      badge: "FireStick, Chromecast & Mi Stick",
      icon: Cast,
      specs: ["প্লাগ অ্যান্ড প্লে", "ভয়েস সার্চ সাপোর্ট", "লো-লেটেন্সি"],
      description:
        "যেকোনো সাধারণ এইচডিএমআই (HDMI) মনিটর বা পুরোনো টিভিকে রূপান্তর করুন ফুল স্মার্ট টিভিতে। অতি সহজে প্লাগ অ্যান্ড প্লে স্ট্রিমিং।",
      highlight: "মোবাইল থেকে ১-ক্লিকে টিভিতে কাস্টিং সুবিধা",
    },
    {
      title: "গেমিং কনসোল (Gaming Consoles)",
      badge: "PlayStation 5, Xbox & Steam Deck",
      icon: Gamepad2,
      specs: ["HDR অডিও", "হাই রিফ্রেশ রেট", "কনসোল ব্রাউজার"],
      description:
        "গেম খেলার ফাঁকে ফেভারিট লাইভ স্পোর্টস বা মুভি উপভোগ করুন কনসোলের বিল্ট-ইন ব্রাউজার দিয়ে। ফুল HDR ও ডায়নামিক সাউন্ড সাপোর্ট।",
      highlight: "হাই-স্পিড জিরো ইনপুট ল্যাগ স্ট্রিমিং",
    },
  ];

  return (
    <section id="devices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/25 text-red-500 text-xs font-black tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>স্মার্ট মাল্টি-ডিভাইস ইকোসিস্টেম</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            যেকোনো ডিভাইসে উপভোগ করুন নিরবচ্ছিন্ন স্ট্রিমিং
          </h2>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
            স্মার্টফোনে দেখা শুরু করুন, ঘরে ফিরে স্মার্ট টিভিতে ঠিক যেখান থেকে শেষ করেছিলেন সেখান থেকেই উপভোগ করুন। ScreenBoxBD সকল ডিভাইসে আপনার ওয়াচ হিস্ট্রি স্বয়ংক্রিয়ভাবে সিঙ্ক করে।
          </p>
        </div>

        {/* Sync Feature Indicator Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#12141D] border border-white/[0.08] text-xs font-bold text-white shrink-0 self-start lg:self-auto shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>অটোমেটিক ক্লাউড হিস্ট্রি সিঙ্ক</span>
        </div>
      </div>

      {/* 6 Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
        {devices.map((device) => {
          const Icon = device.icon;
          return (
            <div
              key={device.title}
              className="streamit-card p-6 sm:p-7 flex flex-col justify-between group hover:border-red-500/50 hover:bg-gradient-to-b hover:from-[#171924] hover:to-[#11131A] transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle top-right ambient glow on hover */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all pointer-events-none" />

              <div>
                {/* Header: Glowing Icon + Title + Platform Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#141620] border border-white/[0.08] flex items-center justify-center text-red-500 shadow-lg shadow-black/50 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all duration-300">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.04] text-[#A6ABB8] border border-white/[0.07] group-hover:border-white/20 transition-colors">
                    {device.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-red-400 transition-colors mb-2.5">
                  {device.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed mb-5">
                  {device.description}
                </p>

                {/* Feature Spec Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {device.specs.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#C2C6D1]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Highlight */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{device.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
