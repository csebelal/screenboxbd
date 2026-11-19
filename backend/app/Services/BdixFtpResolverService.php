<?php

namespace App\Services;

use App\Models\Movie;
use App\Models\MovieStream;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BdixFtpResolverService
{
    public function __construct(
        protected TmdbService $tmdb
    ) {}

    /**
     * Clean release filename and extract title, year, season, episode, and quality.
     */
    public function parseReleaseFilename(string $filename): array
    {
        // Strip path if provided
        $name = basename($filename);
        
        // Remove common file extension
        $nameWithoutExt = preg_replace('/\.(mp4|mkv|avi|m3u8|webm|mov|flv)$/i', '', $name);

        // Normalize dots, underscores, dashes to spaces
        $clean = preg_replace('/[._+]/', ' ', $nameWithoutExt);

        $year = null;
        if (preg_match('/\b(19\d{2}|20\d{2})\b/', $clean, $m)) {
            $year = (int) $m[1];
        }

        $season = null;
        $episode = null;
        if (preg_match('/[Ss](\d{1,2})[Ee](\d{1,2})/', $clean, $m)) {
            $season = (int) $m[1];
            $episode = (int) $m[2];
        }

        $quality = '1080p';
        if (preg_match('/\b(2160p|4k|1080p|720p|480p|360p)\b/i', $clean, $m)) {
            $quality = strtolower($m[1]) === '4k' ? '2160p' : strtolower($m[1]);
        }

        // Strip scene tags, codecs, rips
        $junkPattern = '/\b(2160p|4k|1080p|720p|480p|360p|bluray|web-dl|webrip|hdrip|dvdrip|hdtc|cam|x264|x265|hevc|aac|dts|ddp|ac3|atmos|proper|repack|dual audio|hindi|bangla|english|sub|esub)\b/i';
        $titleOnly = preg_replace($junkPattern, '', $clean);

        // If year was found, cut off everything at and after year
        if ($year) {
            $parts = explode((string) $year, $titleOnly);
            $titleOnly = $parts[0];
        }

        // Clean extra brackets and symbols
        $titleOnly = trim(preg_replace('/[\[\]\(\)\{\}\-_]/', ' ', $titleOnly));
        $titleOnly = preg_replace('/\s+/', ' ', $titleOnly);

        return [
            'original_filename' => $name,
            'title' => trim($titleOnly) ?: $nameWithoutExt,
            'year' => $year,
            'season' => $season,
            'episode' => $episode,
            'quality' => $quality,
        ];
    }

    /**
     * Crawl an HTTP/FTP open directory listing for media files.
     */
    public function crawlOpenDirectory(string $url, int $limit = 50): array
    {
        $mediaUrls = [];

        try {
            $client = Http::timeout(10)->withoutVerifying();
            $res = $client->get($url);

            if (!$res->successful()) {
                Log::warning("BDIX Crawl failed with HTTP {$res->status()} for URL: {$url}");
                return [];
            }

            $html = $res->body();

            // Match all href links in HTML directory listing
            if (preg_match_all('/href=["\']([^"\']+\.(mp4|mkv|m3u8|avi))["\']/i', $html, $matches)) {
                $baseUrl = rtrim($url, '/') . '/';
                foreach ($matches[1] as $href) {
                    if (str_starts_with($href, 'http://') || str_starts_with($href, 'https://')) {
                        $fullUrl = $href;
                    } elseif (str_starts_with($href, '/')) {
                        $parsedUrl = parse_url($url);
                        $host = ($parsedUrl['scheme'] ?? 'http') . '://' . ($parsedUrl['host'] ?? '');
                        if (!empty($parsedUrl['port'])) $host .= ':' . $parsedUrl['port'];
                        $fullUrl = $host . $href;
                    } else {
                        $fullUrl = $baseUrl . ltrim($href, '/');
                    }

                    $mediaUrls[] = $fullUrl;
                    if (count($mediaUrls) >= $limit) {
                        break;
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::error("BDIX Crawl Exception: " . $e->getMessage(), ['url' => $url]);
        }

        return array_values(array_unique($mediaUrls));
    }

    /**
     * Parse filename from stream URL, match with TMDB, and attach BDIX server stream to Movie.
     */
    public function matchAndAttachMovie(string $streamUrl, ?string $customTitle = null, bool $autoImport = true): ?Movie
    {
        $parsed = $this->parseReleaseFilename($customTitle ?: $streamUrl);
        $searchTitle = $parsed['title'];

        if (empty($searchTitle)) {
            return null;
        }

        $results = $this->tmdb->searchMovies($searchTitle);
        $items = $results['results'] ?? [];

        if (empty($items)) {
            return null;
        }

        // Find best match matching year if present
        $bestMatch = $items[0];
        if ($parsed['year']) {
            foreach ($items as $item) {
                $releaseYear = !empty($item['release_date']) ? (int) substr($item['release_date'], 0, 4) : 0;
                if ($releaseYear === $parsed['year']) {
                    $bestMatch = $item;
                    break;
                }
            }
        }

        $tmdbId = $bestMatch['id'];

        $movie = Movie::where('tmdb_id', $tmdbId)->first();
        if (!$movie && $autoImport) {
            $movie = $this->tmdb->importMovieById($tmdbId);
        }

        if (!$movie) {
            return null;
        }

        // Attach or update high-priority BDIX stream
        $streamType = str_ends_with(strtolower($streamUrl), '.m3u8') ? 'hls' : 'mp4';

        MovieStream::updateOrCreate(
            [
                'movie_id' => $movie->id,
                'stream_url' => $streamUrl,
            ],
            [
                'server_name' => 'BDIX Ultra-Speed (Local ISP)',
                'stream_type' => $streamType,
                'quality' => $parsed['quality'] ?: '1080p',
                'priority' => 1, // Top priority above 3rd-party embeds!
            ]
        );

        return $movie;
    }
}
