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

        // 2. Sample Movies with Streams
        $movie1 = Movie::updateOrCreate(
            ['slug' => 'inception-2010'],
            [
                'tmdb_id' => 27205,
                'title' => 'Inception',
                'overview' => 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception".',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
                'release_date' => '2010-07-16',
                'duration_minutes' => 148,
                'rating' => 8.8,
                'genres' => ['Action', 'Sci-Fi', 'Adventure'],
                'is_published' => true,
                'is_featured' => true,
                'views' => 1250,
            ]
        );

        $movie1->streams()->delete();
        $movie1->streams()->createMany([
            [
                'server_name' => 'Server 1 (HLS Multi-Quality)',
                'stream_type' => 'hls',
                'stream_url' => 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                'quality' => '1080p',
                'priority' => 1,
            ],
            [
                'server_name' => 'Server 2 (VidSrc Embed Player)',
                'stream_type' => 'embed',
                'stream_url' => 'https://vidsrc.to/embed/movie/27205',
                'quality' => 'Auto',
                'priority' => 2,
            ],
        ]);

        $movie2 = Movie::updateOrCreate(
            ['slug' => 'interstellar-2014'],
            [
                'tmdb_id' => 157336,
                'title' => 'Interstellar',
                'overview' => 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/rAiYTsqJJR9asvkRnb0AQ0Sp85q.jpg',
                'release_date' => '2014-11-05',
                'duration_minutes' => 169,
                'rating' => 8.7,
                'genres' => ['Adventure', 'Drama', 'Sci-Fi'],
                'is_published' => true,
                'is_featured' => true,
                'views' => 2100,
            ]
        );

        $movie2->streams()->delete();
        $movie2->streams()->create([
            'server_name' => 'Server 1 (Primary HLS)',
            'stream_type' => 'hls',
            'stream_url' => 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            'quality' => '1080p',
            'priority' => 1,
        ]);
    }
}
