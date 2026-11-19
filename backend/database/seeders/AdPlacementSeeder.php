<?php

namespace Database\Seeders;

use App\Models\AdPlacement;
use Illuminate\Database\Seeder;

class AdPlacementSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            [
                'title' => 'Top Betting Sponsor Bar',
                'slot_key' => 'betting_sponsor_1',
                'ad_type' => 'banner_image',
                'code_content' => null,
                'banner_image_url' => 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80',
                'target_url' => 'https://1xbet.com/?tag=streamtv',
                'is_active' => true,
                'countdown_seconds' => 15,
                'cloaking_mode' => 'show_all',
            ],
            [
                'title' => 'Player Top Leaderboard Banner (728x90)',
                'slot_key' => 'player_above',
                'ad_type' => 'html_code',
                'code_content' => '<div style="background:#1e293b; color:#94a3b8; text-align:center; padding:12px; border-radius:8px; font-size:12px; border:1px dashed #475569;">[AD SLOT: 728x90 Leaderboard / Adsterra Banner Banner Placeholder]</div>',
                'banner_image_url' => null,
                'target_url' => null,
                'is_active' => true,
                'countdown_seconds' => 15,
                'cloaking_mode' => 'show_all',
            ],
            [
                'title' => 'Player Bottom Banner (Responsive)',
                'slot_key' => 'player_below',
                'ad_type' => 'html_code',
                'code_content' => '<div style="background:#18181b; color:#71717a; text-align:center; padding:14px; border-radius:8px; font-size:12px; border:1px dashed #3f3f46;">[AD SLOT: Player Bottom Banner / Monetag Native Banner]</div>',
                'banner_image_url' => null,
                'target_url' => null,
                'is_active' => true,
                'countdown_seconds' => 15,
                'cloaking_mode' => 'show_all',
            ],
            [
                'title' => 'Safe Gateway Countdown Page Ads',
                'slot_key' => 'countdown_page',
                'ad_type' => 'html_code',
                'code_content' => '<div style="background:#18181b; color:#22c55e; text-align:center; padding:20px; border-radius:12px; font-weight:bold; border:1px solid #27272a;">[HIGH REVENUE AD: 300x250 Rectangle / Adsterra / Google Safe Ad]</div>',
                'banner_image_url' => null,
                'target_url' => null,
                'is_active' => true,
                'countdown_seconds' => 15,
                'cloaking_mode' => 'show_all',
            ],
        ];

        foreach ($defaults as $ad) {
            AdPlacement::firstOrCreate(['slot_key' => $ad['slot_key']], $ad);
        }
    }
}
