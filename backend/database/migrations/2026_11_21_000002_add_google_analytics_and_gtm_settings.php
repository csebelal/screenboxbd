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
        $settings = [
            [
                'key' => 'google_analytics_enabled',
                'value' => '1',
                'group' => 'analytics',
                'type' => 'boolean',
                'label' => 'Enable Google Analytics & GTM Tracking (অ্যানালিটিক্স ট্র্যাকিং চালু/বন্ধ)',
                'description' => 'সক্রিয় (1) থাকলে Google Analytics ও Google Tag Manager সাইটে লোড হবে। ট্র্যাকিং সাময়িকভাবে বন্ধ রাখতে চাইলে এটি 0 করুন।',
                'is_public' => true,
            ],
            [
                'key' => 'google_tag_manager_id',
                'value' => 'GTM-T4M9PSPK',
                'group' => 'analytics',
                'type' => 'text',
                'label' => 'Google Tag Manager (GTM) Container ID',
                'description' => 'Google Tag Manager কন্টেইনার আইডি (যেমন: GTM-T4M9PSPK)। এটি বসালে অটোমেটিকভাবে gtm.js ও dataLayer লোড হবে।',
                'is_public' => true,
            ],
            [
                'key' => 'google_analytics_id',
                'value' => '',
                'group' => 'analytics',
                'type' => 'text',
                'label' => 'Google Analytics (GA4) Measurement ID',
                'description' => 'ঐচ্ছিক GA4 Measurement ID (যেমন: G-XXXXXXXXXX)। সরাসরি GA4 gtag কনফিগারেশনের জন্য।',
                'is_public' => true,
            ],
            [
                'key' => 'custom_header_scripts',
                'value' => '',
                'group' => 'analytics',
                'type' => 'textarea',
                'label' => 'Custom Header Scripts / Head Tracking Code',
                'description' => 'অতিরিক্ত যেকোনো কাস্টম ট্র্যাকিং স্ক্রিপ্ট, মেটা ভেরিফিকেশন কোড বা ফেসবুক পিক্সেল কোড যা <head> এ বসবে।',
                'is_public' => true,
            ],
            [
                'key' => 'custom_footer_scripts',
                'value' => '',
                'group' => 'analytics',
                'type' => 'textarea',
                'label' => 'Custom Footer Scripts / Body End Code',
                'description' => 'অতিরিক্ত যেকোনো কাস্টম স্ক্রিপ্ট বা চ্যাট উইজেট কোড যা <body> এর একদম শেষে বসবে।',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        Cache::forget('app_public_settings');
        Cache::forget('api_home_payload');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Setting::whereIn('key', [
            'google_analytics_enabled',
            'google_tag_manager_id',
            'google_analytics_id',
            'custom_header_scripts',
            'custom_footer_scripts',
        ])->delete();

        Cache::forget('app_public_settings');
        Cache::forget('api_home_payload');
    }
};
