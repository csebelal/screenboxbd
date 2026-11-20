import Link from "next/link";
import ScreenBoxLogo from "./ScreenBoxLogo";
import { ShieldCheck, Wifi, Award } from "lucide-react";

interface FooterProps {
  showCta?: boolean;
}

export default function Footer({}: FooterProps) {
  const footerSections = [
    {
      title: "Discover",
      links: [
        { label: "Home Showcase", href: "/" },
        { label: "Movies Catalog", href: "/movies?tab=movies" },
        { label: "TV Series & Shows", href: "/movies?tab=shows" },
        { label: "Live IPTV Channels", href: "/tv" },
        { label: "Popular Categories", href: "/#categories" },
      ],
    },
    {
      title: "Navigation",
      links: [
        { label: "Trending Top 10", href: "/movies#trending" },
        { label: "New Blockbusters", href: "/movies#new-releases" },
        { label: "Streaming Guides & Blog", href: "/blog" },
        { label: "Supported Devices", href: "/#devices" },
        { label: "Frequently Asked Questions", href: "/#faq" },
      ],
    },
    {
      title: "Membership",
      links: [
        { label: "Subscription Plans", href: "/subscriptions" },
        { label: "Plan Comparison Matrix", href: "/subscriptions#compare" },
        { label: "7-Day Free Trial", href: "/subscriptions" },
        { label: "VIP 4K Ultra Access", href: "/subscriptions" },
      ],
    },
    {
      title: "Support & Legal",
      links: [
        { label: "Help & Contact Desk", href: "/support" },
        { label: "System Uptime Status", href: "/support" },
        { label: "Terms of Service", href: "/support" },
        { label: "Privacy Policy", href: "/support" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#090A0D] border-t border-white/[0.08] pt-4">
      {/* Main Footer Links & Brand Section */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Col (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4">
            <ScreenBoxLogo />
            <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed max-w-sm">
              ScreenBoxBD delivers cinema-grade entertainment: 240+ bufferless Live IPTV channels, Hollywood & Bollywood blockbusters, and complete TV seasons in 4K HDR.
            </p>

            {/* Platform Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#14161E] border border-white/[0.08] text-[#9EA3B0]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SSL Secured
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#14161E] border border-white/[0.08] text-[#9EA3B0]">
                <Wifi className="w-3.5 h-3.5 text-blue-400" /> BDIX Ultra-Speed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#14161E] border border-white/[0.08] text-[#9EA3B0]">
                <Award className="w-3.5 h-3.5 text-amber-400" /> 4K HDR Atmos
              </span>
            </div>
          </div>

          {/* 4 Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-[#9EA3B0] hover:text-white transition cursor-pointer flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666C7A]">
          <p>© {new Date().getFullYear()} ScreenBoxBD OTT Platform. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="/support" className="hover:text-white transition">
              Terms
            </Link>
            <span>&bull;</span>
            <Link href="/support" className="hover:text-white transition">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link href="/support" className="hover:text-white transition">
              Cookies
            </Link>
            <span>&bull;</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
