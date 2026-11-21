<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Setting::updateOrCreate(
            ['key' => 'enable_subscriptions'],
            [
                'value' => '0', // Disabled/Hidden by default as requested
                'group' => 'monetization',
                'type' => 'boolean',
                'label' => 'Enable Subscriptions & Pricing Plans (প্যাকেজ ও সাবস্ক্রিপশন চালু/বন্ধ)',
                'description' => 'সক্রিয় (1) থাকলে হোমপেজের প্রাইসিং/প্যাকেজ সেকশন এবং মেনু বারের Subscription লিংক দেখাবে। নিষ্ক্রিয় (0) থাকলে হোমপেজ ও মেনু বার থেকে সাবস্ক্রিপশন সম্পূর্ণ হাইড থাকবে।',
                'is_public' => true,
            ]
        );

        Cache::forget('app_public_settings');
        Cache::forget('api_home_payload');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Setting::where('key', 'enable_subscriptions')->delete();
        Cache::forget('app_public_settings');
        Cache::forget('api_home_payload');
    }
};
