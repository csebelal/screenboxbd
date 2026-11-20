import { Category, Channel, Movie, MovieStream, AdSlotsResponse } from "@/types";

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 10, name: "Bangla OTT", slug: "bangla-ott", type: "movie", sort_order: 0 },
  { id: 1, name: "Entertainment", slug: "entertainment", type: "tv", sort_order: 1 },
  { id: 2, name: "Movies", slug: "movies", type: "tv", sort_order: 2 },
  { id: 3, name: "Sports", slug: "sports", type: "tv", sort_order: 3 },
  { id: 4, name: "News", slug: "news", type: "tv", sort_order: 4 },
  { id: 5, name: "Documentary", slug: "documentary", type: "tv", sort_order: 5 },
  { id: 6, name: "Kids & Family", slug: "kids-family", type: "tv", sort_order: 6 },
];

export const FALLBACK_CHANNELS: Channel[] = [
  {
    id: 1,
    name: "Action HD",
    slug: "action-hd",
    logo_url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=300&q=80",
    country: "US",
    is_featured: true,
    category: { id: 2, name: "Movies", slug: "movies", type: "tv" },
    streams: [
      {
        id: 101,
        server_name: "Server 1: Direct BDIX HLS",
        stream_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        proxy_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        priority: 1,
        is_active: true,
      },
      {
        id: 102,
        server_name: "Server 2: Global Akamai Edge",
        stream_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        proxy_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        priority: 2,
        is_active: true,
      },
    ],
  },
  {
    id: 2,
    name: "Adventure TV",
    slug: "adventure-tv",
    logo_url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=300&q=80",
    country: "UK",
    is_featured: true,
    category: { id: 1, name: "Entertainment", slug: "entertainment", type: "tv" },
    streams: [
      {
        id: 201,
        server_name: "Server 1: Ultra HD HLS",
        stream_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        proxy_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        priority: 1,
        is_active: true,
      },
    ],
  },
  {
    id: 3,
    name: "Cinema HD",
    slug: "cinema-hd",
    logo_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80",
    country: "US",
    is_featured: true,
    category: { id: 2, name: "Movies", slug: "movies", type: "tv" },
    streams: [
      {
        id: 301,
        server_name: "Server 1: Cinema Premiere Stream",
        stream_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        proxy_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        priority: 1,
        is_active: true,
      },
    ],
  },
  {
    id: 4,
    name: "Drama TV",
    slug: "drama-tv",
    logo_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80",
    country: "IN",
    is_featured: false,
    category: { id: 1, name: "Entertainment", slug: "entertainment", type: "tv" },
    streams: [
      {
        id: 401,
        server_name: "Server 1: Primary Stream",
        stream_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        proxy_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        priority: 1,
        is_active: true,
      },
    ],
  },
  {
    id: 5,
    name: "Family TV",
    slug: "family-tv",
    logo_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80",
    country: "CA",
    is_featured: false,
    category: { id: 6, name: "Kids & Family", slug: "kids-family", type: "tv" },
    streams: [
      {
        id: 501,
        server_name: "Server 1: Fast HLS",
        stream_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        proxy_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        priority: 1,
        is_active: true,
      },
    ],
  },
  {
    id: 6,
    name: "Series HD",
    slug: "series-hd",
    logo_url: "https://images.unsplash.com/photo-1518676599649-7c77da3157a2?auto=format&fit=crop&w=300&q=80",
    country: "US",
    is_featured: true,
    category: { id: 1, name: "Entertainment", slug: "entertainment", type: "tv" },
    streams: [
      {
        id: 601,
        server_name: "Server 1: 1080p Stream",
        stream_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        proxy_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        priority: 1,
        is_active: true,
      },
    ],
  },
  {
    id: 7,
    name: "Sports Live HD",
    slug: "sports-live-hd",
    logo_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80",
    country: "UK",
    is_featured: true,
    category: { id: 3, name: "Sports", slug: "sports", type: "tv" },
    streams: [
      {
        id: 701,
        server_name: "Server 1: Low Latency 60fps",
        stream_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        proxy_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        priority: 1,
        is_active: true,
      },
    ],
  },
  {
    id: 8,
    name: "Discovery Nature",
    slug: "discovery-nature",
    logo_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80",
    country: "US",
    is_featured: false,
    category: { id: 5, name: "Documentary", slug: "documentary", type: "tv" },
    streams: [
      {
        id: 801,
        server_name: "Server 1: Wildlife 4K Stream",
        stream_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        proxy_url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        priority: 1,
        is_active: true,
      },
    ],
  },
];

function makeFallbackEmbedStreams(tmdbId: number): MovieStream[] {
  return [
    {
      id: tmdbId * 10 + 1,
      server_name: "Server 1: VidLink VIP (Ad-Free)",
      stream_type: "embed",
      stream_url: `https://vidlink.pro/movie/${tmdbId}`,
      quality: "1080p",
      priority: 1,
      is_embed: true,
    },
    {
      id: tmdbId * 10 + 2,
      server_name: "Server 2: Embed.su (Multi-Source)",
      stream_type: "embed",
      stream_url: `https://embed.su/embed/movie/${tmdbId}`,
      quality: "Auto",
      priority: 2,
      is_embed: true,
    },
    {
      id: tmdbId * 10 + 3,
      server_name: "Server 3: VidSrc v2 Clean",
      stream_type: "embed",
      stream_url: `https://vidsrc.cc/v2/embed/movie/${tmdbId}`,
      quality: "1080p",
      priority: 3,
      is_embed: true,
    },
  ];
}

export const FALLBACK_MOVIES: Movie[] = [];

export const FALLBACK_AD_SLOTS: AdSlotsResponse = {
  is_bot: false,
  slots: {},
};
