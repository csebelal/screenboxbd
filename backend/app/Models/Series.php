<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Series extends Model
{
    use HasFactory;

    protected $fillable = [
        'tmdb_id',
        'imdb_id',
        'title',
        'slug',
        'ott_platform',
        'overview',
        'poster_url',
        'backdrop_url',
        'trailer_url',
        'first_air_date',
        'rating',
        'genres',
        'cast',
        'director',
        'director_avatar',
        'languages',
        'is_published',
        'is_featured',
        'views',
        'download_sources',
    ];

    protected $casts = [
        'tmdb_id' => 'integer',
        'first_air_date' => 'date',
        'rating' => 'decimal:1',
        'genres' => 'array',
        'cast' => 'array',
        'languages' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'views' => 'integer',
        'download_sources' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Series $series) {
            if (empty($series->slug)) {
                $series->slug = Str::slug($series->title);
            }
        });
    }

    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class)->orderBy('season_number');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeOttPlatform(Builder $query, string $platform): Builder
    {
        return $query->where('ott_platform', $platform);
    }

    public function scopeBanglaOtt(Builder $query): Builder
    {
        return $query->whereIn('ott_platform', ['chorki', 'hoichoi', 'toffee', 'bongo', 'bioscope', 'binge', 'youtube', 'deeptoplay', 'cinemawala', 'cmv']);
    }
}
