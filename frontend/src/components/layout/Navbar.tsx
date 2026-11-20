"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  X,
  Heart,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Tv,
  Film,
  Flame,
  CheckCircle2,
} from "lucide-react";
import ScreenBoxLogo from "./ScreenBoxLogo";


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Movies & Shows", href: "/movies" },
    { label: "Live TV", href: "/tv" },
    { label: "Subscriptions", href: "/subscriptions" },
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
  ];

  const quickSuggestions = [
    { title: "Kantara: A Legend", type: "Movie", href: "/movies/kantara-a-legend" },
    { title: "Stranger Things S4", type: "Series", href: "/series/stranger-things" },
    { title: "Action HD Live", type: "Live TV", href: "/tv/action-hd" },
    { title: "Oppenheimer (4K)", type: "Movie", href: "/movies/oppenheimer" },
    { title: "Dune: Part Two", type: "Movie", href: "/movies/dune-part-two" },
  ];

  const notifications = [
    {
      id: 1,
      title: "New 4K Release: Dune: Part Two",
      time: "2 hours ago",
      read: false,
      href: "/movies/dune-part-two",
    },
    {
      id: 2,
      title: "Action HD Live Stream Starting",
      time: "5 hours ago",
      read: false,
      href: "/tv/action-hd",
    },
    {
      id: 3,
      title: "New Season 4: Stranger Things",
      time: "1 day ago",
      read: true,
      href: "/series/stranger-things",
    },
  ];

  // Close dropdowns on outside click and route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Lock body scroll when search modal or mobile menu is open
  useEffect(() => {
    if (searchModalOpen || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [searchModalOpen, mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);



  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0B0C0E]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo */}
          <ScreenBoxLogo />

          {/* Center Pill Navigation (Desktop & Laptop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121318]/90 border border-white/[0.08] rounded-full p-1.5 shadow-inner">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-[#1E212B] text-white shadow-md shadow-black/40 border border-white/10"
                      : "text-[#9EA3B0] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#E50000] shadow-[0_0_8px_#E50000]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#14161E] border border-white/[0.08] hover:border-white/20 text-[#9EA3B0] hover:text-white transition duration-200 cursor-pointer"
              title="Search catalog (Ctrl + K)"
            >
              <Search className="w-4 h-4 text-[#9EA3B0] group-hover:text-red-500 transition-colors" />
              <span className="hidden xl:inline text-xs text-[#666C7A]">Search movies, TV...</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#666C7A] bg-black/40 border border-white/[0.08] rounded">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Button & Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                  notificationsOpen
                    ? "bg-[#1E212B] border-red-500/50 text-white"
                    : "bg-[#14161E] border-white/[0.08] hover:border-white/20 text-[#9EA3B0] hover:text-white"
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E50000] ring-2 ring-[#0B0C0E]" />
              </button>

              {/* Notifications Dropdown Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl bg-[#12141C] border border-white/10 shadow-2xl shadow-black/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#E50000]" />
                      <span className="text-sm font-bold text-white">Notifications</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#E50000] bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-full">
                      2 New
                    </span>
                  </div>

                  <div className="divide-y divide-white/[0.06] mt-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => setNotificationsOpen(false)}
                        className={`block py-3 px-2 rounded-xl transition ${
                          n.read
                            ? "hover:bg-white/[0.03] text-[#9EA3B0]"
                            : "bg-white/[0.02] hover:bg-white/[0.05] text-white"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              n.read ? "bg-zinc-600" : "bg-[#E50000] shadow-[0_0_8px_#E50000]"
                            }`}
                          />
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <p className="text-xs font-semibold leading-snug truncate">
                              {n.title}
                            </p>
                            <p className="text-[10px] text-[#666C7A]">{n.time}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] text-center">
                    <Link
                      href="/movies"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-bold text-[#E50000] hover:text-red-400 transition"
                    >
                      View All Activity &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-[#14161E] border border-white/[0.08] hover:border-white/20 transition cursor-pointer"
                title="Account Menu"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#E50000] to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  V
                </div>
                <span className="hidden sm:inline text-xs font-bold text-white">VIP User</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#12141C] border border-white/10 shadow-2xl shadow-black/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-white/[0.08] mb-2">
                    <p className="text-xs font-bold text-white">Premium VIP Member</p>
                    <p className="text-[11px] text-[#9EA3B0] truncate">user@screenboxbd.com</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" /> Active 4K Ultra Plan
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/subscriptions"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#E2E4E9] hover:bg-white/[0.05] rounded-xl transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E50000]" />
                      <span>Manage Subscription</span>
                    </Link>
                    <Link
                      href="/movies?tab=movies"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#E2E4E9] hover:bg-white/[0.05] rounded-xl transition"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#9EA3B0]" />
                      <span>My Watchlist</span>
                    </Link>
                    <Link
                      href="/support"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#E2E4E9] hover:bg-white/[0.05] rounded-xl transition"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#9EA3B0]" />
                      <span>Support & Help</span>
                    </Link>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/20 rounded-xl transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#14161E] border border-white/[0.08] flex items-center justify-center text-[#9EA3B0] hover:text-white transition cursor-pointer"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-40 md:hidden bg-[#0F1117] border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition active:scale-[0.98] cursor-pointer ${
                      active
                        ? "bg-[#1C1F2B] text-white border border-[#E50000]/40 shadow-sm shadow-red-950/30"
                        : "text-[#9EA3B0] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-[#E50000]" />}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-white/[0.08] flex gap-2">
                <Link
                  href="/subscriptions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 btn-screenbox-red text-xs py-3.5 text-center font-bold"
                >
                  Get Premium Pass
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Interactive Global Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 lg:p-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-[#12141C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center border-b border-white/[0.08] px-4 py-3"
            >
              <Search className="w-5 h-5 text-[#E50000] shrink-0 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows, live channels..."
                className="w-full bg-transparent text-white placeholder-[#666C7A] text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-[#9EA3B0] hover:text-white mr-2"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-[#9EA3B0] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestions & Trending Tags */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-[11px] font-bold text-[#666C7A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-500" /> Trending Searches
                </p>
                <div className="space-y-1.5">
                  {quickSuggestions.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#181A24] border border-white/[0.08] flex items-center justify-center text-[#9EA3B0] group-hover:text-red-500 group-hover:border-red-500/30 transition">
                          {item.type === "Live TV" ? (
                            <Tv className="w-3.5 h-3.5" />
                          ) : (
                            <Film className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-white group-hover:text-red-400 transition">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.06] text-[#9EA3B0]">
                          {item.type}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#666C7A] group-hover:text-white transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-[#0E1016] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#666C7A]">
              <span>Press ↵ to search</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
