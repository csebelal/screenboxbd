<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    /**
     * Paginated movies list with genre, search, and sorting filters.
     */
    public function index(Request $request)
    {
        $cacheKey = 'movies_index_' . md5($request->fullUrl());
        
        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Movie::query()->published();

            if ($request->boolean('with_streams')) {
                $query->with('streams');
            }

        if ($request->filled('genre')) {
            $genre = $request->query('genre');
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
            } else {
                $query->whereJsonContains('genres', $genre);
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
            $query->whereYear('release_date', $request->query('year'));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Dedicated Hero Slider filter: fetches admin-selected slides, falling back to 2026 trending titles
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
        match ($sort) {
            'rating' => $query->orderByDesc('rating')->orderByDesc('release_date'),
            'popular' => $query->orderByDesc('views'),
            'oldest' => $query->orderBy('release_date'),
            'recent' => $query->orderByDesc('id'),
            'release' => $query->whereNotNull('release_date')->orderByDesc('release_date')->orderByDesc('id'),
            default => $query->orderByDesc('id'),
        };

        $perPage = min((int) $request->query('per_page', 24), 60);
        $movies = $query->paginate($perPage);

        return MovieResource::collection($movies);
    });
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
