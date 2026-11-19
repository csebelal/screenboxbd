"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Minus, MessageSquare } from "lucide-react";
import { getFaqs } from "@/lib/api";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_LEFT_FAQS: FaqItem[] = [
  {
    id: "01",
    question: "What is ScreenBoxBD?",
    answer:
      "ScreenBoxBD is Bangladesh's premier next-generation streaming platform offering on-demand 4K blockbuster movies, full TV series seasons, and high-definition bufferless Live TV channels with adaptive BDIX bitrate streaming.",
  },
  {
    id: "02",
    question: "ScreenBoxBD-এর মাসিক সাবস্ক্রিপশন ফি কত?",
    answer:
      "ScreenBoxBD অত্যন্ত সাশ্রয়ী দেশীয় মূল্যে উপলব্ধ: Basic HD মাত্র ৳১৪৯/মাস, Standard 1080p মাত্র ৳২৯৯/মাস (বাৎসরিক নিলে মাত্র ৳২০৮/মাস), এবং Premium 4K VIP মাত্র ৳৪৯৯/মাস। প্রতিটি প্ল্যানে ৭ দিনের মানি-ব্যাক গ্যারান্টি অন্তর্ভুক্ত।",
  },
  {
    id: "03",
    question: "What content is available on ScreenBoxBD?",
    answer:
      "ScreenBoxBD features an extensive library of popular Hollywood blockbusters, international cinema, complete TV series seasons, anime, and 240+ Live IPTV channels including live sports, movies, and 24/7 news.",
  },
  {
    id: "04",
    question: "How can I watch ScreenBoxBD?",
    answer:
      "You can stream directly through any modern web browser on your laptop, desktop, mobile smartphone, tablet, or smart TV with zero app installation needed.",
  },
];

const DEFAULT_RIGHT_FAQS: FaqItem[] = [
  {
    id: "05",
    question: "How do I sign up for ScreenBoxBD?",
    answer:
      "Simply select your preferred subscription tier on our Subscriptions page, start your 7-day free trial, and begin watching instantly on all your devices.",
  },
  {
    id: "06",
    question: "What is the ScreenBoxBD free trial?",
    answer:
      "Every new member receives a full 7-day free trial with unlimited access to movies, shows, and live TV channels. You can cancel anytime before the trial ends without any charge.",
  },
  {
    id: "07",
    question: "How do I contact customer support?",
    answer:
      "Our customer support team is available 24/7. You can submit an inquiry through our dedicated Support page or reach out via live chat and email ticket.",
  },
  {
    id: "08",
    question: "কিভাবে পেমেন্ট করা যাবে? (Supported Payment Methods)",
    answer:
      "আমরা দেশের সকল মোবাইল ব্যাংকিং (বিকাশ bKash, নগদ Nagad, রকেট Rocket, উপায় Upay) এবং যেকোনো লোকাল ও ইন্টারন্যাশনাল ডেবিট/ক্রেডিট কার্ড (Visa, MasterCard, Amex) সমর্থন করি। পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই অ্যাকাউন্ট অটো-অ্যাক্টিভ হয়ে যায়।",
  },
];

export default function FaqAccordion() {
  const [openIds, setOpenIds] = useState<string[]>(["01", "05"]);
  const [leftFaqs, setLeftFaqs] = useState<FaqItem[]>(DEFAULT_LEFT_FAQS);
  const [rightFaqs, setRightFaqs] = useState<FaqItem[]>(DEFAULT_RIGHT_FAQS);

  useEffect(() => {
    async function loadDynamicFaqs() {
      try {
        const data = await getFaqs();
        if (data && data.length > 0) {
          const items: FaqItem[] = data.map((f: { id?: number; question: string; answer: string }, idx: number) => ({
            id: String(f.id || idx + 1).padStart(2, "0"),
            question: f.question,
            answer: f.answer,
          }));
          const mid = Math.ceil(items.length / 2);
          setLeftFaqs(items.slice(0, mid));
          setRightFaqs(items.slice(mid));
        }
      } catch {
        // Fallback to defaults
      }
    }
    loadDynamicFaqs();
  }, []);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderFaqColumn = (faqs: FaqItem[]) => (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = openIds.includes(faq.id);
        return (
          <div
            key={faq.id}
            className={`streamit-card p-5 sm:p-6 transition-all duration-300 ${
              isOpen
                ? "border-red-600/40 bg-[#161822] shadow-xl shadow-red-950/10"
                : "hover:border-white/20"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-[#11131A] border border-white/[0.08] flex items-center justify-center text-xs font-black text-white group-hover:border-red-500/50 group-hover:text-red-500 transition-colors">
                  {faq.id}
                </span>
                <span className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors">
                  {faq.question}
                </span>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#14161E] border border-white/[0.08] flex items-center justify-center text-[#9EA3B0] group-hover:text-white transition-colors shrink-0">
                {isOpen ? (
                  <Minus className="w-4 h-4 text-red-500" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs sm:text-sm text-[#9EA3B0] leading-relaxed pl-14 animate-in fade-in slide-in-from-top-2 duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header with Ask Question Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#E50000] uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#9EA3B0]">
            Got questions? We&apos;ve got answers! Check out our FAQ section to find answers to the most common questions about ScreenBoxBD.
          </p>
        </div>

        <Link
          href="/support"
          className="btn-screenbox-dark text-xs sm:text-sm py-3 px-5 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-red-500" />
          <span>Ask a Question</span>
        </Link>
      </div>

      {/* 2-Column FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {renderFaqColumn(leftFaqs)}
        {renderFaqColumn(rightFaqs)}
      </div>
    </section>
  );
}
