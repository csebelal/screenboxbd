import Link from "next/link";
import { Play, Sparkles } from "lucide-react";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CtaBanner({
  title = "Start your 7-day free trial today!",
  subtitle = "Experience bufferless Live IPTV channels and thousands of 4K blockbuster movies on any screen. Cancel anytime with zero commitment.",
  buttonText = "Start Free Trial",
  buttonHref = "/subscriptions",
}: CtaBannerProps) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-[#12141C] via-[#1A1D27] to-[#12141C] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-black/80">
        {/* Subtle Ambient Red Light Flare */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-950/20 rounded-full blur-2xl pointer-events-none" />

        {/* Text Content */}
        <div className="relative z-10 max-w-2xl text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600/15 text-red-400 border border-red-500/25 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP All-Access Streaming</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* CTA Button */}
        <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={buttonHref}
            className="btn-screenbox-red text-base px-8 py-4 shadow-xl shadow-red-950/60 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{buttonText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
