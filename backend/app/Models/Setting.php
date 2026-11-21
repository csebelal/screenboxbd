<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'label',
        'description',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('app_public_settings');
            Cache::forget('api_home_payload');
        });

        static::deleted(function () {
            Cache::forget('app_public_settings');
            Cache::forget('api_home_payload');
        });
    }

    /**
     * Get a setting value by key with optional default fallback
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (!$setting || $setting->value === null) {
            return $default;
        }

        if ($setting->type === 'boolean') {
            return filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
        }

        if ($setting->type === 'number') {
            return is_numeric($setting->value) ? (float) $setting->value : $default;
        }

        if ($setting->type === 'json') {
            return json_decode($setting->value, true) ?: $default;
        }

        return $setting->value;
    }

    /**
     * Set a setting value by key
     */
    public static function set(string $key, mixed $value, string $group = 'general'): self
    {
        if (is_array($value)) {
            $value = json_encode($value);
        } elseif (is_bool($value)) {
            $value = $value ? '1' : '0';
        }

        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
            ]
        );
    }

    /**
     * Retrieve all public settings formatted as a key-value associative array
     */
    public static function getAllPublic(): array
    {
        return Cache::remember('app_public_settings', 300, function () {
            $settings = static::where('is_public', true)->get();
            $result = [];
            foreach ($settings as $setting) {
                $val = $setting->value;
                if ($setting->type === 'boolean') {
                    $val = filter_var($val, FILTER_VALIDATE_BOOLEAN);
                } elseif ($setting->type === 'number') {
                    $val = is_numeric($val) ? (float) $val : 0;
                } elseif ($setting->type === 'json') {
                    $val = json_decode($val, true);
                }
                $result[$setting->key] = $val;
            }
            return $result;
        });
    }
}
