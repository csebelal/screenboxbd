<?php

namespace App\Services;

use App\Models\Movie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YtsTorrentService
{
    protected array $apiBases = [
        'https://yts.rs/api/v2',
        'https://yts.lt/api/v2',
        'https://yts.am/api/v2',
        'https://yts.mx/api/v2',
    ];

    public function __construct(
        protected TmdbService $tmdb
    ) {}

    /**
     * Fetch list of torrent movies from YTS API.
     */
    public function getLatestMovies(int $limit = 20, int $page = 1, string $sortBy = 'download_count'): array
    {
        foreach ($this->apiBases as $base) {
            try {
                $response = Http::timeout(10)
                    ->withoutVerifying()
                    ->get("{$base}/list_movies.json", [
                        'limit' => min($limit, 50),
                        'page' => $page,
                        'sort_by' => $sortBy,
                    ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $movies = $json['data']['movies'] ?? [];
                    if (!empty($movies)) {
                        return $movies;
                    }
                }
            } catch (\Throwable $e) {
                Log::warning("YTS Mirror {$base} failed: " . $e->getMessage());
            }
        }

        return [];
    }

    /**
     * Build magnet link from torrent hash and title.
     */
    public function buildMagnetLink(string $hash, string $title): string
    {
        $encodedTitle = urlencode($title);
        $trackers = [
            'udp://open.demonii.com:1337/announce',
            'udp://tracker.openbittorrent.com:80',
            'udp://tracker.coppersurfer.tk:6969',
            'udp://glotorrents.pw:6969/announce',
            'udp://tracker.opentrackr.org:1337/announce',
            'udp://torrent.gresille.org:80/announce',
            'udp://p4p.arenabg.ch:1337',
            'udp://tracker.internetwarriors.net:1337',
        ];

        $trackerParams = '';
        foreach ($trackers as $tr) {
            $trackerParams .= '&tr=' . urlencode($tr);
        }

        return "magnet:?xt=urn:btih:{$hash}&dn={$encodedTitle}{$trackerParams}";
    }

    /**
     * Format YTS torrent items into download sources array.
     */
    public function formatDownloadSources(array $rawTorrents, string $title): array
    {
        $sources = [];

        foreach ($rawTorrents as $t) {
            $quality = $t['quality'] ?? '1080p';
            $type = strtoupper($t['type'] ?? 'WEB');
            $hash = $t['hash'] ?? '';

            $sources[] = [
                'type' => 'torrent',
                'label' => "YTS {$quality} {$type}",
                'quality' => $quality,
                'size' => $t['size'] ?? '1.5 GB',
                'torrent_url' => $t['url'] ?? null,
                'magnet_url' => $hash ? $this->buildMagnetLink($hash, "{$title} [{$quality}]") : null,
                'seeds' => (int) ($t['seeds'] ?? 0),
                'peers' => (int) ($t['peers'] ?? 0),
            ];
        }

        return $sources;
    }

    /**
     * Sync single YTS movie with TMDB and database.
     */
    public function syncMovie(array $ytsMovie): ?Movie
    {
        $imdbCode = $ytsMovie['imdb_code'] ?? null;
        $title = $ytsMovie['title'] ?? 'Untitled';
        $year = (int) ($ytsMovie['year'] ?? 0);

        // 1. Check if movie already in DB by imdb_id or title
        $movie = null;
        if ($imdbCode) {
            $movie = Movie::where('imdb_id', $imdbCode)->first();
        }

        // 2. If not found in DB, search TMDB by IMDb or Title
        if (!$movie) {
            $tmdbMatch = null;
            if ($imdbCode) {
                $tmdbMatch = $this->tmdb->findMovieByImdbId($imdbCode);
            }

            if (!$tmdbMatch) {
                $search = $this->tmdb->searchMovies($title);
                $results = $search['results'] ?? [];
                foreach ($results as $res) {
                    $releaseYear = !empty($res['release_date']) ? (int) substr($res['release_date'], 0, 4) : 0;
                    if ($year && $releaseYear === $year) {
                        $tmdbMatch = $res;
                        break;
                    }
                }
                if (!$tmdbMatch && !empty($results[0])) {
                    $tmdbMatch = $results[0];
                }
            }

            if ($tmdbMatch && !empty($tmdbMatch['id'])) {
                $movie = $this->tmdb->importMovieById($tmdbMatch['id']);
            }
        }

        // 3. Attach YTS download sources to the movie
        if ($movie) {
            $existingDownloads = $movie->download_sources ?: [];
            $newDownloads = $this->formatDownloadSources($ytsMovie['torrents'] ?? [], $movie->title);

            // Merge avoiding duplicates by label
            $existingLabels = array_column($existingDownloads, 'label');
            foreach ($newDownloads as $item) {
                if (!in_array($item['label'], $existingLabels)) {
                    $existingDownloads[] = $item;
                }
            }

            $movie->update([
                'imdb_id' => $movie->imdb_id ?: $imdbCode,
                'download_sources' => $existingDownloads,
            ]);

            return $movie;
        }

        return null;
    }
}
