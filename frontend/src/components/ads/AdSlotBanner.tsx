import { AdSlot } from "@/types";

interface AdSlotBannerProps {
  slot?: AdSlot | null;
  className?: string;
}

export default function AdSlotBanner({}: AdSlotBannerProps) {
  // All ads and sponsor banners permanently disabled
  return null;
}
