<?php

namespace App\Http\Resources;

use App\Services\EmbedResolverService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $resolvedStreams = [];
        $seenUrls = [];

        // Check if database streams are loaded (BDIX, Local ISP, YouTube, Direct MP4)
        if ($this->relationLoaded('streams') && $this->streams) {
            foreach ($this->streams as $s) {
                // Ignore any legacy dummy test streams
                if (str_contains($s->stream_url, 'test-streams.mux.dev') ||
                    str_contains($s->stream_url, 'BigBuckBunny') ||
                    str_contains($s->stream_url, 'akamaized.net')) {
                    continue;
                }

                $cleanUrl = strtolower(trim($s->stream_url));
                if (isset($seenUrls[$cleanUrl])) {
                    continue;
                }
                $seenUrls[$cleanUrl] = true;

                $resolvedStreams[] = [
                    'id' => $s->id,
                    'server_name' => $s->server_name,
                    'stream_type' => $s->stream_type,
                    'stream_url' => $s->stream_url,
                    'proxy_url' => $s->stream_type === 'hls' ? url('/api/v1/stream/proxy') . '?url=' . urlencode($s->stream_url) : null,
                    'quality' => $s->quality,
                    'priority' => $s->priority,
                    'is_embed' => $s->stream_type === 'embed',
                ];
            }
        }

        // Auto-append multi-server 3rd-party embed sources on single movie view or when explicitly requested
        if ($this->tmdb_id && ($request->routeIs('*.show') || $request->boolean('with_embeds') || $request->is('*movies/*'))) {
            $resolver = app(EmbedResolverService::class);
            $embeds = $resolver->getMovieEmbedServers($this->tmdb_id, $this->imdb_id);
            foreach ($embeds as $srv) {
                $cleanUrl = strtolower(trim($srv['stream_url']));
                if (!isset($seenUrls[$cleanUrl])) {
                    $seenUrls[$cleanUrl] = true;
                    $resolvedStreams[] = $srv;
                }
            }
        }

        return [
            'id' => $this->id,
            'tmdb_id' => $this->tmdb_id,
            'imdb_id' => $this->imdb_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'ott_platform' => $this->ott_platform,
            'overview' => $this->overview,
            'poster_url' => $this->poster_url,
            'backdrop_url' => $this->backdrop_url,
            'trailer_url' => $this->trailer_url,
            'release_date' => $this->release_date?->format('Y-m-d'),
            'release_year' => $this->release_date?->format('Y'),
            'duration_minutes' => $this->duration_minutes,
            'rating' => (float) $this->rating,
            'genres' => $this->genres ?: [],
            'cast' => $this->cast ?: [],
            'director' => $this->director,
            'director_avatar' => $this->director_avatar,
            'languages' => $this->languages ?: [],
            'is_featured' => (bool) $this->is_featured,
            'is_hero_slider' => (bool) $this->is_hero_slider,
            'hero_order' => (int) $this->hero_order,
            'views' => (int) $this->views,
            'streams' => $resolvedStreams,
            'download_sources' => $this->download_sources ?: [],
            'download_gateway_url' => "/download/{$this->id}",
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
