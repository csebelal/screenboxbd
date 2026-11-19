<?php

namespace App\Console\Commands;

use App\Models\Movie;
use App\Models\Series;
use App\Services\TmdbService;
use Illuminate\Console\Command;

class TmdbSyncCreditsCommand extends Command
{
    protected $signature = 'tmdb:sync-credits 
                            {--limit=50 : Number of titles to sync}
                            {--id= : Specific Movie ID to sync}';

    protected $description = 'Enrich movies and series with real TMDB cast, director, and languages';

    public function handle(TmdbService $tmdb): int
    {
        $specificId = $this->option('id');
        $limit = (int) $this->option('limit');

        if ($specificId) {
            $movies = Movie::where('id', $specificId)->get();
        } else {
            $movies = Movie::whereNotNull('tmdb_id')
                ->where(function ($q) {
                    $q->whereNull('cast')
                      ->orWhere('cast', '[]')
                      ->orWhereNull('director');
                })
                ->orderByDesc('views')
                ->orderByDesc('id')
                ->take($limit)
                ->get();
        }

        $this->info("Found {$movies->count()} movies needing TMDB credits sync...");

        $syncedCount = 0;
        foreach ($movies as $movie) {
            $this->line("Fetching credits for: {$movie->title} (TMDB: {$movie->tmdb_id})...");
            try {
                $details = $tmdb->getMovieDetails($movie->tmdb_id);
                if (!empty($details['id'])) {
                    $cast = $tmdb->extractCast($details);
                    $dirInfo = $tmdb->extractDirector($details);
                    $langs = $tmdb->extractLanguages($details);
                    $trailer = $movie->trailer_url ?: $tmdb->extractTrailerUrl($details);

                    $movie->update([
                        'cast' => $cast,
                        'director' => $dirInfo['director'] ?? $movie->director,
                        'director_avatar' => $dirInfo['director_avatar'] ?? $movie->director_avatar,
                        'languages' => !empty($langs) ? $langs : $movie->languages,
                        'trailer_url' => $trailer,
                    ]);

                    $dirName = $dirInfo['director'] ?? 'N/A';
                    $castCount = count($cast);
                    $this->info("  ✓ Synced: Director: {$dirName} | Cast: {$castCount} members | Langs: " . implode(', ', $langs));
                    $syncedCount++;
                }
            } catch (\Throwable $e) {
                $this->warn("  ✗ Failed for {$movie->title}: " . $e->getMessage());
            }

            usleep(200000); // 200ms delay to be polite to TMDB API
        }

        // Also check series
        $seriesList = Series::whereNotNull('tmdb_id')
            ->where(function ($q) {
                $q->whereNull('cast')
                  ->orWhere('cast', '[]')
                  ->orWhereNull('director');
            })
            ->take(10)
            ->get();

        if ($seriesList->isNotEmpty()) {
            $this->info("Found {$seriesList->count()} series needing TMDB credits sync...");
            foreach ($seriesList as $series) {
                $this->line("Fetching credits for TV: {$series->title} (TMDB: {$series->tmdb_id})...");
                try {
                    $details = $tmdb->getTvSeriesDetails($series->tmdb_id);
                    if (!empty($details['id'])) {
                        $cast = $tmdb->extractCast($details);
                        $dirInfo = $tmdb->extractDirector($details);
                        $langs = $tmdb->extractLanguages($details);
                        $trailer = $series->trailer_url ?: $tmdb->extractTrailerUrl($details);

                        $series->update([
                            'cast' => $cast,
                            'director' => $dirInfo['director'] ?? $series->director,
                            'director_avatar' => $dirInfo['director_avatar'] ?? $series->director_avatar,
                            'languages' => !empty($langs) ? $langs : $series->languages,
                            'trailer_url' => $trailer,
                        ]);

                        $this->info("  ✓ Synced TV Series: {$series->title}");
                    }
                } catch (\Throwable $e) {
                    $this->warn("  ✗ Failed for {$series->title}: " . $e->getMessage());
                }
            }
        }

        $this->info("🎉 Completed! Total movies enriched: {$syncedCount}");
        return self::SUCCESS;
    }
}
