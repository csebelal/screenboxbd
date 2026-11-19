<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChannelStream extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel_id',
        'server_name',
        'stream_url',
        'headers',
        'is_active',
        'priority',
    ];

    protected $casts = [
        'headers' => 'array',
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channel::class);
    }
}
