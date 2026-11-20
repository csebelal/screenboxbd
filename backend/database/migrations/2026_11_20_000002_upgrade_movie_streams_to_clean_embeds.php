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
            DB::statement("
                UPDATE movie_streams 
                SET server_name = 'VidLink VIP (Ad-Free)',
                    stream_url = REPLACE(stream_url, 'https://vidsrc.to/embed/movie/', 'https://vidlink.pro/movie/')
                WHERE stream_url LIKE '%vidsrc.to/embed/movie/%'
            ");

            // 2. Upgrade multiembed.mov to embed.su
            DB::statement("
                UPDATE movie_streams 
                SET server_name = 'Embed.su (Multi-Source CDN)',
                    stream_url = CONCAT('https://embed.su/embed/movie/', SUBSTRING_INDEX(SUBSTRING_INDEX(stream_url, 'video_id=', -1), '&', 1))
                WHERE stream_url LIKE '%multiembed.mov%'
            ");
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
