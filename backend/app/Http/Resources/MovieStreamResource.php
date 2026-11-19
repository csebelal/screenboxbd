<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieStreamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $proxyUrl = $this->stream_type === 'hls'
            ? url('/api/v1/stream/proxy') . '?url=' . urlencode($this->stream_url)
            : null;

        return [
            'id' => $this->id,
            'server_name' => $this->server_name,
            'stream_type' => $this->stream_type,
            'stream_url' => $this->stream_url,
            'proxy_url' => $proxyUrl,
            'quality' => $this->quality,
            'priority' => $this->priority,
        ];
    }
}
