<?php

namespace App\Services;

use App\Models\Movie;
use App\Models\Series;
use App\Models\Season;
use App\Models\Episode;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TmdbService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $imageBaseUrl;

    public function __construct()
    {
        $this->apiKey = (string) config('services.tmdb.api_key', '');
        $this->baseUrl = (string) config('services.tmdb.base_url', 'https://api.themoviedb.org/3');
        $this->imageBaseUrl = (string) config('services.tmdb.image_base_url', 'https://image.tmdb.org/t/p');
    }

    /**
     * Search movies by query.
     */
    public function searchMovies(string $query, int $page = 1): array
    {
        return $this->request('/search/movie', [
            'query' => $query,
            'page' => $page,
            'include_adult' => false,
        ]);
    }

    /**
     * Fetch complete movie details including credits, videos (trailers), and external IDs.
     */
    public function getMovieDetails(int|string $tmdbId): array
    {
        return $this->request("/movie/{$tmdbId}", [
            'append_to_response' => 'videos,credits,external_ids',
        ]);
    }

    /**
     * Find movie by IMDb ID using TMDB Find API.
     */
    public function findMovieByImdbId(string $imdbId): ?array
    {
        $res = $this->request("/find/{$imdbId}", [
            'external_source' => 'imdb_id',
        ]);
        $movies = $res['movie_results'] ?? [];
        return $movies[0] ?? null;
    }

    /**
     * Search TV series by query.
     */
    public function searchTvSeries(string $query, int $page = 1): array
    {
        return $this->request('/search/tv', [
            'query' => $query,
            'page' => $page,
            'include_adult' => false,
        ]);
    }

    /**
     * Fetch TV series details including credits, videos, and external IDs.
     */
    public function getTvSeriesDetails(int|string $tmdbId): array
    {
        return $this->request("/tv/{$tmdbId}", [
            'append_to_response' => 'videos,credits,external_ids',
        ]);
    }

    /**
     * Fetch season details with episodes.
     */
    public function getSeasonDetails(int|string $seriesTmdbId, int $seasonNumber): array
    {
        return $this->request("/tv/{$seriesTmdbId}/season/{$seasonNumber}");
    }

    /**
     * Get trending movies with pagination.
     */
    public function getTrendingMovies(string $timeWindow = 'day', int $page = 1): array
    {
        return $this->request("/trending/movie/{$timeWindow}", ['page' => $page]);
    }

    /**
     * Get trending TV series with pagination.
     */
    public function getTrendingTvSeries(string $timeWindow = 'day', int $page = 1): array
    {
        return $this->request("/trending/tv/{$timeWindow}", ['page' => $page]);
    }

    /**
     * Get popular TV series with pagination.
     */
    public function getPopularTvSeries(int $page = 1): array
    {
        return $this->request('/tv/popular', ['page' => $page]);
    }

    /**
     * Get popular movies with pagination.
     */
    public function getPopularMovies(int $page = 1): array
    {
        return $this->request('/movie/popular', ['page' => $page]);
    }

    /**
     * Get top rated movies with pagination.
     */
    public function getTopRatedMovies(int $page = 1): array
    {
        return $this->request('/movie/top_rated', ['page' => $page]);
    }

    /**
     * Get now playing movies with pagination.
     */
    public function getNowPlayingMovies(int $page = 1): array
    {
        return $this->request('/movie/now_playing', ['page' => $page]);
    }

    /**
     * Discover movies with custom filters.
     */
    public function discoverMovies(array $params = []): array
    {
        return $this->request('/discover/movie', $params);
    }

    /**
     * Extract primary YouTube trailer URL from TMDB videos array.
     */
    public function extractTrailerUrl(array $raw): ?string
    {
        $videos = $raw['videos']['results'] ?? [];
        if (empty($videos) || !is_array($videos)) {
            return null;
        }

        // Look for official trailer first
        foreach ($videos as $v) {
            if (($v['site'] ?? '') === 'YouTube' && ($v['type'] ?? '') === 'Trailer' && !empty($v['key'])) {
                return "https://www.youtube.com/watch?v={$v['key']}";
            }
        }

        // Fallback to any YouTube teaser or video
        foreach ($videos as $v) {
            if (($v['site'] ?? '') === 'YouTube' && !empty($v['key'])) {
                return "https://www.youtube.com/watch?v={$v['key']}";
            }
        }

        return null;
    }

    /**
     * Extract top 8 cast members with names, character, and avatar.
     */
    public function extractCast(array $raw): array
    {
        $cast = $raw['credits']['cast'] ?? [];
        if (empty($cast) || !is_array($cast)) {
            return [];
        }

        $formatted = [];
        foreach (array_slice($cast, 0, 8) as $person) {
            $photo = !empty($person['profile_path'])
                ? rtrim($this->imageBaseUrl, '/') . '/w185' . $person['profile_path']
                : null;

            $formatted[] = [
                'name' => $person['name'] ?? '',
                'character' => $person['character'] ?? '',
                'profile_url' => $photo,
            ];
        }

        return $formatted;
    }

    /**
     * Extract director name and avatar from crew or created_by.
     */
    public function extractDirector(array $raw): array
    {
        $crew = $raw['credits']['crew'] ?? [];
        if (is_array($crew)) {
            foreach ($crew as $member) {
                if (($member['job'] ?? '') === 'Director') {
                    $avatar = !empty($member['profile_path'])
                        ? rtrim($this->imageBaseUrl, '/') . '/w185' . $member['profile_path']
                        : null;
                    return [
                        'director' => $member['name'] ?? null,
                        'director_avatar' => $avatar,
                    ];
                }
            }
        }

        $createdBy = $raw['created_by'] ?? [];
        if (is_array($createdBy) && !empty($createdBy)) {
            $creator = $createdBy[0];
            $avatar = !empty($creator['profile_path'])
                ? rtrim($this->imageBaseUrl, '/') . '/w185' . $creator['profile_path']
                : null;
            return [
                'director' => $creator['name'] ?? null,
                'director_avatar' => $avatar,
            ];
        }

        return ['director' => null, 'director_avatar' => null];
    }

    /**
     * Extract spoken languages from TMDB raw payload.
     */
    public function extractLanguages(array $raw): array
    {
        $languages = [];
        $spoken = $raw['spoken_languages'] ?? [];
        if (is_array($spoken)) {
            foreach ($spoken as $lang) {
                $name = $lang['english_name'] ?? $lang['name'] ?? null;
                if ($name && !in_array($name, $languages, true)) {
                    $languages[] = $name;
                }
            }
        }

        if (empty($languages) && !empty($raw['original_language'])) {
            $isoMap = [
                'en' => 'English',
                'bn' => 'Bengali',
                'hi' => 'Hindi',
                'ta' => 'Tamil',
                'te' => 'Telugu',
                'ml' => 'Malayalam',
                'es' => 'Spanish',
                'fr' => 'French',
                'de' => 'German',
                'ko' => 'Korean',
                'ja' => 'Japanese',
                'zh' => 'Chinese',
            ];
            $code = strtolower($raw['original_language']);
            $languages[] = $isoMap[$code] ?? strtoupper($code);
        }

        return $languages;
    }

    /**
     * Format raw TMDB movie payload into our database schema structure.
     */
    public function formatMovieData(array $raw): array
    {
        $posterUrl = null;
        if (!empty($raw['poster_path'])) {
            $posterUrl = rtrim($this->imageBaseUrl, '/') . '/w500' . $raw['poster_path'];
        }

        $backdropUrl = null;
        if (!empty($raw['backdrop_path'])) {
            $backdropUrl = rtrim($this->imageBaseUrl, '/') . '/original' . $raw['backdrop_path'];
        }

        $genres = [];
        if (!empty($raw['genres']) && is_array($raw['genres'])) {
            $genres = array_map(fn ($g) => is_array($g) ? ($g['name'] ?? '') : (string) $g, $raw['genres']);
            $genres = array_values(array_filter($genres));
        }

        if (empty($genres) && !empty($raw['genre_ids']) && is_array($raw['genre_ids'])) {
            $genreMap = [
                28 => 'Action', 12 => 'Adventure', 16 => 'Animation', 35 => 'Comedy',
                80 => 'Crime', 99 => 'Documentary', 18 => 'Drama', 10751 => 'Family',
                14 => 'Fantasy', 36 => 'History', 27 => 'Horror', 10402 => 'Music',
                9648 => 'Mystery', 10749 => 'Romance', 878 => 'Science Fiction',
                10770 => 'TV Movie', 53 => 'Thriller', 10752 => 'War', 37 => 'Western',
            ];
            foreach ($raw['genre_ids'] as $gid) {
                if (isset($genreMap[$gid])) {
                    $genres[] = $genreMap[$gid];
                }
            }
        }

        $title = $raw['title'] ?? $raw['original_title'] ?? 'Untitled';
        $slug = Str::slug($title);

        $runtime = $raw['runtime'] ?? null;
        if (!$runtime && !empty($raw['episode_run_time']) && is_array($raw['episode_run_time'])) {
            $runtime = $raw['episode_run_time'][0] ?? null;
        }
        if (!$runtime) {
            $runtime = rand(100, 148);
        }

        $imdbId = $raw['imdb_id'] ?? $raw['external_ids']['imdb_id'] ?? null;
        $trailerUrl = $this->extractTrailerUrl($raw);
        $castList = $this->extractCast($raw);
        $directorInfo = $this->extractDirector($raw);
        $languages = $this->extractLanguages($raw);

        return [
            'tmdb_id' => (int) ($raw['id'] ?? 0),
            'imdb_id' => $imdbId,
            'title' => $title,
            'slug' => $slug,
            'overview' => $raw['overview'] ?? null,
            'poster_url' => $posterUrl,
            'backdrop_url' => $backdropUrl,
            'trailer_url' => $trailerUrl,
            'release_date' => !empty($raw['release_date']) ? $raw['release_date'] : null,
            'duration_minutes' => $runtime ? (int) $runtime : null,
            'rating' => isset($raw['vote_average']) ? round((float) $raw['vote_average'], 1) : 0.0,
            'genres' => $genres,
            'cast' => $castList,
            'director' => $directorInfo['director'],
            'director_avatar' => $directorInfo['director_avatar'],
            'languages' => $languages,
            'is_published' => true,
        ];
    }

    /**
     * Format raw TMDB TV show payload into our series database structure.
     */
    public function formatSeriesData(array $raw): array
    {
        $posterUrl = null;
        if (!empty($raw['poster_path'])) {
            $posterUrl = rtrim($this->imageBaseUrl, '/') . '/w500' . $raw['poster_path'];
        }

        $backdropUrl = null;
        if (!empty($raw['backdrop_path'])) {
            $backdropUrl = rtrim($this->imageBaseUrl, '/') . '/original' . $raw['backdrop_path'];
        }

        $genres = [];
        if (!empty($raw['genres']) && is_array($raw['genres'])) {
            $genres = array_map(fn ($g) => is_array($g) ? ($g['name'] ?? '') : (string) $g, $raw['genres']);
            $genres = array_values(array_filter($genres));
        }

        if (empty($genres) && !empty($raw['genre_ids']) && is_array($raw['genre_ids'])) {
            $genreMap = [
                10759 => 'Action & Adventure', 16 => 'Animation', 35 => 'Comedy',
                80 => 'Crime', 99 => 'Documentary', 18 => 'Drama', 10751 => 'Family',
                10762 => 'Kids', 9648 => 'Mystery', 10763 => 'News', 10764 => 'Reality',
                10765 => 'Sci-Fi & Fantasy', 10766 => 'Soap', 10767 => 'Talk', 10768 => 'War & Politics', 37 => 'Western',
            ];
            foreach ($raw['genre_ids'] as $gid) {
                if (isset($genreMap[$gid])) {
                    $genres[] = $genreMap[$gid];
                }
            }
        }

        $title = $raw['name'] ?? $raw['original_name'] ?? 'Untitled Series';
        $slug = Str::slug($title);

        $imdbId = $raw['external_ids']['imdb_id'] ?? null;
        $trailerUrl = $this->extractTrailerUrl($raw);
        $castList = $this->extractCast($raw);
        $directorInfo = $this->extractDirector($raw);
        $languages = $this->extractLanguages($raw);

        return [
            'tmdb_id' => (int) ($raw['id'] ?? 0),
            'imdb_id' => $imdbId,
            'title' => $title,
            'slug' => $slug,
            'overview' => $raw['overview'] ?? null,
            'poster_url' => $posterUrl,
            'backdrop_url' => $backdropUrl,
            'trailer_url' => $trailerUrl,
            'first_air_date' => !empty($raw['first_air_date']) ? $raw['first_air_date'] : null,
            'rating' => isset($raw['vote_average']) ? round((float) $raw['vote_average'], 1) : 0.0,
            'genres' => $genres,
            'cast' => $castList,
            'director' => $directorInfo['director'],
            'director_avatar' => $directorInfo['director_avatar'],
            'languages' => $languages,
            'is_published' => true,
        ];
    }

    /**
     * Fetch and save or update Movie in database.
     */
    public function importMovieById(int|string $tmdbId): Movie
    {
        $details = $this->getMovieDetails($tmdbId);
        if (empty($details['id'])) {
            throw new \RuntimeException("Could not find movie with TMDB ID: {$tmdbId}");
        }

        $data = $this->formatMovieData($details);

        // Ensure unique slug if movie with same slug exists under different tmdb_id
        $existing = Movie::where('slug', $data['slug'])
            ->where('tmdb_id', '!=', $data['tmdb_id'])
            ->first();

        if ($existing) {
            $data['slug'] = $data['slug'] . '-' . $data['tmdb_id'];
        }

        return Movie::updateOrCreate(
            ['tmdb_id' => $data['tmdb_id']],
            $data
        );
    }

    /**
     * Fetch and save or update TV Series with Seasons and Episodes in database.
     */
    public function importSeriesWithSeasons(int|string $tmdbId): Series
    {
        $details = $this->getTvSeriesDetails($tmdbId);
        if (empty($details['id'])) {
            throw new \RuntimeException("Could not find TV Series with TMDB ID: {$tmdbId}");
        }

        $data = $this->formatSeriesData($details);

        // Ensure unique slug
        $existing = Series::where('slug', $data['slug'])
            ->where('tmdb_id', '!=', $data['tmdb_id'])
            ->first();

        if ($existing) {
            $data['slug'] = $data['slug'] . '-' . $data['tmdb_id'];
        }

        $series = Series::updateOrCreate(
            ['tmdb_id' => $data['tmdb_id']],
            $data
        );

        // Process Seasons & Episodes
        $rawSeasons = $details['seasons'] ?? [];
        foreach ($rawSeasons as $s) {
            $seasonNumber = (int) ($s['season_number'] ?? 1);
            if ($seasonNumber === 0) continue; // Skip Specials (Season 0)

            $seasonPoster = !empty($s['poster_path'])
                ? rtrim($this->imageBaseUrl, '/') . '/w500' . $s['poster_path']
                : $series->poster_url;

            $season = Season::updateOrCreate(
                [
                    'series_id' => $series->id,
                    'season_number' => $seasonNumber,
                ],
                [
                    'title' => $s['name'] ?? "Season {$seasonNumber}",
                    'poster_url' => $seasonPoster,
                ]
            );

            // Fetch season episode list
            $seasonDetails = $this->getSeasonDetails($tmdbId, $seasonNumber);
            $episodes = $seasonDetails['episodes'] ?? [];

            foreach ($episodes as $ep) {
                $epNumber = (int) ($ep['episode_number'] ?? 1);
                $stillUrl = !empty($ep['still_path'])
                    ? rtrim($this->imageBaseUrl, '/') . '/w500' . $ep['still_path']
                    : $seasonPoster;

                Episode::updateOrCreate(
                    [
                        'season_id' => $season->id,
                        'episode_number' => $epNumber,
                    ],
                    [
                        'title' => $ep['name'] ?? "Episode {$epNumber}",
                        'overview' => $ep['overview'] ?? null,
                        'still_url' => $stillUrl,
                        'duration_minutes' => !empty($ep['runtime']) ? (int) $ep['runtime'] : 45,
                    ]
                );
            }
        }

        return $series;
    }

    /**
     * Internal request helper using Laravel Http.
     */
    protected function request(string $endpoint, array $params = []): array
    {
        $params['api_key'] = $this->apiKey;

        $url = rtrim($this->baseUrl, '/') . '/' . ltrim($endpoint, '/');

        try {
            $client = Http::timeout(15)->acceptJson();
            
            if (app()->environment('local') || config('services.tmdb.verify_ssl', false) === false) {
                $client = $client->withoutVerifying();
            }

            $response = $client->get($url, $params);

            if ($response->successful()) {
                return $response->json() ?? [];
            }

            Log::error("TMDB API Error [{$response->status()}]: " . $response->body(), [
                'endpoint' => $endpoint,
                'params' => $params,
            ]);

            return [];
        } catch (\Throwable $e) {
            Log::error("TMDB Request Exception: " . $e->getMessage(), [
                'endpoint' => $endpoint,
            ]);
            return [];
        }
    }
}
