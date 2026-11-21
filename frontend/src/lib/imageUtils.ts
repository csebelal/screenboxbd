/**
 * Detects whether a URL points to private/internal network address spaces (RFC 1918, loopback, etc.)
 * Google Chrome blocks or displays "Access other devices on your local network" permission prompts
 * whenever a public origin (such as https://screenboxbd.online) attempts to load assets from these addresses.
 */
export function isPrivateNetworkUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("172.16.") ||
    lower.includes("172.17.") ||
    lower.includes("172.18.") ||
    lower.includes("172.19.") ||
    lower.includes("172.20.") ||
    lower.includes("172.21.") ||
    lower.includes("172.22.") ||
    lower.includes("172.23.") ||
    lower.includes("172.24.") ||
    lower.includes("172.25.") ||
    lower.includes("172.26.") ||
    lower.includes("172.27.") ||
    lower.includes("172.28.") ||
    lower.includes("172.29.") ||
    lower.includes("172.30.") ||
    lower.includes("172.31.") ||
    lower.includes("192.168.") ||
    lower.includes("10.") ||
    lower.includes("127.0.0.1") ||
    lower.includes("localhost")
  );
}

/**
 * Sanitizes movie poster and backdrop URLs. Returns null if missing or pointing to a private network IP.
 */
export function sanitizePosterUrl(url: string | null | undefined): string | null {
  if (!url || isPrivateNetworkUrl(url)) return null;
  return url;
}

/**
 * High-performance TMDB Image Size Optimizer
 * Replaces heavy 'original' and 'w500' images with right-sized web assets
 * to prevent browser bandwidth choke and achieve instant render times.
 */
export function optimizeTmdbImage(
  url: string | null | undefined,
  type: "poster" | "backdrop" | "thumbnail" = "poster"
): string {
  if (!url) return "";
  if (isPrivateNetworkUrl(url)) return "";
  if (!url.includes("image.tmdb.org/t/p/")) return url;

  if (type === "thumbnail") {
    return url.replace(/\/t\/p\/(original|w500|w780|w1280)/, "/t/p/w185");
  }
  if (type === "poster") {
    return url.replace(/\/t\/p\/(original|w500|w780|w1280)/, "/t/p/w342");
  }
  if (type === "backdrop") {
    return url.replace(/\/t\/p\/(original|w780)/, "/t/p/w1280");
  }
  return url;
}
