<?php

namespace App\Console\Commands;

use App\Services\TmdbService;
use Illuminate\Console\Command;

class TmdbSeriesImportCommand extends Command
{
    protected $signature = 'tmdb:import-series 
                            {identifier : TMDB ID or TV Show title to search} 
                            {--search : Treat identifier as search query}';

    protected $description = 'Import TV series metadata with all seasons and episodes from TMDB API';

    public function handle(TmdbService $tmdb): int
    {
        $identifier = $this->argument('identifier');
        $isSearch = $this->option('search') || !is_numeric($identifier);

        if ($isSearch) {
            $this->info("Searching TMDB for TV Series: '{$identifier}'...");
            $results = $tmdb->searchTvSeries($identifier);
            $items = $results['results'] ?? [];

            if (empty($items)) {
                $this->warn("No TV series found for query: {$identifier}");
                return self::FAILURE;
            }

            $choices = [];
            foreach (array_slice($items, 0, 5) as $item) {
                $year = !empty($item['first_air_date']) ? substr($item['first_air_date'], 0, 4) : 'N/A';
                $title = $item['name'] ?? $item['original_name'] ?? 'Untitled';
                $choices[$item['id']] = "{$title} ({$year}) - ID: {$item['id']} [★ {$item['vote_average']}]";
            }

            $chosen = $this->choice('Select TV series to import', $choices);
            $tmdbId = array_search($chosen, $choices, true);
        } else {
            $tmdbId = (int) $identifier;
        }

        $this->info("Fetching TV Series details & seasons for TMDB ID: {$tmdbId}...");

        try {
            $series = $tmdb->importSeriesWithSeasons($tmdbId);
            $series->load('seasons.episodes');

            $seasonsCount = $series->seasons->count();
            $episodesCount = $series->seasons->sum(fn ($s) => $s->episodes->count());

            $this->info("✓ Successfully imported series: '{$series->title}' (ID: {$series->id}, TMDB: {$series->tmdb_id})");
            $this->line("  Rating: {$series->rating} | Seasons: {$seasonsCount} | Total Episodes: {$episodesCount}");
            $this->line("  Genres: " . implode(', ', $series->genres ?? []));
            $this->line("  Poster: {$series->poster_url}");
            if ($series->trailer_url) {
                $this->line("  Trailer: {$series->trailer_url}");
            }
            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Failed to import TV series: " . $e->getMessage());
            return self::FAILURE;
        }
    }
}
