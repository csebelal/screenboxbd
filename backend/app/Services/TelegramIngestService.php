<?php

namespace App\Services;

use App\Models\Movie;
use Illuminate\Support\Str;

class TelegramIngestService
{
    public function __construct(
        protected TmdbService $tmdb,
        protected BdixFtpResolverService $bdix
    ) {}

    /**
     * Ingest a movie release from Telegram message text or direct parameters.
     */
    public function ingestRelease(string $text, ?string $downloadUrl = null, ?string $quality = '1080p'): ?Movie
    {
        // 1. Parse title and year using regex cleaner
        $parsed = $this->bdix->parseReleaseFilename($text);
        $title = $parsed['title'];
        $year = $parsed['year'];

        if (empty($title)) {
            return null;
        }

        // 2. Search TMDB
        $search = $this->tmdb->searchMovies($title);
        $results = $search['results'] ?? [];

        if (empty($results)) {
            return null;
        }

        $best = $results[0];
        if ($year) {
            foreach ($results as $item) {
                $itemYear = !empty($item['release_date']) ? (int) substr($item['release_date'], 0, 4) : 0;
                if ($itemYear === $year) {
                    $best = $item;
                    break;
                }
            }
        }

        // 3. Import or get movie
        $movie = Movie::where('tmdb_id', $best['id'])->first();
        if (!$movie) {
            $movie = $this->tmdb->importMovieById($best['id']);
        }

        if (!$movie) {
            return null;
        }

        // 4. Attach Telegram download link if provided
        if ($downloadUrl) {
            $existing = $movie->download_sources ?: [];
            $existing[] = [
                'type' => 'telegram',
                'label' => "Telegram Fast Direct [{$quality}]",
                'quality' => $quality ?: '1080p',
                'download_url' => $downloadUrl,
            ];

            $movie->update([
                'download_sources' => $existing,
            ]);
        }

        return $movie;
    }
}
