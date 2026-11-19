<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EpisodeStream extends Model
{
    use HasFactory;

    protected $fillable = [
        'episode_id',
        'server_name',
        'stream_type',
        'stream_url',
        'quality',
        'priority',
    ];

    protected $casts = [
        'priority' => 'integer',
    ];

    public function episode(): BelongsTo
    {
        return $this->belongsTo(Episode::class);
    }
}
