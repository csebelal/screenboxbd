<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'badge',
        'monthly_price',
        'half_yearly_price',
        'yearly_price',
        'currency',
        'features',
        'highlight',
        'is_active',
        'sort_order',
        'checkout_url',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'highlight' => 'boolean',
            'is_active' => 'boolean',
            'monthly_price' => 'integer',
            'half_yearly_price' => 'integer',
            'yearly_price' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
