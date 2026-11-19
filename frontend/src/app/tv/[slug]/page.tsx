import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChannelBySlug, getChannels } from "@/lib/api";
import LiveTvTheater from "@/components/tv/LiveTvTheater";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const channel = await getChannelBySlug(slug);

  if (!channel) {
    return {
      title: "Channel Not Found - ScreenBoxBD",
    };
  }

  return {
    title: `Watch ${channel.name} Live - ScreenBoxBD`,
    description: `Stream ${channel.name} live in high definition on ScreenBoxBD. Fast BDIX and adaptive HLS playback.`,
  };
}

export default async function ChannelWatchPage({ params }: PageProps) {
  const { slug } = await params;

  const [channel, channelsRes] = await Promise.all([
    getChannelBySlug(slug),
    getChannels({ per_page: 300 }),
  ]);

  if (!channel) {
    notFound();
  }

  const allChannels = channelsRes?.data || [];

  return <LiveTvTheater initialChannel={channel} allChannels={allChannels} />;
}
