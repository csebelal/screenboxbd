<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    /**
     * Paginated movies list with smart genre, search, language, quality, and sorting filters.
     */
    public function index(Request $request)
    {
        // 1. Single-query aggregated catalog endpoint for /movies page
        if ($request->boolean('catalog')) {
            return $this->catalog();
        }

        $cacheKey = 'movies_index_' . md5($request->fullUrl());
        
        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Movie::query()->published();

            if ($request->boolean('with_streams')) {
                $query->with('streams');
            }

            // Smart Genre Matching
            if ($request->filled('genre')) {
                $genre = trim($request->query('genre'));
                $genreLower = strtolower($genre);

                if ($genreLower === 'bangla-ott' || $genreLower === 'bangla ott') {
                    $query->where(function ($q) {
                        $q->whereIn('ott_platform', ['chorki', 'hoichoi', 'toffee', 'bongo', 'bioscope', 'binge', 'youtube', 'deeptoplay', 'cinemawala', 'cmv'])
                          ->orWhereJsonContains('genres', 'Bangla OTT')
                          ->orWhereJsonContains('genres', 'Bangla Natok');
                    });
                } elseif (in_array($genreLower, ['natok', 'bangla-natok', 'bangla natok', 'telefilm'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Bangla Natok')
                          ->orWhereJsonContains('genres', 'Natok')
                          ->orWhereJsonContains('genres', 'Telefilm')
                          ->orWhere('title', 'LIKE', '%Natok%')
                          ->orWhere('title', 'LIKE', '%নাটক%');
                    });
                } elseif (in_array($genreLower, ['bangla', 'bangla cinema', 'kolkata bangla', 'bengali'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Bangla Cinema')
                          ->orWhereJsonContains('genres', 'Kolkata Bangla')
                          ->orWhereJsonContains('genres', 'Bangla')
                          ->orWhereJsonContains('genres', 'Bangla OTT');
                    });
                } elseif (in_array($genreLower, ['sci-fi & fantasy', 'sci-fi and fantasy', 'sci-fi', 'scifi', 'science fiction', 'fantasy'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Science Fiction')
                          ->orWhereJsonContains('genres', 'Fantasy')
                          ->orWhereJsonContains('genres', 'Sci-Fi')
                          ->orWhereJsonContains('genres', 'Sci-Fi & Fantasy');
                    });
                } elseif (in_array($genreLower, ['crime & mystery', 'crime and mystery', 'crime', 'mystery'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Crime')
                          ->orWhereJsonContains('genres', 'Mystery')
                          ->orWhereJsonContains('genres', 'Crime & Mystery');
                    });
                } elseif (in_array($genreLower, ['box office hits', 'box office', 'box-office', 'blockbuster'])) {
                    $query->where('rating', '>=', 7.5);
                } elseif (in_array($genreLower, ['coming soon', 'upcoming'])) {
                    $query->where('release_date', '>', now()->toDateString());
                } elseif (in_array($genreLower, ['trending now', 'trending'])) {
                    // Handled in sort order below by views desc
                } elseif (in_array($genreLower, ['recently added', 'recently-added'])) {
                    // Handled in sort order below by id desc
                } elseif (in_array($genreLower, ['top 10', 'top-10', 'top watch', 'top-watch', 'top imdb', 'top-imdb', 'imdb top 250'])) {
                    $query->where('rating', '>=', 7.0);
                } elseif (in_array($genreLower, ['south indian', 'south indian movies', 'south movies', 'south', 'tamil/telugu', 'tamil', 'telugu'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'South Indian')
                          ->orWhereJsonContains('genres', 'South Movies')
                          ->orWhereJsonContains('languages', 'Tamil')
                          ->orWhereJsonContains('languages', 'Telugu')
                          ->orWhereJsonContains('languages', 'Malayalam')
                          ->orWhereJsonContains('languages', 'Kannada');
                    });
                } elseif (in_array($genreLower, ['dual audio', 'dual-audio'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Dual Audio')
                          ->orWhere('title', 'LIKE', '%Dual Audio%')
                          ->orWhere('title', 'LIKE', '%Multi Audio%');
                    });
                } elseif (in_array($genreLower, ['bollywood', 'hindi'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Bollywood')
                          ->orWhereJsonContains('genres', 'Hindi Movies')
                          ->orWhereJsonContains('languages', 'Hindi');
                    });
                } elseif (in_array($genreLower, ['hollywood', 'english'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Hollywood')
                          ->orWhereJsonContains('languages', 'English');
                    });
                } elseif (in_array($genreLower, ['k-drama & anime', 'k-drama', 'kdrama', 'anime'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'K-Drama')
                          ->orWhereJsonContains('genres', 'Anime')
                          ->orWhereJsonContains('genres', 'Korean')
                          ->orWhereJsonContains('languages', 'Korean')
                          ->orWhereJsonContains('languages', 'Japanese');
                    });
                } else {
                    $query->whereJsonContains('genres', $genre);
                }
            }

            // Language Filter (supports 'language' or 'lang')
            $langInput = $request->query('language') ?: $request->query('lang');
            if (!empty($langInput)) {
                $lang = trim($langInput);
                $langLower = strtolower($lang);
                if (in_array($langLower, ['bengali', 'bangla'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Bangla Cinema')
                          ->orWhereJsonContains('genres', 'Kolkata Bangla')
                          ->orWhereJsonContains('genres', 'Bangla')
                          ->orWhereJsonContains('genres', 'Bangla OTT');
                    });
                } elseif ($langLower === 'hindi') {
                    $query->where(function ($q) {
                        $q->whereJsonContains('languages', 'Hindi')
                          ->orWhereJsonContains('genres', 'Bollywood')
                          ->orWhereJsonContains('genres', 'Hindi Movies');
                    });
                } elseif ($langLower === 'english') {
                    $query->where(function ($q) {
                        $q->whereJsonContains('languages', 'English')
                          ->orWhereJsonContains('genres', 'Hollywood');
                    });
                } elseif (in_array($langLower, ['south', 'south indian', 'tamil/telugu', 'tamil', 'telugu'])) {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'South Indian')
                          ->orWhereJsonContains('languages', 'Tamil')
                          ->orWhereJsonContains('languages', 'Telugu')
                          ->orWhereJsonContains('languages', 'Malayalam')
                          ->orWhereJsonContains('languages', 'Kannada');
                    });
                } elseif ($langLower === 'korean') {
                    $query->where(function ($q) {
                        $q->whereJsonContains('languages', 'Korean')
                          ->orWhereJsonContains('genres', 'K-Drama')
                          ->orWhereJsonContains('genres', 'Korean');
                    });
                } elseif ($langLower === 'dual audio' || $langLower === 'dual-audio') {
                    $query->where(function ($q) {
                        $q->whereJsonContains('genres', 'Dual Audio')
                          ->orWhere('title', 'LIKE', '%Dual Audio%')
                          ->orWhere('title', 'LIKE', '%Multi Audio%');
                    });
                } else {
                    $query->whereJsonContains('languages', $lang);
                }
            }

            // Quality Filter (e.g. 4K, 1080p, 720p)
            if ($request->filled('quality')) {
                $quality = trim($request->query('quality'));
                if (stripos($quality, '4k') !== false) {
                    $query->where('rating', '>=', 7.5);
                } elseif (stripos($quality, '1080p') !== false) {
                    $query->where(function ($q) {
                        $q->where('title', 'LIKE', '%1080p%')
                          ->orWhereHas('streams', fn ($sq) => $sq->where('server_name', 'LIKE', '%1080p%'));
                    });
                } elseif (stripos($quality, '720p') !== false) {
                    $query->where(function ($q) {
                        $q->where('title', 'LIKE', '%720p%')
                          ->orWhereHas('streams', fn ($sq) => $sq->where('server_name', 'LIKE', '%720p%'));
                    });
                }
            }

            if ($request->filled('platform')) {
                $platforms = array_filter(array_map('trim', explode(',', $request->query('platform'))));
                $query->whereIn('ott_platform', $platforms);
            }

            if ($request->boolean('bangla_ott')) {
                $query->banglaOtt();
            }

            if ($request->filled('year')) {
                $year = $request->query('year');
                if ($year === '2010s') {
                    $query->whereBetween('release_date', ['2010-01-01', '2019-12-31']);
                } else {
                    $query->whereYear('release_date', $year);
                }
            }

            if ($request->boolean('featured')) {
                $query->featured();
            }

            // Dedicated Hero Slider filter
            if ($request->boolean('hero_slider')) {
                $heroMovies = (clone $query)->where('is_hero_slider', true)
                    ->orderBy('hero_order')
                    ->orderByDesc('id')
                    ->take(10)
                    ->get();

                if ($heroMovies->count() < 5) {
                    $existingIds = $heroMovies->pluck('id')->toArray();
                    $additional2026 = Movie::published()
                        ->whereNotIn('id', $existingIds)
                        ->where(function ($q) {
                            $q->whereYear('release_date', '>=', 2026)
                              ->orWhere('release_date', '>=', '2026-01-01');
                        })
                        ->whereNotNull('backdrop_url')
                        ->orderByDesc('rating')
                        ->take(10 - $heroMovies->count())
                        ->get();
                    $heroMovies = $heroMovies->concat($additional2026);
                }

                return MovieResource::collection($heroMovies);
            }

            if ($request->filled('search')) {
                $search = $request->query('search');
                $query->where('title', 'LIKE', "%{$search}%");
            }

            $sort = $request->query('sort', 'latest');
            $genreLower = strtolower($request->query('genre', ''));

            if ($genreLower === 'trending now' || $genreLower === 'trending') {
                $query->orderByDesc('views')->orderByDesc('id');
            } elseif ($genreLower === 'box office hits' || $genreLower === 'box office') {
                $query->where('rating', '>=', 7.5)->orderByDesc('views')->orderByDesc('rating');
            } elseif ($genreLower === 'recently added' || $genreLower === 'recently-added') {
                $query->orderByDesc('id');
            } elseif (in_array($genreLower, ['top 10', 'top-10', 'top watch', 'top-watch', 'top imdb', 'top-imdb', 'imdb top 250'])) {
                $query->where('rating', '>=', 7.0)->orderByDesc('views')->orderByDesc('rating');
            } elseif ($genreLower === 'coming soon' || $genreLower === 'upcoming') {
                $query->where('release_date', '>', now()->toDateString())->orderBy('release_date', 'asc');
            } else {
                match ($sort) {
                    'rating' => $query->orderByDesc('rating')->orderByDesc('release_date'),
                    'popular', 'trending' => $query->orderByDesc('views')->orderByDesc('id'),
                    'oldest' => $query->orderBy('release_date'),
                    'recent', 'latest' => $query->orderByDesc('id'),
                    'release' => $query->whereNotNull('release_date')->orderByDesc('release_date')->orderByDesc('id'),
                    default => $query->orderByDesc('id'),
                };
            }

            $perPage = min((int) $request->query('per_page', 24), 60);
            $movies = $query->paginate($perPage);

            return MovieResource::collection($movies);
        });
    }

    /**
     * Aggregated high-speed catalog payload providing all 16 requested rails in one fast response.
     */
    public function catalog()
    {
        $cacheKey = 'movies_catalog_all_16_rails_v4';

        $data = \Illuminate\Support\Facades\Cache::remember($cacheKey, 60, function () {
            $fields = ['id', 'title', 'slug', 'rating', 'release_date', 'poster_url', 'backdrop_url', 'genres', 'views', 'duration_minutes'];

            // 1. Top 10 Movies To Watch (dynamically traffic-driven by views and high rating >= 7.0)
            $top10 = Movie::published()
                ->select($fields)
                ->where('rating', '>=', 7.0)
                ->orderByDesc('views')
                ->orderByDesc('rating')
                ->take(10)
                ->get();

            // 2. Trending Now (dynamically traffic-driven by views across site)
            $trending = Movie::published()
                ->select($fields)
                ->orderByDesc('views')
                ->orderByDesc('id')
                ->take(18)
                ->get();

            // 3. Recently Added (latest id)
            $recentlyAdded = Movie::published()
                ->select($fields)
                ->orderByDesc('id')
                ->take(18)
                ->get();

            // 4. Box Office Hits (rating >= 7.5 and high views)
            $boxOffice = Movie::published()
                ->select($fields)
                ->where('rating', '>=', 7.5)
                ->orderByDesc('views')
                ->orderByDesc('rating')
                ->take(18)
                ->get();

            // 5. Coming Soon (strictly future unreleased movies: release_date > today)
            $comingSoon = Movie::published()
                ->select($fields)
                ->where('release_date', '>', now()->toDateString())
                ->orderBy('release_date', 'asc')
                ->take(18)
                ->get();

            // Helper for genre query
            $genreQuery = function (array $genres, int $limit = 18) use ($fields) {
                return Movie::published()
                    ->select($fields)
                    ->where(function ($q) use ($genres) {
                        foreach ($genres as $g) {
                            $q->orWhereJsonContains('genres', $g);
                        }
                    })
                    ->orderByDesc('id')
                    ->take($limit)
                    ->get();
            };

            // 6. Action
            $action = $genreQuery(['Action']);

            // 7. Thriller
            $thriller = $genreQuery(['Thriller']);

            // 8. Comedy
            $comedy = $genreQuery(['Comedy']);

            // 9. Bangla Cinema (strictly pure Bangla content from Kolkata Bangla & Dhallywood)
            $bangla = Movie::published()
                ->select($fields)
                ->where(function ($q) {
                    $q->whereJsonContains('genres', 'Bangla Cinema')
                      ->orWhereJsonContains('genres', 'Kolkata Bangla')
                      ->orWhereJsonContains('genres', 'Bangla')
                      ->orWhereJsonContains('genres', 'Bangla OTT');
                })
                ->orderByDesc('id')
                ->take(18)
                ->get();

            // 10. Sci-Fi & Fantasy
            $scifiFantasy = $genreQuery(['Science Fiction', 'Fantasy', 'Sci-Fi', 'Sci-Fi & Fantasy']);

            // 11. Horror
            $horror = $genreQuery(['Horror']);

            // 12. Crime & Mystery
            $crimeMystery = $genreQuery(['Crime', 'Mystery', 'Crime & Mystery']);

            // 13. Romance
            $romance = $genreQuery(['Romance']);

            // 14. Drama
            $drama = $genreQuery(['Drama']);

            // 15. Adventure
            $adventure = $genreQuery(['Adventure']);

            // 16. Animation
            $animation = $genreQuery(['Animation']);

            return [
                'top_10' => MovieResource::collection($top10)->resolve(),
                'trending' => MovieResource::collection($trending)->resolve(),
                'recently_added' => MovieResource::collection($recentlyAdded)->resolve(),
                'box_office' => MovieResource::collection($boxOffice)->resolve(),
                'coming_soon' => MovieResource::collection($comingSoon)->resolve(),
                'action' => MovieResource::collection($action)->resolve(),
                'thriller' => MovieResource::collection($thriller)->resolve(),
                'comedy' => MovieResource::collection($comedy)->resolve(),
                'bangla' => MovieResource::collection($bangla)->resolve(),
                'scifi_fantasy' => MovieResource::collection($scifiFantasy)->resolve(),
                'horror' => MovieResource::collection($horror)->resolve(),
                'crime_mystery' => MovieResource::collection($crimeMystery)->resolve(),
                'romance' => MovieResource::collection($romance)->resolve(),
                'drama' => MovieResource::collection($drama)->resolve(),
                'adventure' => MovieResource::collection($adventure)->resolve(),
                'animation' => MovieResource::collection($animation)->resolve(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Single movie details with all stream servers and related movies.
     */
    public function show(string $slug)
    {
        $cacheKey = "movie_show_payload_" . md5($slug);

        $cached = \Illuminate\Support\Facades\Cache::get($cacheKey);
        if ($cached) {
            return $cached;
        }

        $movie = Movie::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->with(['streams' => fn ($q) => $q->orderBy('priority')])
            ->firstOrFail();

        // Increment views safely
        $movie->increment('views');

        // On-demand credits enrichment: if cast or director is missing, fetch from TMDB
        if ($movie->tmdb_id && (empty($movie->cast) || empty($movie->director))) {
            try {
                $tmdb = app(\App\Services\TmdbService::class);
                $details = $tmdb->getMovieDetails($movie->tmdb_id);
                if (!empty($details['id'])) {
                    $cast = $tmdb->extractCast($details);
                    $dirInfo = $tmdb->extractDirector($details);
                    $langs = $tmdb->extractLanguages($details);
                    $trailer = $movie->trailer_url ?: $tmdb->extractTrailerUrl($details);

                    $updateData = [];
                    if (empty($movie->cast) && !empty($cast)) $updateData['cast'] = $cast;
                    if (empty($movie->director) && !empty($dirInfo['director'])) {
                        $updateData['director'] = $dirInfo['director'];
                        $updateData['director_avatar'] = $dirInfo['director_avatar'];
                    }
                    if (empty($movie->languages) && !empty($langs)) $updateData['languages'] = $langs;
                    if (!$movie->trailer_url && $trailer) $updateData['trailer_url'] = $trailer;

                    if (!empty($updateData)) {
                        $movie->update($updateData);
                        $movie->refresh();
                    }
                }
            } catch (\Throwable) {
                // Silently continue if TMDB is unreachable
            }
        }

        // Fetch related movies by matching first genre
        $firstGenre = !empty($movie->genres) && is_array($movie->genres) ? $movie->genres[0] : null;
        $related = [];
        if ($firstGenre) {
            $related = Movie::published()
                ->where('id', '!=', $movie->id)
                ->whereJsonContains('genres', $firstGenre)
                ->take(8)
                ->get();
        }

        $response = (new MovieResource($movie))->additional([
            'related' => MovieResource::collection($related),
        ]);

        if (!empty($movie->cast)) {
            \Illuminate\Support\Facades\Cache::put($cacheKey, $response, 60);
        }

        return $response;
    }
}
