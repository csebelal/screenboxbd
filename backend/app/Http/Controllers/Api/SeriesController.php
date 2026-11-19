<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EpisodeResource;
use App\Http\Resources\SeriesResource;
use App\Models\Episode;
use App\Models\Series;
use Illuminate\Http\Request;

class SeriesController extends Controller
{
    /**
     * Paginated TV series list.
     */
    public function index(Request $request)
    {
        $query = Series::query()->published()->withCount('seasons');

        if ($request->filled('genre')) {
            $genre = $request->query('genre');
            $genreLower = strtolower($genre);
            if ($genreLower === 'bangla-ott' || $genreLower === 'bangla ott') {
                $query->where(function ($q) {
                    $q->whereIn('ott_platform', ['chorki', 'hoichoi', 'toffee', 'bongo', 'bioscope', 'binge', 'youtube', 'deeptoplay', 'cinemawala', 'cmv'])
                      ->orWhereJsonContains('genres', 'Bangla OTT')
                      ->orWhereJsonContains('genres', 'Bangla Natok');
                });
            } elseif (in_array($genreLower, ['natok', 'bangla-natok', 'bangla natok', 'drama serial', 'serial'])) {
                $query->where(function ($q) {
                    $q->whereJsonContains('genres', 'Bangla Natok')
                      ->orWhereJsonContains('genres', 'Drama Serial')
                      ->orWhereJsonContains('genres', 'Natok')
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

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->filled('search')) {
            $query->where('title', 'ILIKE', '%' . $request->query('search') . '%');
        }

        $perPage = min((int) $request->query('per_page', 24), 60);
        $series = $query->orderByDesc('id')->paginate($perPage);

        return SeriesResource::collection($series);
    }

    /**
     * Single series details with seasons and episodes.
     */
    public function show(string $slug)
    {
        $cacheKey = "series_show_payload_" . md5($slug);

        $cached = \Illuminate\Support\Facades\Cache::get($cacheKey);
        if ($cached) {
            return $cached;
        }

        $series = Series::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->with(['seasons.episodes' => fn ($q) => $q->orderBy('episode_number')])
            ->firstOrFail();

        $series->increment('views');

        // On-demand credits enrichment: if cast or director is missing, fetch from TMDB
        if ($series->tmdb_id && (empty($series->cast) || empty($series->director))) {
            try {
                $tmdb = app(\App\Services\TmdbService::class);
                $details = $tmdb->getTvSeriesDetails($series->tmdb_id);
                if (!empty($details['id'])) {
                    $cast = $tmdb->extractCast($details);
                    $dirInfo = $tmdb->extractDirector($details);
                    $langs = $tmdb->extractLanguages($details);
                    $trailer = $series->trailer_url ?: $tmdb->extractTrailerUrl($details);

                    $updateData = [];
                    if (empty($series->cast) && !empty($cast)) $updateData['cast'] = $cast;
                    if (empty($series->director) && !empty($dirInfo['director'])) {
                        $updateData['director'] = $dirInfo['director'];
                        $updateData['director_avatar'] = $dirInfo['director_avatar'];
                    }
                    if (empty($series->languages) && !empty($langs)) $updateData['languages'] = $langs;
                    if (!$series->trailer_url && $trailer) $updateData['trailer_url'] = $trailer;

                    if (!empty($updateData)) {
                        $series->update($updateData);
                        $series->refresh();
                    }
                }
            } catch (\Throwable) {
                // Silently continue if TMDB is unreachable
            }
        }

        $res = new SeriesResource($series);

        if (!empty($series->cast)) {
            \Illuminate\Support\Facades\Cache::put($cacheKey, $res, 60);
        }

        return $res;
    }

    /**
     * Single episode details with streaming servers.
     */
    public function episode(int $id)
    {
        $episode = Episode::with(['streams' => fn ($q) => $q->orderBy('priority')])
            ->findOrFail($id);

        return new EpisodeResource($episode);
    }
}
