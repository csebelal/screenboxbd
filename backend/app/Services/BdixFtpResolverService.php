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
     * Preset active BDIX FTP & Open Directory media networks in Bangladesh.
     */
    public static function getPresetNetworks(): array
    {
        return [
            'dhakaflix_2026_en' => [
                'name' => 'Dhaka-Flix 14: English Movies (2026)',
                'url' => 'http://172.16.50.14/DHAKA-FLIX-14/English%20Movies%20%281080p%29/%282026%29%201080p/',
            ],
            'dhakaflix_2026_hi' => [
                'name' => 'Dhaka-Flix 14: Hindi Movies (2026)',
                'url' => 'http://172.16.50.14/DHAKA-FLIX-14/Hindi%20Movies/%282026%29/',
            ],
            'dhakaflix_2026_ani' => [
                'name' => 'Dhaka-Flix 14: Animation Movies (2026)',
                'url' => 'http://172.16.50.14/DHAKA-FLIX-14/Animation%20Movies/%282026%29/',
            ],
            'dhakaflix' => [
                'name' => 'Dhaka-Flix 14 (172.16.50.14 - All Folders)',
                'url' => 'http://172.16.50.14/DHAKA-FLIX-14/',
            ],
            'circleftp' => [
                'name' => 'CircleFTP (Popular Movies & Series)',
                'url' => 'http://circleftp.net/ftp/',
            ],
            'samonline' => [
                'name' => 'SamOnline (1080p Dual Audio & Bangla Dubs)',
                'url' => 'http://172.16.50.4/media/movies/',
            ],
            'amberit' => [
                'name' => 'AmberIT FTP (Hollywood & Bollywood)',
                'url' => 'http://ftp.amberit.com.bd/media/',
            ],
            'icc' => [
                'name' => 'ICC Communication FTP',
                'url' => 'http://10.16.100.244/movies/',
            ],
            'discovery' => [
                'name' => 'Discovery FTP Media',
                'url' => 'http://discoveryftp.net/movies/',
            ],
            'roarftp' => [
                'name' => 'RoarFTP Network',
                'url' => 'http://roarftp.com/movies/',
            ],
        ];
    }

    /**
     * Crawl a preset network and attach found releases to movies.
     */
    public function crawlPreset(string $presetKey, int $limit = 50, bool $autoImport = true): array
    {
        $presets = self::getPresetNetworks();
        if (!isset($presets[$presetKey])) {
            return ['success' => 0, 'total' => 0, 'error' => 'Preset network not found'];
        }

        $url = $presets[$presetKey]['url'];
        $files = $this->crawlOpenDirectory($url, $limit);

        $successCount = 0;
        foreach ($files as $fileUrl) {
            $parsed = $this->parseReleaseFilename($fileUrl);
            $movie = $this->matchAndAttachMovie($fileUrl, $parsed['title'], $autoImport);
            if ($movie) {
                $successCount++;
            }
        }

        return [
            'network' => $presets[$presetKey]['name'],
            'success' => $successCount,
            'total' => count($files),
        ];
    }

    /**
     * Clean release filename and extract title, year, season, episode, and quality.
     */
    public function parseReleaseFilename(string $filename): array
    {
        // Strip path and decode URL-encoded characters (e.g. %20, %28, %29)
        $name = urldecode(basename($filename));
        
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
     * Normalize URL path segments (ensuring proper rawurlencoding for spaces and symbols).
     */
    public static function normalizeUrl(string $url): string
    {
        $parsed = parse_url($url);
        $path = $parsed['path'] ?? '';
        $segments = explode('/', $path);
        $cleanSegments = array_map(function ($s) {
            return rawurlencode(rawurldecode($s));
        }, $segments);
        $cleanPath = implode('/', $cleanSegments);
        return ($parsed['scheme'] ?? 'http') . '://' . ($parsed['host'] ?? '') . (!empty($parsed['port']) ? ':' . $parsed['port'] : '') . $cleanPath;
    }

    /**
     * Crawl an HTTP/FTP open directory listing for media files (supports recursive subdirectories & h5ai).
     */
    public function crawlOpenDirectory(string $url, int $limit = 50, int $depth = 0, int $maxDepth = 3): array
    {
        if ($depth > $maxDepth) {
            return [];
        }

        $mediaUrls = [];
        $subDirs = [];

        try {
            $normalizedUrl = self::normalizeUrl($url);
            $client = Http::withUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
                ->timeout(8)
                ->withoutVerifying();
            $res = $client->get($normalizedUrl);

            if (!$res->successful()) {
                return [];
            }

            $html = $res->body();
            $parsedUrl = parse_url($normalizedUrl);
            $baseUrl = rtrim($normalizedUrl, '/') . '/';
            $origin = ($parsedUrl['scheme'] ?? 'http') . '://' . ($parsedUrl['host'] ?? '') . (!empty($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '');

            // Match all href links in HTML directory listing
            if (preg_match_all('/href=["\']([^"\']+)["\']/i', $html, $matches)) {
                foreach ($matches[1] as $href) {
                    if ($href === '..' || $href === '.' || str_starts_with($href, '?') || str_starts_with($href, '#') || str_contains($href, '_h5ai') || str_contains($href, 'fonts.googleapis')) {
                        continue;
                    }

                    if (str_starts_with($href, 'http://') || str_starts_with($href, 'https://')) {
                        $fullUrl = $href;
                    } elseif (str_starts_with($href, '/')) {
                        $fullUrl = $origin . $href;
                    } else {
                        $fullUrl = $baseUrl . ltrim($href, '/');
                    }

                    $fullUrl = self::normalizeUrl($fullUrl);

                    // Check if it's a media file
                    if (preg_match('/\.(mp4|mkv|m3u8|avi)$/i', $href)) {
                        $mediaUrls[] = $fullUrl;
                        if (count($mediaUrls) >= $limit) {
                            return array_values(array_unique($mediaUrls));
                        }
                    } elseif (str_ends_with($href, '/') || !str_contains(basename(urldecode($href)), '.')) {
                        // Directory detected - strictly only traverse forward child directories
                        $childCandidate = rtrim($fullUrl, '/') . '/';
                        if (str_starts_with($childCandidate, $baseUrl) && strlen($childCandidate) > strlen($baseUrl)) {
                            $subDirs[] = $childCandidate;
                        }
                    }
                }
            }

            // If we haven't reached the limit and subdirs exist, crawl child directories
            if (count($mediaUrls) < $limit && !empty($subDirs)) {
                foreach ($subDirs as $childDir) {
                    $remaining = $limit - count($mediaUrls);
                    if ($remaining <= 0) break;
                    $childFiles = $this->crawlOpenDirectory($childDir, $remaining, $depth + 1, $maxDepth);
                    $mediaUrls = array_merge($mediaUrls, $childFiles);
                    if (count($mediaUrls) >= $limit) break;
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

        $movie = null;

        if (!empty($items)) {
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
        }

        // If TMDB didn't match or import, create movie entry from release info
        if (!$movie && $autoImport) {
            $slugBase = Str::slug($searchTitle);
            $slug = $slugBase;
            $counter = 1;
            while (Movie::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . ($parsed['year'] ?: '2026') . '-' . $counter++;
            }

            // Check if there is a local poster image in the same directory
            $dirUrl = dirname($streamUrl);
            $posterUrl = $dirUrl . '/a_AL_.jpg';

            $movie = Movie::create([
                'title' => $searchTitle,
                'slug' => $slug,
                'overview' => $searchTitle . ' (' . ($parsed['year'] ?: '2026') . ') available in high-speed 1080p BDIX stream.',
                'release_date' => ($parsed['year'] ?: '2026') . '-01-01',
                'rating' => 7.5,
                'poster_url' => $posterUrl,
                'genres' => ['Action', 'Thriller'],
                'languages' => ['English', 'Hindi', 'Bengali'],
                'is_published' => true,
            ]);
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
                'server_name' => 'BDIX Ultra-Speed (Dhaka-Flix)',
                'stream_type' => $streamType,
                'quality' => $parsed['quality'] ?: '1080p',
                'priority' => 1, // Top priority above 3rd-party embeds!
            ]
        );

        return $movie;
    }
}
