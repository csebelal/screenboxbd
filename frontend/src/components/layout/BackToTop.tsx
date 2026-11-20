"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E50000] hover:bg-[#FF1A1A] text-white flex items-center justify-center shadow-2xl shadow-red-950/80 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20 animate-in fade-in zoom-in-75 duration-200"
      aria-label="Back to top"
      title="Scroll back to top"
    >
      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
    </button>
  );
}
