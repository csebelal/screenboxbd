<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Channel;
use App\Models\ChannelStream;
use App\Models\Movie;
use App\Services\TmdbService;
use Tests\TestCase;

class CoreEngineApiTest extends TestCase
{
    public function test_api_health_endpoint(): void
    {
        $response = $this->getJson('/api/v1/health');
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'online',
                'service' => 'StreamTV Core API',
                'version' => 'v1',
            ]);
    }

    public function test_categories_api_endpoint(): void
    {
        $response = $this->getJson('/api/v1/categories?type=tv');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'type', 'sort_order', 'channels_count']
                ]
            ]);
    }

    public function test_channels_api_list_and_detail(): void
    {
        $channel = Channel::active()->first();
        $this->assertNotNull($channel);

        // Test list
        $response = $this->getJson('/api/v1/channels?per_page=5');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'logo_url', 'country', 'streams']
                ]
            ]);

        // Test detail
        $detailResponse = $this->getJson("/api/v1/channels/{$channel->slug}");
        $detailResponse->assertStatus(200)
            ->assertJsonPath('data.slug', $channel->slug)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'slug', 'streams']
            ]);
    }

    public function test_movies_api_list_and_detail(): void
    {
        $movie = Movie::published()->first();
        $this->assertNotNull($movie);

        // Test list
        $response = $this->getJson('/api/v1/movies?per_page=5');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'tmdb_id', 'title', 'slug', 'rating', 'genres']
                ]
            ]);

        // Test detail
        $detailResponse = $this->getJson("/api/v1/movies/{$movie->slug}");
        $detailResponse->assertStatus(200)
            ->assertJsonPath('data.slug', $movie->slug)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'slug', 'rating', 'genres'],
                'related' => []
            ]);
    }

    public function test_home_aggregated_endpoint(): void
    {
        $response = $this->getJson('/api/v1/home');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'hero',
                    'featured_channels',
                    'trending_movies',
                    'latest_movies',
                    'popular_series',
                    'categories',
                ]
            ]);
    }

    public function test_stream_proxy_validates_url(): void
    {
        $response = $this->getJson('/api/v1/stream/proxy?url=invalid-url');
        $response->assertStatus(400);

        // Test OPTIONS preflight request
        $optionsResponse = $this->options('/api/v1/stream/proxy');
        $optionsResponse->assertStatus(204)
            ->assertHeader('Access-Control-Allow-Origin', '*');
    }

    public function test_stream_proxy_rewrites_m3u8_manifest(): void
    {
        \Illuminate\Support\Facades\Http::fake([
            'example.com/playlist.m3u8*' => \Illuminate\Support\Facades\Http::response(
                "#EXTM3U\n#EXTINF:10.0,\nchunk1.ts\n#EXTINF:10.0,\nchunk2.ts",
                200,
                ['Content-Type' => 'application/vnd.apple.mpegurl']
            ),
        ]);

        $response = $this->get('/api/v1/stream/proxy?url=' . urlencode('https://example.com/playlist.m3u8'));
        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/vnd.apple.mpegurl')
            ->assertHeader('Access-Control-Allow-Origin', '*');

        $content = $response->getContent();
        $this->assertStringContainsString('/api/v1/stream/proxy?url=', $content);
        $this->assertStringContainsString(urlencode('https://example.com/chunk1.ts'), $content);
        $this->assertStringContainsString(urlencode('https://example.com/chunk2.ts'), $content);
    }

    public function test_tmdb_service_formats_metadata_correctly(): void
    {
        $tmdb = app(TmdbService::class);
        $raw = [
            'id' => 550,
            'title' => 'Fight Club',
            'overview' => 'An insomniac office worker...',
            'poster_path' => '/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg',
            'backdrop_path' => '/c6OLXfKAk5BKeR6broC8pYiCquX.jpg',
            'release_date' => '1999-10-15',
            'runtime' => 139,
            'vote_average' => 8.433,
            'genres' => [
                ['id' => 18, 'name' => 'Drama'],
                ['id' => 53, 'name' => 'Thriller'],
            ],
        ];

        $formatted = $tmdb->formatMovieData($raw);

        $this->assertEquals(550, $formatted['tmdb_id']);
        $this->assertEquals('Fight Club', $formatted['title']);
        $this->assertEquals('fight-club', $formatted['slug']);
        $this->assertEquals(139, $formatted['duration_minutes']);
        $this->assertEquals(8.4, $formatted['rating']);
        $this->assertEquals(['Drama', 'Thriller'], $formatted['genres']);
        $this->assertStringContainsString('https://image.tmdb.org/t/p/w500', $formatted['poster_url']);
    }
}
