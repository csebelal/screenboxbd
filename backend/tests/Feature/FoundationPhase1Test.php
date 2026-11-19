<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Channel;
use App\Models\ChannelStream;
use App\Models\Episode;
use App\Models\Movie;
use App\Models\MovieStream;
use App\Models\Season;
use App\Models\Series;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FoundationPhase1Test extends TestCase
{
    /**
     * Test admin user panel access check.
     */
    public function test_admin_can_access_filament_panel(): void
    {
        $admin = User::where('email', 'admin@streamtv.test')->first();
        $this->assertNotNull($admin);
        $this->assertEquals('admin', $admin->role);

        $filamentPanel = \Filament\Facades\Filament::getPanel('admin');
        $this->assertTrue($admin->canAccessPanel($filamentPanel));

        $regularUser = User::make(['role' => 'user']);
        $this->assertFalse($regularUser->canAccessPanel($filamentPanel));
    }

    /**
     * Test categories and channel relationships.
     */
    public function test_categories_and_channels_relation(): void
    {
        $category = Category::where('type', 'tv')->first();
        $this->assertNotNull($category);

        $channel = Channel::where('category_id', $category->id)->first();
        $this->assertNotNull($channel);
        $this->assertEquals($category->id, $channel->category->id);

        $this->assertGreaterThan(0, $channel->streams->count());
        $firstStream = $channel->streams->first();
        $this->assertNotNull($firstStream->stream_url);

        // Verify JSONB headers field works
        if ($firstStream->headers) {
            $this->assertIsArray($firstStream->headers);
        }
    }

    /**
     * Test movies and movie streams with JSONB genres.
     */
    public function test_movies_and_streams_with_jsonb_genres(): void
    {
        $movie = Movie::where('tmdb_id', 27205)->orWhere('slug', 'inception')->orWhere('slug', 'inception-2010')->first();
        $this->assertNotNull($movie);
        $this->assertIsArray($movie->genres);
        $this->assertContains('Action', $movie->genres);

        $this->assertGreaterThan(0, $movie->streams->count());
        $stream = $movie->streams->first();
        $this->assertNotNull($stream->stream_url);
        $this->assertEquals('hls', $stream->stream_type);
    }

    /**
     * Test series, seasons, and episodes relational hierarchy.
     */
    public function test_series_seasons_and_episodes_hierarchy(): void
    {
        $series = Series::create([
            'title' => 'Stranger Events',
            'slug' => 'stranger-events',
            'genres' => ['Drama', 'Mystery'],
            'rating' => 8.5,
        ]);

        $season = $series->seasons()->create([
            'season_number' => 1,
            'title' => 'Season 1',
        ]);

        $episode = $season->episodes()->create([
            'episode_number' => 1,
            'title' => 'Chapter One',
            'duration_minutes' => 50,
        ]);

        $stream = $episode->streams()->create([
            'server_name' => 'Fast Server',
            'stream_type' => 'hls',
            'stream_url' => 'https://example.com/ep1.m3u8',
            'quality' => '1080p',
        ]);

        $this->assertEquals(1, $series->seasons()->count());
        $this->assertEquals(1, $season->episodes()->count());
        $this->assertEquals('Chapter One', $episode->title);
        $this->assertEquals('https://example.com/ep1.m3u8', $stream->stream_url);

        // Cleanup
        $series->delete();
    }

    /**
     * Test Filament admin login page is accessible.
     */
    public function test_filament_admin_page_loads(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
    }
}
