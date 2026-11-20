<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('movie_streams')) {
            // 1. Upgrade vidsrc.to (ad-heavy with reCAPTCHA) to vidlink.pro (ad-free clean)
            DB::table('movie_streams')
                ->where('stream_url', 'like', '%vidsrc.to/embed/movie/%')
                ->get()
                ->each(function ($stream) {
                    DB::table('movie_streams')
                        ->where('id', $stream->id)
                        ->update([
                            'server_name' => 'VidLink VIP (Ad-Free)',
                            'stream_url' => str_replace('https://vidsrc.to/embed/movie/', 'https://vidlink.pro/movie/', $stream->stream_url),
                        ]);
                });

            // 2. Upgrade multiembed.mov to embed.su
            DB::table('movie_streams')
                ->where('stream_url', 'like', '%multiembed.mov%')
                ->get()
                ->each(function ($stream) {
                    parse_str(parse_url($stream->stream_url, PHP_URL_QUERY) ?? '', $queryParams);
                    $videoId = $queryParams['video_id'] ?? null;
                    if ($videoId) {
                        DB::table('movie_streams')
                            ->where('id', $stream->id)
                            ->update([
                                'server_name' => 'Embed.su (Multi-Source CDN)',
                                'stream_url' => 'https://embed.su/embed/movie/' . $videoId,
                            ]);
                    }
                });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed
    }
};
