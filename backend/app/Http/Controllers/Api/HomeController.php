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
     */
    public function index()
    {
        // Cache home payload for 60 seconds to ensure high concurrency response under 20ms
        $data = Cache::remember('api_home_payload', 60, function () {
            $heroMovies = Movie::published()
                ->whereNotNull('backdrop_url')
                ->orderByDesc('rating')
                ->take(5)
                ->get();

            $featuredChannels = Channel::active()
                ->with(['category', 'streams' => fn ($q) => $q->where('is_active', true)->orderBy('priority')])
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->take(16)
                ->get();

            $trendingMovies = Movie::published()
                ->with('streams')
                ->orderByDesc('views')
                ->orderByDesc('release_date')
                ->take(12)
                ->get();

            $latestMovies = Movie::published()
                ->with('streams')
                ->orderByDesc('release_date')
                ->take(12)
                ->get();

            $banglaOttMovies = Movie::published()
                ->banglaOtt()
                ->with('streams')
                ->orderByDesc('rating')
                ->orderByDesc('views')
                ->take(16)
                ->get();

            $popularSeries = Series::published()
                ->withCount('seasons')
                ->orderByDesc('views')
                ->take(8)
                ->get();

            $categories = Category::orderBy('sort_order')
                ->withCount('channels')
                ->take(12)
                ->get();

            return [
                'hero' => MovieResource::collection($heroMovies),
                'featured_channels' => ChannelResource::collection($featuredChannels),
                'bangla_ott_originals' => MovieResource::collection($banglaOttMovies),
                'trending_movies' => MovieResource::collection($trendingMovies),
                'latest_movies' => MovieResource::collection($latestMovies),
                'popular_series' => SeriesResource::collection($popularSeries),
                'categories' => CategoryResource::collection($categories),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
