<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ChannelResource;
use App\Http\Resources\MovieResource;
use App\Http\Resources\SeriesResource;
use App\Models\Category;
use App\Models\Channel;
use App\Models\Movie;
use App\Models\Series;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    /**
     * Aggregated home page payload for instant Next.js rendering.
     * Guarantees distinct, non-overlapping movies across each dynamic rail.
     */
    public function index()
    {
        // Cache home payload for 30 seconds to ensure high concurrency response under 20ms
        $data = Cache::remember('api_home_payload', 30, function () {
            $usedMovieIds = [];

            // 1. Hero Cinematic Showcase (Slider selections, high-rated with backdrops)
            $heroMovies = Movie::published()
                ->where('is_hero_slider', true)
                ->orderBy('hero_order')
                ->take(6)
                ->get();

            if ($heroMovies->count() < 5) {
                $additionalHero = Movie::published()
                    ->whereNotIn('id', $heroMovies->pluck('id'))
                    ->whereNotNull('backdrop_url')
                    ->orderByDesc('rating')
                    ->orderByDesc('id')
                    ->take(6 - $heroMovies->count())
                    ->get();
                $heroMovies = $heroMovies->concat($additionalHero);
            }

            // 2. Top 10 Movies To Watch (Highest rated / top viewed trending blockbusters)
            $top10Movies = Movie::published()
                ->with('streams')
                ->whereNotNull('poster_url')
                ->orderByDesc('rating')
                ->orderByDesc('views')
                ->orderByDesc('id')
                ->take(10)
                ->get();

            $usedMovieIds = array_merge($usedMovieIds, $top10Movies->pluck('id')->toArray());

            // 3. Popular Movies (Popular / high views, strictly excluding Top 10)
            $popularMovies = Movie::published()
                ->with('streams')
                ->whereNotNull('poster_url')
                ->whereNotIn('id', $usedMovieIds)
                ->orderByDesc('views')
                ->orderByDesc('rating')
                ->orderByDesc('id')
                ->take(16)
                ->get();

            $usedMovieIds = array_merge($usedMovieIds, $popularMovies->pluck('id')->toArray());

            // 4. Latest 2026 Releases (Newly released, excluding Top 10 & Popular)
            $latestMovies = Movie::published()
                ->with('streams')
                ->whereNotNull('poster_url')
                ->whereNotIn('id', $usedMovieIds)
                ->whereYear('release_date', '>=', 2025)
                ->orderByDesc('release_date')
                ->orderByDesc('id')
                ->take(16)
                ->get();

            $usedMovieIds = array_merge($usedMovieIds, $latestMovies->pluck('id')->toArray());

            // 5. Action & Thriller Blockbusters (Genre: Action, Adventure, Thriller)
            $actionMovies = Movie::published()
                ->with('streams')
                ->whereNotNull('poster_url')
                ->whereNotIn('id', $usedMovieIds)
                ->where(function ($q) {
                    $q->whereJsonContains('genres', 'Action')
                      ->orWhereJsonContains('genres', 'Adventure')
                      ->orWhereJsonContains('genres', 'Thriller');
                })
                ->orderByDesc('rating')
                ->orderByDesc('id')
                ->take(16)
                ->get();

            $usedMovieIds = array_merge($usedMovieIds, $actionMovies->pluck('id')->toArray());

            // 6. Bollywood & Hindi Cinema Hits
            $bollywoodMovies = Movie::published()
                ->with('streams')
                ->whereNotNull('poster_url')
                ->whereNotIn('id', $usedMovieIds)
                ->where(function ($q) {
                    $q->whereJsonContains('languages', 'Hindi')
                      ->orWhereJsonContains('genres', 'Bollywood');
                })
                ->orderByDesc('rating')
                ->orderByDesc('id')
                ->take(16)
                ->get();

            $usedMovieIds = array_merge($usedMovieIds, $bollywoodMovies->pluck('id')->toArray());

            // 7. Animation & Family Universe
            $animationMovies = Movie::published()
                ->with('streams')
                ->whereNotNull('poster_url')
                ->where(function ($q) {
                    $q->whereJsonContains('genres', 'Animation')
                      ->orWhereJsonContains('genres', 'Family');
                })
                ->orderByDesc('rating')
                ->orderByDesc('id')
                ->take(16)
                ->get();

            // 8. Bangla OTT Originals & Natok
            $banglaOttMovies = Movie::published()
                ->banglaOtt()
                ->with('streams')
                ->orderByDesc('rating')
                ->orderByDesc('views')
                ->take(16)
                ->get();

            // 9. Popular TV & Web Series
            $popularSeries = Series::published()
                ->withCount('seasons')
                ->orderByDesc('views')
                ->take(12)
                ->get();

            // 10. Featured Live TV Channels
            $featuredChannels = Channel::active()
                ->with(['category', 'streams' => fn ($q) => $q->where('is_active', true)->orderBy('priority')])
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->take(20)
                ->get();

            $categories = Category::orderBy('sort_order')
                ->withCount('channels')
                ->take(12)
                ->get();

            return [
                'hero' => MovieResource::collection($heroMovies),
                'top_10' => MovieResource::collection($top10Movies),
                'popular_movies' => MovieResource::collection($popularMovies),
                'trending_movies' => MovieResource::collection($popularMovies), // backward compatibility
                'latest_movies' => MovieResource::collection($latestMovies),
                'action_movies' => MovieResource::collection($actionMovies),
                'bollywood_movies' => MovieResource::collection($bollywoodMovies),
                'animation_movies' => MovieResource::collection($animationMovies),
                'bangla_ott_originals' => MovieResource::collection($banglaOttMovies),
                'popular_series' => SeriesResource::collection($popularSeries),
                'featured_channels' => ChannelResource::collection($featuredChannels),
                'categories' => CategoryResource::collection($categories),
                'settings' => \App\Models\Setting::getAllPublic(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
