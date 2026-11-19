"use client";

import { useState } from "react";
import FaqAccordion from "@/components/home/FaqAccordion";
import {
  Check,
  Send,
  MessageSquare,
  Headphones,
  FileQuestion,
  Activity,
  ShieldCheck,
  Mail,
  Sparkles,
} from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "Streaming & Playback",
    message: "",
    agreed: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert("Please accept the Terms of Service & Privacy Policy.");
      return;
    }
    setSubmitted(true);
  };

  const supportPillars = [
    {
      title: "24/7 Live Chat",
      desc: "Speak with a streaming specialist in less than 2 minutes.",
      icon: MessageSquare,
      status: "Online Now",
      statusColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
    },
    {
      title: "Technical Ticket Desk",
      desc: "Detailed troubleshooting for IPTV hardware and apps.",
      icon: Headphones,
      status: "Avg Reply 45m",
      statusColor: "text-blue-400 bg-blue-950/40 border-blue-800/40",
    },
    {
      title: "Knowledge Base",
      desc: "Setup guides for Smart TV, Apple TV, FireStick & PCs.",
      icon: FileQuestion,
      status: "60+ Guides",
      statusColor: "text-amber-400 bg-amber-950/40 border-amber-800/40",
    },
    {
      title: "System Status",
      desc: "BDIX CDN and Live transcoding cluster operational.",
      icon: Activity,
      status: "99.99% Uptime",
      statusColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header & Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600/10 text-red-500 border border-red-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SCREENBOXBD ASSISTANCE DESK</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          How Can We Help You Today?
        </h1>
        <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed">
          Have an inquiry regarding your subscription, stream buffering, device setup, or content requests? Our technical support team is standing by 24/7.
        </p>
      </div>

      {/* 2. 4 Quick Support Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {supportPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="streamit-card-glow p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#14161E] border border-white/[0.08] flex items-center justify-center text-[#E50000] shadow-md group-hover:bg-[#E50000] group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${pillar.statusColor}`}
                  >
                    {pillar.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#9EA3B0] mt-1.5 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Support Ticket Contact Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Information Card */}
        <div className="lg:col-span-5 streamit-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Get in Touch Directly
            </h2>
            <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed">
              Fill out the form and our technical team will review your account and logs, reaching back to you promptly with resolution instructions.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/20 text-[#E50000] flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Email Support</p>
                <p className="text-xs text-[#9EA3B0]">support@screenboxbd.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/20 text-[#E50000] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">VIP Priority Routing</p>
                <p className="text-xs text-[#9EA3B0]">Included on Standard and Premium plans</p>
              </div>
            </div>
          </div>

          {/* Guarantee pill */}
          <div className="p-4 rounded-2xl bg-[#0D0E14] border border-white/[0.06] flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 animate-ping" />
            <p className="text-xs text-[#9EA3B0]">
              All tickets submitted receive guaranteed response within 2 business hours.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Support Ticket Form */}
        <div className="lg:col-span-7 streamit-card p-6 sm:p-10">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/40">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-white">Support Ticket Created!</h2>
              <p className="text-xs sm:text-sm text-[#9EA3B0] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. We have logged ticket #{Math.floor(100000 + Math.random() * 900000)} under your email address and assigned it to an on-duty engineer.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-screenbox-red text-xs py-2.5 px-6 shadow-md"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Enter First Name"
                    className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Enter Last Name"
                    className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white">Category of Inquiry</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
                >
                  <option value="Streaming & Playback">Streaming & Playback Buffering</option>
                  <option value="Subscription & Billing">Subscription & Billing Questions</option>
                  <option value="Live IPTV Channel Request">Live IPTV Channel Request / Issue</option>
                  <option value="Smart TV Setup">Smart TV & App Setup Assistance</option>
                  <option value="Other">General Question</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Describe your issue or request in detail..."
                  className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 transition resize-none"
                />
              </div>

              {/* Agreed checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={formData.agreed}
                  onChange={(e) =>
                    setFormData({ ...formData, agreed: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-[#0D0E14] border-white/20 text-[#E50000] focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="agreed"
                  className="text-xs text-[#9EA3B0] cursor-pointer select-none"
                >
                  I agree with the{" "}
                  <span className="text-white underline">Terms of Use</span> and{" "}
                  <span className="text-white underline">Privacy Policy</span>.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="btn-screenbox-red w-full sm:w-auto px-8 py-3 text-xs sm:text-sm shadow-xl shadow-red-950/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 4. Frequently Asked Questions */}
      <FaqAccordion />
    </div>
  );
}
