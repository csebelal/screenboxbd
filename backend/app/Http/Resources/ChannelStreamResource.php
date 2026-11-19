<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChannelStreamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $proxyUrl = url('/api/v1/stream/proxy') . '?url=' . urlencode($this->stream_url);

        return [
            'id' => $this->id,
            'server_name' => $this->server_name,
            'stream_url' => $this->stream_url,
            'proxy_url' => $proxyUrl,
            'priority' => $this->priority,
            'is_active' => $this->is_active,
        ];
    }
}
