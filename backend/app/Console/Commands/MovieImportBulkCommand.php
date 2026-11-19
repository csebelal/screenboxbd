<?php

namespace App\Console\Commands;

use App\Models\Movie;
use App\Models\MovieStream;
use App\Services\TmdbService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MovieImportBulkCommand extends Command
{
    protected $signature = 'movie:import-bulk 
                            {--limit=300 : Total number of movies to reach in database} 
                            {--source= : Path to M3U file with movies}';

    protected $description = 'Import 300+ movies with TMDB metadata, posters, backdrops, and video streams';

    public function handle(TmdbService $tmdb): int
    {
        $limit = (int) $this->option('limit') ?: 300;
        $sourcePath = $this->option('source') ?: base_path('../m3u file/1 (4).m3u');

        $this->info("=================================================");
        $this->info("     StreamTV 300 Movies Importer");
        $this->info("=================================================");
        $this->line(" Target Limit:  {$limit} movies");
        $this->line(" Source File:   {$sourcePath}");
        $this->newLine();

        $initialCount = Movie::count();
        $this->info("Current movies in database: {$initialCount}");

        if ($initialCount >= $limit) {
            $this->info("Database already contains {$initialCount} movies (>= target {$limit}).");
            return self::SUCCESS;
        }

        // Cache candidate direct streams from M3U playlist by clean title keywords
        $streamPool = $this->extractM3uStreamPool($sourcePath, 500);
        $this->info("Cached " . count($streamPool) . " direct video streams from M3U playlist.");

        $needed = $limit - $initialCount;
        $this->info("Importing {$needed} additional movies to reach target of {$limit}...");

        $bar = $this->output->createProgressBar($needed);
        $bar->start();

        $imported = 0;
        $page = 1;

        // Fetch batch pages from TMDB (Popular, Top Rated, and Trending)
        $endpoints = ['popular', 'top_rated', 'trending'];

        foreach ($endpoints as $endpoint) {
            for ($page = 1; $page <= 12; $page++) {
                if (Movie::count() >= $limit) {
                    break 2;
                }

                $res = [];
                if ($endpoint === 'popular') {
                    $res = $tmdb->getPopularMovies($page);
                } elseif ($endpoint === 'top_rated') {
                    $res = $tmdb->getTopRatedMovies($page);
                } else {
                    $res = $tmdb->getTrendingMovies('week', $page);
                }

                $items = $res['results'] ?? [];
                if (empty($items)) {
                    continue;
                }

                foreach ($items as $raw) {
                    if (Movie::count() >= $limit) {
                        break 2;
                    }

                    $tmdbId = (int) ($raw['id'] ?? 0);
                    if ($tmdbId <= 0) continue;

                    // Skip if already in DB
                    if (Movie::where('tmdb_id', $tmdbId)->exists()) {
                        continue;
                    }

                    $data = $tmdb->formatMovieData($raw);
                    if (empty($data['title'])) continue;

                    // Ensure unique slug
                    $baseSlug = $data['slug'];
                    if (Movie::where('slug', $baseSlug)->exists()) {
                        $data['slug'] = $baseSlug . '-' . $tmdbId;
                    }

                    // Ensure poster
                    if (empty($data['poster_url'])) {
                        $data['poster_url'] = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80';
                    }
                    if (empty($data['backdrop_url'])) {
                        $data['backdrop_url'] = $data['poster_url'];
                    }

                    $data['is_published'] = true;
                    $data['views'] = rand(850, 48000);
                    $data['is_featured'] = rand(0, 4) === 0;

                    try {
                        $movie = Movie::create($data);

                        // Match direct stream from M3U or assign direct fallback stream
                        $matchedStream = $this->matchStreamForMovie($movie, $streamPool);
                        if ($matchedStream) {
                            $this->attachStream($movie, $matchedStream);
                        } else {
                            // Assign demo HLS/MP4 fallback stream
                            $this->attachStream($movie, 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
                        }

                        $imported++;
                        $bar->advance();
                    } catch (\Throwable $e) {
                        // Skip duplicate or constraint error
                    }
                }
            }
        }

        $bar->finish();
        $this->newLine(2);

        $finalCount = Movie::count();
        $streamCount = MovieStream::count();

        $this->info("=================================================");
        $this->info("             Import Completed!");
        $this->info("=================================================");
        $this->line(" Newly Imported Movies:   {$imported}");
        $this->line(" Total Movies in DB:      {$finalCount}");
        $this->line(" Total Movie Streams:     {$streamCount}");
        $this->info("=================================================");

        return self::SUCCESS;
    }

    /**
     * Extract stream pool from M3U file
     */
    protected function extractM3uStreamPool(string $filePath, int $max = 500): array
    {
        if (!file_exists($filePath)) return [];

        $handle = fopen($filePath, 'r');
        if (!$handle) return [];

        $pool = [];
        $currentName = '';

        while (($line = fgets($handle)) !== false) {
            $line = trim($line);
            if (empty($line)) continue;

            if (str_starts_with($line, '#EXTINF:')) {
                $pos = strrpos($line, ',');
                if ($pos !== false) {
                    $currentName = strtolower(trim(substr($line, $pos + 1)));
                }
            } elseif (str_starts_with($line, 'http://') || str_starts_with($line, 'https://')) {
                if (!empty($currentName) && (str_contains($line, '.mp4') || str_contains($line, '.mkv') || str_contains($line, '/movie/'))) {
                    $pool[] = [
                        'name' => $currentName,
                        'url' => $line,
                    ];
                    if (count($pool) >= $max) break;
                }
                $currentName = '';
            }
        }

        fclose($handle);
        return $pool;
    }

    /**
     * Match a stream from the pool to a movie
     */
    protected function matchStreamForMovie(Movie $movie, array $pool): ?string
    {
        $titleLower = strtolower($movie->title);
        $words = array_filter(explode(' ', $titleLower), fn($w) => strlen($w) > 3);

        foreach ($pool as $item) {
            foreach ($words as $word) {
                if (str_contains($item['name'], $word)) {
                    return $item['url'];
                }
            }
        }

        // Return random stream from pool if available
        if (!empty($pool)) {
            $random = $pool[array_rand($pool)];
            return $random['url'];
        }

        return null;
    }

    /**
     * Attach direct stream to movie
     */
    protected function attachStream(Movie $movie, string $url): void
    {
        $streamType = str_contains($url, '.m3u8') ? 'hls' : 'mp4';

        MovieStream::create([
            'movie_id' => $movie->id,
            'server_name' => 'Direct Server (Full HD)',
            'stream_type' => $streamType,
            'stream_url' => $url,
            'quality' => '1080p',
            'priority' => 1,
        ]);
    }
}
