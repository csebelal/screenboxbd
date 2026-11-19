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
