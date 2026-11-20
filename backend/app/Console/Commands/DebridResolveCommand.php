<?php

namespace App\Console\Commands;

use App\Models\Movie;
use App\Services\DebridResolverService;
use App\Services\TmdbService;
use Illuminate\Console\Command;

class DebridResolveCommand extends Command
{
    protected $signature = 'debrid:resolve 
                            {query : Movie Title, IMDb ID (tt...) or TMDB ID} 
                            {--quality=1080p : Target quality: 1080p, 4K, 720p}';

    protected $description = 'Resolve high-speed 10Gbps Cloud VIP stream for a movie via Debrid cloud cache';

    public function handle(DebridResolverService $debrid, TmdbService $tmdb): int
    {
        $query = trim($this->argument('query'));
        $quality = $this->option('quality') ?: '1080p';

        $this->info("=================================================");
        $this->info("     Real-Debrid / TorBox 10Gbps Stream Resolver");
        $this->info("=================================================");
        $this->line(" Query:    {$query}");
        $this->line(" Quality:  {$quality}");
        $this->newLine();

        // 1. Locate movie in DB or TMDB
        $movie = null;
        if (str_starts_with($query, 'tt')) {
            $movie = Movie::where('imdb_id', $query)->first();
        } elseif (is_numeric($query)) {
            $movie = Movie::where('tmdb_id', (int) $query)->first();
        } else {
            $movie = Movie::where('title', 'LIKE', "%{$query}%")->first();
        }

        if (!$movie) {
            $this->warn("Movie not found in local DB. Searching TMDB...");
            $search = $tmdb->searchMovies($query);
            $results = $search['results'] ?? [];
            if (empty($results)) {
                $this->error("No movie found on TMDB matching '{$query}'.");
                return self::FAILURE;
            }

            $first = $results[0];
            $this->info("Found TMDB Title: {$first['title']} ({$first['release_date']}) [ID: {$first['id']}]");
            $movie = $tmdb->importMovieById($first['id']);
        }

        if (!$movie) {
            $this->error("Failed to load or import movie.");
            return self::FAILURE;
        }

        $this->info("Resolving 10Gbps Debrid Cloud Stream for: {$movie->title} (IMDb: {$movie->imdb_id})...");

        $stream = $debrid->resolveMovieStream($movie, $quality);

        if ($stream) {
            $this->info("=================================================");
            $this->info(" ✓ STREAM UNLOCKED SUCCESSFULLY!");
            $this->info(" Provider: {$stream['provider']}");
            $this->info(" Quality:  {$stream['quality']}");
            $this->line(" URL:      {$stream['stream_url']}");
            $this->info(" Attached as 'Cloud VIP (10Gbps 4K BluRay)' in ScreenBoxBD!");
            $this->info("=================================================");
            return self::SUCCESS;
        }

        $this->warn("No cached stream found for this movie or Real-Debrid API returned empty.");
        return self::FAILURE;
    }
}
