<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'season_number' => $this->season_number,
            'name' => $this->name,
            'overview' => $this->overview,
            'poster_url' => $this->poster_url,
            'episodes_count' => $this->whenCounted('episodes'),
            'episodes' => EpisodeResource::collection($this->whenLoaded('episodes')),
        ];
    }
}
