<?php

namespace App\Console\Commands;

use App\Models\Movie;
use App\Models\MovieStream;
use App\Services\TmdbService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class BulkImportBdixMoviesCommand extends Command
{
    protected $signature = 'bdix:import-catalog 
                            {target : Target collection: kolkata, hindi, south, south_dubbed, all}
                            {--limit-per-year=50 : Maximum movies per year folder}
                            {--force : Force update existing}';

    protected $description = 'Crawl and bulk-import movies from BDIX servers (Kolkata Bangla, Hindi, South Movies, South Hindi Dubbed)';

    public function handle(TmdbService $tmdb): int
    {
        $target = strtolower($this->argument('target'));
        $limitPerYear = (int) $this->option('limit-per-year') ?: 50;

        $configs = [
            'kolkata' => [
                'name' => 'Kolkata Bangla Movies (2010 - 2024)',
                'base_url' => 'http://172.16.50.7/DHAKA-FLIX-7/Kolkata%20Bangla%20Movies/',
                'start_year' => 2010,
                'end_year' => 2024,
                'genres' => ['Bangla Cinema', 'Kolkata Bangla'],
                'server_name' => 'Dhaka-Flix BDIX 7',
                'prefer_desc' => false,
            ],
            'hindi' => [
                'name' => 'Bollywood Hindi Movies (2020 - 2026)',
                'base_url' => 'http://172.16.50.14/DHAKA-FLIX-14/Hindi%20Movies/',
                'start_year' => 2020,
                'end_year' => 2026,
                'genres' => ['Bollywood', 'Hindi Movies'],
                'server_name' => 'Dhaka-Flix BDIX 14',
                'prefer_desc' => true,
            ],
            'south' => [
                'name' => 'South Indian Movies (Latest & Trending)',
                'base_url' => 'http://172.16.50.14/DHAKA-FLIX-14/SOUTH%20INDIAN%20MOVIES/South%20Movies/',
                'start_year' => 2000,
                'end_year' => 2026,
                'genres' => ['South Indian'],
                'server_name' => 'Dhaka-Flix BDIX 14',
                'prefer_desc' => true,
            ],
            'south_dubbed' => [
                'name' => 'South Indian (Hindi Dubbed) (Latest & Trending)',
                'base_url' => 'http://172.16.50.14/DHAKA-FLIX-14/SOUTH%20INDIAN%20MOVIES/Hindi%20Dubbed/',
                'start_year' => 2000,
                'end_year' => 2026,
                'genres' => ['South Indian (Hindi Dubbed)', 'Dual Audio'],
                'server_name' => 'Dhaka-Flix BDIX 14',
                'prefer_desc' => true,
            ],
        ];

        $selected = [];
        if ($target === 'all') {
            $selected = $configs;
        } elseif (isset($configs[$target])) {
            $selected[$target] = $configs[$target];
        } else {
            $this->error("Invalid target '{$target}'. Valid targets: kolkata, hindi, south, south_dubbed, all");
            return self::FAILURE;
        }

        foreach ($selected as $key => $cfg) {
            $this->importCollection($tmdb, $cfg, $limitPerYear);
        }

        $this->info("\n=================================================");
        $this->info("   All Selected BDIX Imports Completed!");
        $this->info("   Total Movies in DB: " . Movie::count());
        $this->info("=================================================");

        return self::SUCCESS;
    }

    private function importCollection(TmdbService $tmdb, array $cfg, int $limitPerYear): void
    {
        $this->newLine();
        $this->info("=================================================");
        $this->info("   Importing: " . $cfg['name']);
        $this->info("=================================================");
        $this->line(" Base URL: " . $cfg['base_url']);

        $rootHtml = $this->fetchHtml($cfg['base_url']);
        if (empty($rootHtml)) {
            $this->error("Could not reach " . $cfg['base_url']);
            return;
        }

        preg_match_all('/<a\s+href="([^"]+)">([^<]+)<\/a>/i', $rootHtml, $matches, PREG_SET_ORDER);

        $yearDirs = [];
        foreach ($matches as $m) {
            $href = $m[1];
            $text = trim($m[2]);

            if (empty($text) || in_array($text, ['parent directory', 'Name', 'Last modified', 'Size', 'Description', 'modern browsers', 'Parent Directory'])) {
                continue;
            }
            if (str_starts_with($href, '?') || str_starts_with($href, '#') || str_contains($href, '_h5ai')) {
                continue;
            }

            if (preg_match('/\(?(\d{4})\)?/', $text, $ym)) {
                $y = (int) $ym[1];
                if ($y >= $cfg['start_year'] && $y <= $cfg['end_year']) {
                    $yearDirs[] = [
                        'year' => $y,
                        'name' => $text,
                        'url' => $this->joinUrl($cfg['base_url'], $href),
                    ];
                }
            }
        }

        // Sort years descending (newest first for latest & trending)
        usort($yearDirs, fn($a, $b) => $cfg['prefer_desc'] ? ($b['year'] <=> $a['year']) : ($a['year'] <=> $b['year']));

        $this->info("Found " . count($yearDirs) . " year folders between {$cfg['start_year']} and {$cfg['end_year']}.");

        $totalImported = 0;
        $totalLinked = 0;

        foreach ($yearDirs as $yd) {
            $year = $yd['year'];
            $yUrl = $yd['url'];

            $yHtml = $this->fetchHtml($yUrl);
            if (empty($yHtml)) continue;

            preg_match_all('/<a\s+href="([^"]+)">([^<]+)<\/a>/i', $yHtml, $mLinks, PREG_SET_ORDER);

            $movieDirs = [];
            foreach ($mLinks as $ml) {
                $mHref = $ml[1];
                $mText = trim($ml[2]);
                if (empty($mText) || in_array($mText, ['parent directory', 'Name', 'Last modified', 'Size', 'Description', 'modern browsers', 'Parent Directory'])) {
                    continue;
                }
                if (str_starts_with($mHref, '?') || str_starts_with($mHref, '#') || str_contains($mHref, '_h5ai')) {
                    continue;
                }
                $movieDirs[] = [
                    'name' => $mText,
                    'url' => $this->joinUrl($yUrl, $mHref),
                ];
            }

            // Newest releases in that year
            $slice = array_slice($movieDirs, 0, $limitPerYear);
            $this->line(" → [{$year}] Processing " . count($slice) . " movies (total in folder: " . count($movieDirs) . ")...");

            foreach ($slice as $md) {
                $mName = $md['name'];
                $mUrl = $md['url'];

                $parsed = $this->parseReleaseName($mName, $year);
                $cleanTitle = $parsed['title'];

                // Check child files for playable video
                $mHtml = $this->fetchHtml($mUrl);
                if (empty($mHtml)) continue;

                preg_match_all('/<a\s+href="([^"]+)">([^<]+)<\/a>/i', $mHtml, $cMatches, PREG_SET_ORDER);

                $videoUrl = null;
                $posterUrl = null;
                foreach ($cMatches as $cm) {
                    $cHref = $cm[1];
                    if (preg_match('/\.(mkv|mp4|avi|webm)$/i', $cHref)) {
                        $videoUrl = $this->joinUrl($mUrl, $cHref);
                    } elseif (preg_match('/\.(jpg|jpeg|png|webp)$/i', $cHref)) {
                        $posterUrl = $this->joinUrl($mUrl, $cHref);
                    }
                }

                if (!$videoUrl) continue;

                // Match with TMDB
                $movie = null;
                try {
                    $searchRes = $tmdb->searchMovies($cleanTitle);
                    $results = $searchRes['results'] ?? [];
                    if (!empty($results)) {
                        $best = $results[0];
                        foreach ($results as $item) {
                            $itemYear = !empty($item['release_date']) ? (int) substr($item['release_date'], 0, 4) : 0;
                            if ($itemYear === $year) {
                                $best = $item;
                                break;
                            }
                        }
                        $tmdbId = $best['id'];
                        $movie = Movie::where('tmdb_id', $tmdbId)->first();
                        if (!$movie) {
                            $movie = $tmdb->importMovieById($tmdbId);
                            $totalImported++;
                        } else {
                            $totalLinked++;
                        }
                    }
                } catch (\Throwable $e) {}

                // Fallback creation if TMDB search returns nothing
                if (!$movie) {
                    $slug = Str::slug($cleanTitle . '-' . $year);
                    $existing = Movie::where('slug', $slug)->first();
                    if ($existing) {
                        $movie = $existing;
                        $totalLinked++;
                    } else {
                        $movie = Movie::create([
                            'title' => $cleanTitle,
                            'slug' => $slug,
                            'overview' => "{$cleanTitle} ({$year}) - {$cfg['name']} in full 1080p BDIX high-speed stream.",
                            'release_date' => "{$year}-01-01",
                            'rating' => 7.5,
                            'poster_url' => (!empty($posterUrl) && !str_contains($posterUrl, '172.16.') && !str_contains($posterUrl, '192.168.')) ? $posterUrl : null,
                            'genres' => $cfg['genres'],
                            'is_published' => true,
                            'is_featured' => true,
                        ]);
                        $totalImported++;
                    }
                }

                // Add collection genres
                $currentGenres = is_array($movie->genres) ? $movie->genres : [];
                $updatedGenres = array_values(array_unique(array_merge($currentGenres, $cfg['genres'])));
                $movie->genres = $updatedGenres;
                $movie->save();

                // Attach BDIX Stream
                MovieStream::updateOrCreate(
                    [
                        'movie_id' => $movie->id,
                        'server_name' => $cfg['server_name'],
                    ],
                    [
                        'stream_type' => 'mp4',
                        'stream_url' => $videoUrl,
                        'quality' => '1080p',
                        'priority' => 1,
                    ]
                );
            }
        }

        $this->info("✓ Finished {$cfg['name']}: {$totalImported} newly imported, {$totalLinked} linked.");
    }

    private function fetchHtml(string $url): string
    {
        try {
            $res = Http::withUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) ScreenBoxBD-CatalogCrawler/1.0')
                ->timeout(12)
                ->withoutVerifying()
                ->get($url);

            return $res->successful() ? $res->body() : '';
        } catch (\Throwable $e) {
            return '';
        }
    }

    private function parseReleaseName(string $raw, int $defaultYear): array
    {
        $clean = preg_replace('/^\d+[\.\s\-]+/', '', $raw);
        $year = $defaultYear;
        if (preg_match('/\((\d{4})\)/', $clean, $m)) {
            $year = (int) $m[1];
            $parts = explode("({$year})", $clean);
            $clean = $parts[0];
        }

        $clean = preg_replace('/\b(2160p|4k|1080p|720p|480p|bluray|web-dl|webrip|hdrip|dvdrip|hdtv|cam|hdcam|x264|x265|hevc|aac|dts|ddp|ac3|esub|sub|dual audio|hindi|bangla|english|rem)\b/i', '', $clean);
        $clean = trim(preg_replace('/[\[\]\(\)\{\}\-_]/', ' ', $clean));
        $clean = preg_replace('/\s+/', ' ', $clean);

        return [
            'title' => trim($clean) ?: $raw,
            'year' => $year,
        ];
    }

    private function joinUrl(string $base, string $relative): string
    {
        if (str_starts_with($relative, 'http://') || str_starts_with($relative, 'https://')) {
            return $relative;
        }

        $parsed = parse_url($base);
        $origin = ($parsed['scheme'] ?? 'http') . '://' . ($parsed['host'] ?? '') . (!empty($parsed['port']) ? ':' . $parsed['port'] : '');

        if (str_starts_with($relative, '/')) {
            return $origin . $relative;
        }

        $base = rtrim($base, '/') . '/';
        return $base . ltrim($relative, '/');
    }
}
