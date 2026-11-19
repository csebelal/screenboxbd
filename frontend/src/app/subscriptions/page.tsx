import { Metadata } from "next";
import SubscriptionsHeroBanner from "@/components/subscriptions/SubscriptionsHeroBanner";
import PricingSection from "@/components/home/PricingSection";
import PaymentPartnersBanner from "@/components/subscriptions/PaymentPartnersBanner";
import SavingsComparisonSection from "@/components/subscriptions/SavingsComparisonSection";
import PlanComparisonTable from "@/components/subscriptions/PlanComparisonTable";
import FaqAccordion from "@/components/home/FaqAccordion";

export const metadata: Metadata = {
  title: "সাবস্ক্রিপশন প্ল্যান ও প্রাইসিং - ScreenBoxBD",
  description:
    "ScreenBoxBD সাবস্ক্রিপশন প্ল্যানসমূহ: বেসিক HD (৳১৪৯), স্ট্যান্ডার্ড ১০৮০p (৳২৯৯) এবং প্রিমিয়াম ৪কে ভিআইপি (৳৪৯৯)। বিকাশ, নগদ বা কার্ডে পেমেন্ট, বাফারলেস BDIX স্ট্রিমিং ও ৭ দিনের গ্যারান্টি।",
};

export default function SubscriptionsPage() {
  return (
    <div className="py-4 space-y-8 sm:space-y-12 pb-20 w-full overflow-x-hidden">
      {/* 1. Subscriptions Hero Banner */}
      <SubscriptionsHeroBanner />

      {/* 2. Redesigned Pricing Section in BDT with 3 Billing Cycles & Checkout Modal */}
      <PricingSection />

      {/* 3. Supported Local Payment Partners (bKash, Nagad, Rocket, Cards) */}
      <PaymentPartnersBanner />

      {/* 4. Real Market Research Savings Comparison (Vs 4 separate OTT/Cable subs) */}
      <SavingsComparisonSection />

      {/* 5. Feature Comparison Matrix Table */}
      <PlanComparisonTable />

      {/* 6. Localized FAQs for Subscriptions */}
      <FaqAccordion />
    </div>
  );
}
