import { getChannels } from "@/lib/api";
import LiveTvTheater from "@/components/tv/LiveTvTheater";
import { notFound } from "next/navigation";

export const revalidate = 30;

export default async function LiveTvPage() {
  const channelsRes = await getChannels({ per_page: 300 });
  const channels = channelsRes?.data || [];

  if (channels.length === 0) {
    return notFound();
  }

  // T Sports HD has top priority as initial channel, then first featured, then first channel
  const initialChannel =
    channels.find((c) => c.name.toLowerCase().includes("t sports")) ||
    channels.find((c) => c.is_featured) ||
    channels[0];

  return <LiveTvTheater initialChannel={initialChannel} allChannels={channels} />;
}
