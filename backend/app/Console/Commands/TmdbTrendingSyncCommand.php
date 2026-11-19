<?php

namespace App\Console\Commands;

use App\Services\TmdbService;
use Illuminate\Console\Command;

class TmdbTrendingSyncCommand extends Command
{
    protected $signature = 'tmdb:sync-trending {--count=15 : Number of trending movies to import}';
    protected $description = 'Sync top trending movies from TMDB API';

    public function handle(TmdbService $tmdb): int
    {
        $count = (int) $this->option('count');
        $this->info("Fetching trending movies from TMDB...");

        $trending = $tmdb->getTrendingMovies('day');
        $items = $trending['results'] ?? [];

        if (empty($items)) {
            $this->warn("No trending movies returned from TMDB API.");
            return self::FAILURE;
        }

        $imported = 0;
        foreach (array_slice($items, 0, $count) as $index => $item) {
            $tmdbId = $item['id'];
            $title = $item['title'] ?? 'Untitled';
            $this->line(" [ " . ($index + 1) . "/{$count} ] Importing: {$title} (ID: {$tmdbId})...");

            try {
                $movie = $tmdb->importMovieById($tmdbId);
                $imported++;
            } catch (\Throwable $e) {
                $this->error("Failed to import {$title}: " . $e->getMessage());
            }
        }

        $this->newLine();
        $this->info("✓ Successfully imported {$imported} trending movies!");
        return self::SUCCESS;
    }
}
