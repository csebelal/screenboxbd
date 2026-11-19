<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovieStream extends Model
{
    use HasFactory;

    protected $fillable = [
        'movie_id',
        'server_name',
        'stream_type',
        'stream_url',
        'quality',
        'priority',
    ];

    protected $casts = [
        'priority' => 'integer',
    ];

    public function movie(): BelongsTo
    {
        return $this->belongsTo(Movie::class);
    }
}
