<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Channel;
use App\Models\Movie;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sportsCategory = Category::where('slug', 'sports')->first();
        $newsCategory = Category::where('slug', 'news')->first();
        $entCategory = Category::where('slug', 'entertainment')->first();

        // 1. Sample Live TV Channels with Streams
        if ($sportsCategory) {
            $tsports = Channel::updateOrCreate(
                ['slug' => 't-sports-hd'],
                [
                    'category_id' => $sportsCategory->id,
                    'name' => 'T Sports HD',
                    'logo_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/T_Sports_logo.svg/320px-T_Sports_logo.svg.png',
                    'country' => 'BD',
                    'is_active' => true,
                    'is_featured' => true,
                    'sort_order' => 1,
                ]
            );

            $tsports->streams()->delete();
            $tsports->streams()->createMany([
                [
                    'server_name' => 'Server 1 (BDIX Ultra Fast)',
                    'stream_url' => 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                    'headers' => ['User-Agent' => 'Mozilla/5.0', 'Referer' => 'https://tsports.com/'],
                    'is_active' => true,
                    'priority' => 1,
                ],
                [
                    'server_name' => 'Server 2 (Backup Stream)',
                    'stream_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    'headers' => null,
                    'is_active' => true,
                    'priority' => 2,
                ],
            ]);
        }

        if ($newsCategory) {
            $somoy = Channel::updateOrCreate(
                ['slug' => 'somoy-tv-hd'],
                [
                    'category_id' => $newsCategory->id,
                    'name' => 'Somoy TV HD',
                    'logo_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Somoy_TV_logo.png/320px-Somoy_TV_logo.png',
                    'country' => 'BD',
                    'is_active' => true,
                    'is_featured' => true,
                    'sort_order' => 2,
                ]
            );

            $somoy->streams()->delete();
            $somoy->streams()->create([
                'server_name' => 'Server 1 (Primary HLS)',
                'stream_url' => 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                'headers' => null,
                'is_active' => true,
                'priority' => 1,
            ]);
        }

        if ($entCategory) {
            $btv = Channel::updateOrCreate(
                ['slug' => 'btv-world'],
                [
                    'category_id' => $entCategory->id,
                    'name' => 'BTV World',
                    'logo_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/BTV_World_Logo.svg/320px-BTV_World_Logo.svg.png',
                    'country' => 'BD',
                    'is_active' => true,
                    'is_featured' => false,
                    'sort_order' => 3,
                ]
            );

            $btv->streams()->delete();
            $btv->streams()->create([
                'server_name' => 'Server 1 (National Feed)',
                'stream_url' => 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                'headers' => null,
                'is_active' => true,
                'priority' => 1,
            ]);
        }
    }
}
