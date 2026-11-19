<?php

namespace App\Console\Commands;

use App\Services\TmdbService;
use Illuminate\Console\Command;

class TmdbImportCommand extends Command
{
    protected $signature = 'tmdb:import 
                            {identifier : TMDB ID or Movie title to search} 
                            {--search : Treat identifier as search query}';

    protected $description = 'Import or update movie metadata from TMDB API';

    public function handle(TmdbService $tmdb): int
    {
        $identifier = $this->argument('identifier');
        $isSearch = $this->option('search') || !is_numeric($identifier);

        if ($isSearch) {
            $this->info("Searching TMDB for: '{$identifier}'...");
            $results = $tmdb->searchMovies($identifier);
            $items = $results['results'] ?? [];

            if (empty($items)) {
                $this->warn("No movies found for search query: {$identifier}");
                return self::FAILURE;
            }

            $choices = [];
            foreach (array_slice($items, 0, 5) as $item) {
                $year = !empty($item['release_date']) ? substr($item['release_date'], 0, 4) : 'N/A';
                $choices[$item['id']] = "{$item['title']} ({$year}) - ID: {$item['id']} [★ {$item['vote_average']}]";
            }

            $chosen = $this->choice('Select movie to import', $choices);
            $tmdbId = array_search($chosen, $choices, true);
        } else {
            $tmdbId = (int) $identifier;
        }

        $this->info("Fetching details for TMDB ID: {$tmdbId}...");

        try {
            $movie = $tmdb->importMovieById($tmdbId);
            $this->info("✓ Successfully imported movie: '{$movie->title}' (ID: {$movie->id}, TMDB: {$movie->tmdb_id})");
            $this->line("  Rating: {$movie->rating} | Duration: {$movie->duration_minutes}m | Genres: " . implode(', ', $movie->genres ?? []));
            $this->line("  Poster: {$movie->poster_url}");
            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Failed to import movie: " . $e->getMessage());
            return self::FAILURE;
        }
    }
}
