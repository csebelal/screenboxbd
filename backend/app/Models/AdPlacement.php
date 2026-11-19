<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdPlacement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slot_key',
        'ad_type',
        'code_content',
        'banner_image_url',
        'target_url',
        'is_active',
        'countdown_seconds',
        'cloaking_mode',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'countdown_seconds' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
