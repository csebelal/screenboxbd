<?php

namespace App\Console\Commands;

use App\Models\Movie;
use App\Models\MovieStream;
use App\Services\TmdbService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ImportTopImdbCommand extends Command
{
    protected $signature = 'imdb:import-top250 
                            {--limit=260 : Maximum movies to crawl and import}
                            {--force : Re-import even if already present}';

    protected $description = 'Crawl and import IMDb Top 250 movies from Dhaka-Flix BDIX server with Top IMDb category';

    public function handle(TmdbService $tmdb): int
    {
        $baseUrl = 'http://172.16.50.14/DHAKA-FLIX-14/IMDb%20Top-250%20Movies/';
        $limit = (int) $this->option('limit') ?: 260;
        $force = (bool) $this->option('force');

        $this->info("=================================================");
        $this->info("    Dhaka-Flix IMDb Top 250 Movies Importer");
        $this->info("=================================================");
        $this->line(" Source:  {$baseUrl}");
        $this->line(" Limit:   {$limit} movies");
        $this->newLine();

        $this->info("Fetching root directory listing from BDIX server...");
        $html = $this->fetchHtml($baseUrl);

        if (empty($html)) {
            $this->error("Failed to connect to BDIX server at {$baseUrl}");
            return self::FAILURE;
        }

        // Parse folder links
        preg_match_all('/<a\s+href="([^"]+)">([^<]+)<\/a>/i', $html, $matches, PREG_SET_ORDER);

        $folders = [];
        foreach ($matches as $m) {
            $href = $m[1];
            $text = trim($m[2]);

            if (empty($text) || in_array($text, ['parent directory', 'Name', 'Last modified', 'Size', 'Description', 'modern browsers', 'Parent Directory'])) {
                continue;
            }
            if (str_starts_with($href, '?') || str_starts_with($href, '#') || str_contains($href, '_h5ai')) {
                continue;
            }

            $fullFolderUrl = $this->joinUrl($baseUrl, $href);
            $folders[] = [
                'raw_name' => $text,
                'url' => $fullFolderUrl,
            ];

            if (count($folders) >= $limit) {
                break;
            }
        }

        $totalFolders = count($folders);
        $this->info("Found {$totalFolders} movie directories. Starting discovery & TMDB metadata import...");
        $this->newLine();

        $importedCount = 0;
        $updatedCount = 0;
        $skippedCount = 0;

        $bar = $this->output->createProgressBar($totalFolders);
        $bar->start();

        foreach ($folders as $folder) {
            $rawName = $folder['raw_name'];
            $folderUrl = $folder['url'];

            // 1. Parse rank, title, and year
            $parsed = $this->parseFolderName($rawName);
            $cleanTitle = $parsed['title'];
            $year = $parsed['year'];

            // 2. Fetch child files (find video stream and optional poster)
            $folderHtml = $this->fetchHtml($folderUrl);
            if (empty($folderHtml)) {
                $skippedCount++;
                $bar->advance();
                continue;
            }

            preg_match_all('/<a\s+href="([^"]+)">([^<]+)<\/a>/i', $folderHtml, $childMatches, PREG_SET_ORDER);

            $videoUrl = null;
            $posterUrl = null;

            foreach ($childMatches as $cm) {
                $cHref = $cm[1];
                if (preg_match('/\.(mkv|mp4|avi|webm)$/i', $cHref)) {
                    $videoUrl = $this->joinUrl($folderUrl, $cHref);
                } elseif (preg_match('/\.(jpg|jpeg|png|webp)$/i', $cHref)) {
                    $posterUrl = $this->joinUrl($folderUrl, $cHref);
                }
            }

            if (!$videoUrl) {
                // Folder without playable video file (e.g. Coming Soon placeholder)
                $skippedCount++;
                $bar->advance();
                continue;
            }

            // 3. Match with TMDB
            $movie = null;
            try {
                $searchResults = $tmdb->searchMovies($cleanTitle);
                $results = $searchResults['results'] ?? [];

                if (!empty($results)) {
                    $bestMatch = $results[0];
                    if ($year) {
                        foreach ($results as $item) {
                            $itemYear = !empty($item['release_date']) ? (int) substr($item['release_date'], 0, 4) : 0;
                            if ($itemYear === $year) {
                                $bestMatch = $item;
                                break;
                            }
                        }
                    }

                    $tmdbId = $bestMatch['id'];
                    $movie = Movie::where('tmdb_id', $tmdbId)->first();
                    if (!$movie) {
                        $movie = $tmdb->importMovieById($tmdbId);
                        $importedCount++;
                    } else {
                        $updatedCount++;
                    }
                }
            } catch (\Throwable $e) {
                // TMDB query failed or exceeded rate limit, continue to fallback
            }

            // Fallback create if TMDB match didn't find anything
            if (!$movie) {
                $slug = Str::slug($cleanTitle . '-' . ($year ?: 'classic'));
                $existing = Movie::where('slug', $slug)->first();
                if ($existing) {
                    $movie = $existing;
                    $updatedCount++;
                } else {
                    $movie = Movie::create([
                        'title' => $cleanTitle,
                        'slug' => $slug,
                        'overview' => "{$cleanTitle} (" . ($year ?: 'Top Rated') . ") - Part of the IMDb Top 250 all-time best movies collection, available in 1080p BDIX high speed.",
                        'release_date' => ($year ?: 2000) . '-01-01',
                        'rating' => 8.8,
                        'poster_url' => $posterUrl,
                        'genres' => ['Top IMDb', 'Drama'],
                        'is_published' => true,
                        'is_featured' => true,
                    ]);
                    $importedCount++;
                }
            }

            // 4. Ensure 'Top IMDb' is tagged in genres array
            $genres = is_array($movie->genres) ? $movie->genres : [];
            if (!in_array('Top IMDb', $genres)) {
                $genres[] = 'Top IMDb';
                $movie->genres = array_values(array_unique($genres));
                $movie->save();
            }

            // 5. Attach BDIX Stream
            MovieStream::updateOrCreate(
                [
                    'movie_id' => $movie->id,
                    'server_name' => 'Dhaka-Flix BDIX 14',
                ],
                [
                    'stream_type' => 'mp4',
                    'stream_url' => $videoUrl,
                    'quality' => '1080p',
                    'priority' => 1,
                ]
            );

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("=================================================");
        $this->info("  IMDb Top 250 Import Completed Successfully!");
        $this->info("=================================================");
        $this->line(" • Newly Imported:  {$importedCount} movies");
        $this->line(" • Updated / Linked: {$updatedCount} movies");
        $this->line(" • Skipped:          {$skippedCount} (No video files)");
        $this->line(" • Total Movies in DB: " . Movie::count());
        $this->line(" • Movies with 'Top IMDb' category: " . Movie::whereJsonContains('genres', 'Top IMDb')->count());

        return self::SUCCESS;
    }

    private function fetchHtml(string $url): string
    {
        try {
            $res = Http::withUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) ScreenBoxBD-Crawler/1.0')
                ->timeout(12)
                ->withoutVerifying()
                ->get($url);

            return $res->successful() ? $res->body() : '';
        } catch (\Throwable $e) {
            return '';
        }
    }

    private function parseFolderName(string $rawName): array
    {
        // Strip leading rank (e.g. "001. ", "012. ")
        $clean = preg_replace('/^\d+[\.\s\-]+/', '', $rawName);

        // Extract (YYYY)
        $year = null;
        if (preg_match('/\((\d{4})\)/', $clean, $m)) {
            $year = (int) $m[1];
        }

        // Clean title
        $title = $clean;
        if ($year) {
            $parts = explode("({$year})", $title);
            $title = $parts[0];
        }

        $title = preg_replace('/\b(1080p|720p|4k|bluray|web-dl|webrip|dual audio|hindi|bangla|english|rem|coming soon)\b/i', '', $title);
        $title = trim(preg_replace('/[\[\]\(\)\{\}\-_]/', ' ', $title));
        $title = preg_replace('/\s+/', ' ', $title);

        return [
            'title' => trim($title) ?: $rawName,
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
