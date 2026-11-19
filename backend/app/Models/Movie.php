<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Movie extends Model
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
        'release_date',
        'duration_minutes',
        'rating',
        'genres',
        'cast',
        'director',
        'director_avatar',
        'languages',
        'is_published',
        'is_featured',
        'is_hero_slider',
        'hero_order',
        'views',
        'download_sources',
    ];

    protected $casts = [
        'tmdb_id' => 'integer',
        'release_date' => 'date',
        'duration_minutes' => 'integer',
        'rating' => 'decimal:1',
        'genres' => 'array',
        'cast' => 'array',
        'languages' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'is_hero_slider' => 'boolean',
        'hero_order' => 'integer',
        'views' => 'integer',
        'download_sources' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Movie $movie) {
            if (empty($movie->slug)) {
                $movie->slug = Str::slug($movie->title);
            }
        });
    }

    public function streams(): HasMany
    {
        return $this->hasMany(MovieStream::class)->orderBy('priority');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeHeroSlider(Builder $query): Builder
    {
        return $query->where('is_hero_slider', true)->orderBy('hero_order')->orderByDesc('id');
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
