<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Live TV Categories
            ['name' => 'Bangla OTT', 'slug' => 'bangla-ott-tv', 'type' => 'tv', 'sort_order' => 0],
            ['name' => 'Sports', 'slug' => 'sports', 'type' => 'tv', 'sort_order' => 1],
            ['name' => 'News', 'slug' => 'news', 'type' => 'tv', 'sort_order' => 2],
            ['name' => 'Entertainment', 'slug' => 'entertainment', 'type' => 'tv', 'sort_order' => 3],
            ['name' => 'Infotainment', 'slug' => 'infotainment', 'type' => 'tv', 'sort_order' => 4],
            ['name' => 'Kids', 'slug' => 'kids', 'type' => 'tv', 'sort_order' => 5],
            ['name' => 'Music', 'slug' => 'music', 'type' => 'tv', 'sort_order' => 6],

            // Movie Categories / Genres
            ['name' => 'Bangla OTT', 'slug' => 'bangla-ott', 'type' => 'movie', 'sort_order' => 0],
            ['name' => 'Action & Adventure', 'slug' => 'action-adventure', 'type' => 'movie', 'sort_order' => 1],
            ['name' => 'Sci-Fi & Fantasy', 'slug' => 'sci-fi-fantasy', 'type' => 'movie', 'sort_order' => 2],
            ['name' => 'Thriller & Crime', 'slug' => 'thriller-crime', 'type' => 'movie', 'sort_order' => 3],
            ['name' => 'Comedy', 'slug' => 'comedy', 'type' => 'movie', 'sort_order' => 4],
            ['name' => 'Drama & Romance', 'slug' => 'drama-romance', 'type' => 'movie', 'sort_order' => 5],

            // Series Categories
            ['name' => 'Bangla OTT', 'slug' => 'bangla-ott-series', 'type' => 'series', 'sort_order' => 0],
            ['name' => 'Trending Web Series', 'slug' => 'trending-web-series', 'type' => 'series', 'sort_order' => 1],
            ['name' => 'Anime Series', 'slug' => 'anime-series', 'type' => 'series', 'sort_order' => 2],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => $cat['slug']],
                [
                    'name' => $cat['name'],
                    'type' => $cat['type'],
                    'sort_order' => $cat['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
