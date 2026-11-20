"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Sparkles, Search } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Trigger global search modal if available
  const handleSearchClick = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      exact: true,
    },
    {
      label: "Movies",
      href: "/movies",
      icon: Film,
      exact: false,
    },
    {
      label: "Live TV",
      href: "/tv",
      icon: Tv,
      isLive: true,
      exact: false,
    },
    {
      label: "Plans",
      href: "/subscriptions",
      icon: Sparkles,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B0C0E]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5 transition-all duration-300"
    >
      <div className="grid grid-cols-5 items-center justify-around h-14 max-w-md mx-auto px-1">
        {navItems.slice(0, 2).map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${
                active
                  ? "text-[#E50000]"
                  : "text-[#8E95A5] hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"}`} />
                {active && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#E50000] shadow-[0_0_8px_#E50000]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight transition-colors ${active ? "font-bold text-white" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center Live TV Button with Pulsing Dot */}
        {(() => {
          const liveItem = navItems[2];
          const active = isActive(liveItem.href, liveItem.exact);
          const Icon = liveItem.icon;
          return (
            <Link
              key={liveItem.href}
              href={liveItem.href}
              className={`relative flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${
                active
                  ? "text-[#E50000]"
                  : "text-[#8E95A5] hover:text-white"
              }`}
            >
              <div className="relative">
                <div className={`p-1 rounded-xl ${active ? "bg-red-600/20 text-[#E50000] border border-red-500/30 shadow-md shadow-red-950/40" : ""}`}>
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"}`} />
                </div>
                {/* Live pulsing badge */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50000]" />
                </span>
              </div>
              <span className={`text-[10px] tracking-tight transition-colors ${active ? "font-black text-[#E50000]" : "font-semibold"}`}>
                {liveItem.label}
              </span>
            </Link>
          );
        })()}

        {/* Subscriptions */}
        {(() => {
          const planItem = navItems[3];
          const active = isActive(planItem.href, planItem.exact);
          const Icon = planItem.icon;
          return (
            <Link
              key={planItem.href}
              href={planItem.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${
                active
                  ? "text-[#E50000]"
                  : "text-[#8E95A5] hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"}`} />
                {active && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#E50000] shadow-[0_0_8px_#E50000]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight transition-colors ${active ? "font-bold text-white" : "font-medium"}`}>
                {planItem.label}
              </span>
            </Link>
          );
        })()}

        {/* Global Search Trigger */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl text-[#8E95A5] hover:text-white active:scale-90 transition-all duration-200 cursor-pointer"
          aria-label="Search catalog"
        >
          <div className="relative">
            <Search className="w-5 h-5 stroke-[1.8]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight">
            Search
          </span>
        </button>
      </div>
    </nav>
  );
}
