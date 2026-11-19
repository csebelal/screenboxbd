<?php

namespace App\Http\Resources;

use App\Services\EmbedResolverService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EpisodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $resolvedStreams = [];

        // Check if DB streams are loaded
        if ($this->relationLoaded('streams') && $this->streams) {
            foreach ($this->streams as $s) {
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

        // Auto-resolve 3rd-party embed servers for TV episode
        $season = $this->relationLoaded('season') ? $this->season : $this->season()->with('series')->first();
        $series = $season?->series;
        $seriesTmdbId = $series?->tmdb_id;
        $seasonNumber = $season?->season_number ?? 1;

        if ($seriesTmdbId) {
            $resolver = app(EmbedResolverService::class);
            $embeds = $resolver->getEpisodeEmbedServers(
                $seriesTmdbId,
                $seasonNumber,
                $this->episode_number,
                $series?->imdb_id
            );
            $resolvedStreams = array_merge($resolvedStreams, $embeds);
        }

        return [
            'id' => $this->id,
            'season_id' => $this->season_id,
            'season_number' => $seasonNumber,
            'episode_number' => $this->episode_number,
            'title' => $this->title,
            'overview' => $this->overview,
            'still_url' => $this->still_url,
            'duration_minutes' => $this->duration_minutes,
            'streams' => $resolvedStreams,
            'download_sources' => $this->download_sources ?: [],
        ];
    }
}
