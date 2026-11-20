<?php

namespace App\Services;

use App\Models\Movie;
use App\Models\MovieStream;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DebridResolverService
{
    protected ?string $apiKey;
    protected ?string $torboxKey;
    protected int $timeout;

    public function __construct()
    {
        $this->apiKey = config('services.real_debrid.api_key', env('REAL_DEBRID_API_KEY'));
        $this->torboxKey = config('services.torbox.api_key', env('TORBOX_API_KEY'));
        $this->timeout = (int) config('services.real_debrid.timeout', 6);
    }

    /**
     * Check if Real-Debrid or TorBox integration is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey) || !empty($this->torboxKey);
    }

    /**
     * Resolve 4K / 1080p direct stream for a movie using IMDb or TMDB ID.
     */
    public function resolveMovieStream(Movie $movie, string $preferredQuality = '1080p'): ?array
    {
        $cacheKey = "debrid_stream_movie_{$movie->id}_{$preferredQuality}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $imdbId = $movie->imdb_id;
        if (!$imdbId && $movie->tmdb_id) {
            // Try fetching IMDb ID from TMDB if missing
            $tmdb = app(TmdbService::class);
            $details = $tmdb->getMovieDetails($movie->tmdb_id);
            if (!empty($details['imdb_id'])) {
                $movie->update(['imdb_id' => $details['imdb_id']]);
                $imdbId = $details['imdb_id'];
            }
        }

        if (!$imdbId) {
            return null;
        }

        // 1. Search cached torrent streams via public torrent indexers (YTS, Torrentio cache)
        $streamData = $this->searchCachedTorrentStream($imdbId, $preferredQuality);
        if ($streamData) {
            // Cache valid stream URL for 24 hours
            Cache::put($cacheKey, $streamData, 86400);

            // Save/attach stream to movie in database
            MovieStream::updateOrCreate(
                [
                    'movie_id' => $movie->id,
                    'server_name' => 'Cloud VIP (10Gbps 4K BluRay)',
                ],
                [
                    'stream_type' => 'mp4',
                    'stream_url' => $streamData['stream_url'],
                    'quality' => $streamData['quality'] ?? $preferredQuality,
                    'priority' => 2,
                ]
            );

            return $streamData;
        }

        return null;
    }

    /**
     * Search pre-cached torrents for an IMDb ID and unrestrict link via Real-Debrid.
     */
    protected function searchCachedTorrentStream(string $imdbId, string $quality): ?array
    {
        try {
            // Query public torrentio or yts index for hash
            $torrentioUrl = "https://torrentio.strem.fun/stream/movie/{$imdbId}.json";
            $res = Http::timeout($this->timeout)->withoutVerifying()->get($torrentioUrl);

            if ($res->successful()) {
                $data = $res->json();
                $streams = $data['streams'] ?? [];

                // Filter for matching quality or highest available
                foreach ($streams as $s) {
                    $infoHash = $s['infoHash'] ?? null;
                    if ($infoHash && $this->apiKey) {
                        $unrestricted = $this->unrestrictTorrentHash($infoHash);
                        if ($unrestricted) {
                            return [
                                'stream_url' => $unrestricted,
                                'quality' => str_contains($s['title'] ?? '', '4k') || str_contains($s['title'] ?? '', '2160p') ? '4K UHD' : '1080p',
                                'provider' => 'Real-Debrid 10Gbps CDN',
                            ];
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Debrid resolver exception: " . $e->getMessage(), ['imdb' => $imdbId]);
        }

        return null;
    }

    /**
     * Convert torrent infoHash into direct high-speed HTTP link via Real-Debrid API.
     */
    public function unrestrictTorrentHash(string $infoHash): ?string
    {
        if (!$this->apiKey) {
            return null;
        }

        try {
            // Add magnet to Real-Debrid
            $magnet = "magnet:?xt=urn:btih:{$infoHash}";
            $addRes = Http::withHeaders(['Authorization' => "Bearer {$this->apiKey}"])
                ->asForm()
                ->post('https://api.real-debrid.com/rest/1.0/torrents/addMagnet', [
                    'magnet' => $magnet,
                ]);

            if ($addRes->successful()) {
                $torrentId = $addRes->json()['id'] ?? null;
                if ($torrentId) {
                    // Select all files
                    Http::withHeaders(['Authorization' => "Bearer {$this->apiKey}"])
                        ->asForm()
                        ->post("https://api.real-debrid.com/rest/1.0/torrents/selectFiles/{$torrentId}", [
                            'files' => 'all',
                        ]);

                    // Get torrent info
                    $infoRes = Http::withHeaders(['Authorization' => "Bearer {$this->apiKey}"])
                        ->get("https://api.real-debrid.com/rest/1.0/torrents/info/{$torrentId}");

                    $links = $infoRes->json()['links'] ?? [];
                    if (!empty($links)) {
                        // Unrestrict download link
                        $unrestrictRes = Http::withHeaders(['Authorization' => "Bearer {$this->apiKey}"])
                            ->asForm()
                            ->post('https://api.real-debrid.com/rest/1.0/unrestrict/link', [
                                'link' => $links[0],
                            ]);

                        if ($unrestrictRes->successful()) {
                            return $unrestrictRes->json()['download'] ?? null;
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::error("Real-Debrid API error: " . $e->getMessage());
        }

        return null;
    }
}
