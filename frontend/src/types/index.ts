export interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
  sort_order?: number;
}

export interface ChannelStream {
  id: number;
  server_name: string;
  stream_url: string;
  proxy_url: string;
  priority: number;
  is_active: boolean;
}

export interface Channel {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string;
  is_featured: boolean;
  category?: Category | null;
  streams?: ChannelStream[];
  created_at?: string;
}

export interface CastMember {
  name: string;
  character?: string;
  profile_url?: string | null;
}

export interface DownloadSource {
  type: "torrent" | "direct" | "telegram" | string;
  label: string;
  quality?: string;
  size?: string;
  download_url?: string;
  torrent_url?: string;
  magnet_url?: string;
  seeds?: number;
  peers?: number;
}

export interface MovieStream {
  id: number;
  server_name: string;
  stream_type: "hls" | "embed" | "mp4" | "drive" | "youtube" | string;
  stream_url: string;
  proxy_url?: string | null;
  quality?: string;
  priority?: number;
  is_embed?: boolean;
}

export interface Movie {
  id: number;
  tmdb_id: number;
  imdb_id?: string | null;
  title: string;
  slug: string;
  ott_platform?: "chorki" | "hoichoi" | "toffee" | "bongo" | "bioscope" | "binge" | string | null;
  overview: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url?: string | null;
  release_date: string | null;
  release_year: string | null;
  duration_minutes: number | null;
  rating: number;
  genres: string[];
  cast?: CastMember[];
  director?: string | null;
  director_avatar?: string | null;
  languages?: string[];
  is_featured: boolean;
  is_hero_slider?: boolean;
  hero_order?: number;
  views: number;
  streams?: MovieStream[];
  download_sources?: DownloadSource[];
  download_gateway_url?: string;
  created_at?: string;
  related?: Movie[];
}

export interface AdSlot {
  id: number;
  title: string;
  slot_key: string;
  ad_type: "banner_image" | "html_code" | "google_adsense";
  code_content?: string | null;
  banner_image_url?: string | null;
  target_url?: string | null;
  countdown_seconds?: number;
}

export interface AdSlotsResponse {
  is_bot: boolean;
  slots: Record<string, AdSlot>;
}

export interface EpisodeStream {
  id: number;
  server_name: string;
  stream_type: string;
  stream_url: string;
  proxy_url?: string | null;
  quality?: string;
  priority?: number;
  is_embed?: boolean;
}

export interface Episode {
  id: number;
  season_id?: number;
  season_number?: number;
  episode_number: number;
  title?: string;
  name?: string;
  overview?: string | null;
  still_url?: string | null;
  duration_minutes?: number | null;
  streams?: EpisodeStream[];
  download_sources?: DownloadSource[];
}

export interface Season {
  id: number;
  season_number: number;
  title?: string;
  name?: string;
  poster_url?: string | null;
  episodes_count?: number;
  episodes?: Episode[];
}

export interface Series {
  id: number;
  tmdb_id: number;
  imdb_id?: string | null;
  title: string;
  slug: string;
  ott_platform?: "chorki" | "hoichoi" | "toffee" | "bongo" | "bioscope" | "binge" | string | null;
  overview: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url?: string | null;
  first_air_date: string | null;
  release_year?: string | null;
  rating: number;
  genres: string[];
  cast?: CastMember[];
  director?: string | null;
  director_avatar?: string | null;
  languages?: string[];
  is_featured?: boolean;
  views?: number;
  seasons_count?: number;
  seasons?: Season[];
  download_sources?: DownloadSource[];
}

export interface PaginatedMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: PaginatedMeta;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  featured?: boolean;
  views?: number;
  likes?: number;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  count: number;
}


export interface PlatformSettings {
  site_name?: string;
  site_tagline?: string;
  site_logo?: string;
  announcement_active?: boolean;
  announcement_text?: string;
  announcement_color?: string;
  announcement_link?: string;
  support_email?: string;
  support_phone?: string;
  support_telegram?: string;
  support_whatsapp?: string;
  support_facebook?: string;
  player_autoplay?: boolean;
  player_default_quality?: string;
  meta_title?: string;
  meta_description?: string;
  enable_subscriptions?: boolean;
  google_analytics_enabled?: boolean;
  google_tag_manager_id?: string;
  google_analytics_id?: string;
  custom_header_scripts?: string;
  custom_footer_scripts?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface SubscriptionPlanItem {
  id: number;
  name: string;
  slug: string;
  badge?: string;
  monthly_price: number;
  half_yearly_price: number;
  yearly_price: number;
  currency: string;
  features: string[];
  highlight: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface FaqEntry {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  sort_order: number;
}
