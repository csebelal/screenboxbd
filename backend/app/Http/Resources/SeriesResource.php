<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeriesResource extends JsonResource
{
    public function toArray(Request $request): array
    {
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
            'first_air_date' => $this->first_air_date?->format('Y-m-d'),
            'release_year' => $this->first_air_date?->format('Y'),
            'rating' => (float) $this->rating,
            'genres' => $this->genres ?: [],
            'cast' => $this->cast ?: [],
            'director' => $this->director,
            'director_avatar' => $this->director_avatar,
            'languages' => $this->languages ?: [],
            'is_featured' => (bool) $this->is_featured,
            'views' => (int) $this->views,
            'seasons_count' => $this->whenCounted('seasons'),
            'seasons' => SeasonResource::collection($this->whenLoaded('seasons')),
            'download_sources' => $this->download_sources ?: [],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
