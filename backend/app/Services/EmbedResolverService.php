<?php

namespace App\Services;

class EmbedResolverService
{
    /**
     * Generate fallback multi-server embed sources for a movie based on TMDB / IMDB ID.
     *
     * @param int|string $tmdbId
     * @param string|null $imdbId
     * @return array
     */
    public function getMovieEmbedServers(int|string $tmdbId, ?string $imdbId = null): array
    {
        $servers = [
            [
                'id' => 1001,
                'server_name' => 'VidSrc Cloud (1080p Ultra)',
                'stream_type' => 'embed',
                'stream_url' => "https://vidsrc.to/embed/movie/{$tmdbId}",
                'quality' => '1080p',
                'priority' => 10,
                'is_embed' => true,
            ],
            [
                'id' => 1002,
                'server_name' => 'SuperEmbed (Auto Multi-Source)',
                'stream_type' => 'embed',
                'stream_url' => "https://multiembed.mov/?video_id={$tmdbId}&tmdb=1",
                'quality' => 'Auto',
                'priority' => 20,
                'is_embed' => true,
            ],
            [
                'id' => 1003,
                'server_name' => 'AutoEmbed (Fast CDN)',
                'stream_type' => 'embed',
                'stream_url' => "https://player.autoembed.cc/embed/movie/{$tmdbId}",
                'quality' => '1080p',
                'priority' => 25,
                'is_embed' => true,
            ],
            [
                'id' => 1004,
                'server_name' => '2Embed (HD Stream)',
                'stream_type' => 'embed',
                'stream_url' => "https://www.2embed.cc/embed/{$tmdbId}",
                'quality' => '720p',
                'priority' => 30,
                'is_embed' => true,
            ],
            [
                'id' => 1005,
                'server_name' => 'SmashyStream (VIP)',
                'stream_type' => 'embed',
                'stream_url' => "https://embed.smashystream.com/playere.php?tmdb={$tmdbId}",
                'quality' => '1080p',
                'priority' => 35,
                'is_embed' => true,
            ],
            [
                'id' => 1006,
                'server_name' => 'VidSrc Pro (Backup)',
                'stream_type' => 'embed',
                'stream_url' => "https://vidsrc.me/embed/movie?tmdb={$tmdbId}",
                'quality' => '1080p',
                'priority' => 40,
                'is_embed' => true,
            ],
        ];

        if ($imdbId) {
            $servers[] = [
                'id' => 1007,
                'server_name' => 'IMDb Alternate Stream',
                'stream_type' => 'embed',
                'stream_url' => "https://vidsrc.xyz/embed/movie?imdb={$imdbId}",
                'quality' => 'Auto',
                'priority' => 50,
                'is_embed' => true,
            ];
        }

        return $servers;
    }

    /**
     * Generate fallback multi-server embed sources for a TV episode.
     *
     * @param int|string $tmdbId
     * @param int $season
     * @param int $episode
     * @param string|null $imdbId
     * @return array
     */
    public function getEpisodeEmbedServers(int|string $tmdbId, int $season, int $episode, ?string $imdbId = null): array
    {
        return [
            [
                'id' => 2001,
                'server_name' => 'VidSrc Cloud (1080p)',
                'stream_type' => 'embed',
                'stream_url' => "https://vidsrc.to/embed/tv/{$tmdbId}/{$season}/{$episode}",
                'quality' => '1080p',
                'priority' => 10,
                'is_embed' => true,
            ],
            [
                'id' => 2002,
                'server_name' => 'SuperEmbed (Multi-Source)',
                'stream_type' => 'embed',
                'stream_url' => "https://multiembed.mov/?video_id={$tmdbId}&tmdb=1&s={$season}&e={$episode}",
                'quality' => 'Auto',
                'priority' => 20,
                'is_embed' => true,
            ],
            [
                'id' => 2003,
                'server_name' => 'AutoEmbed (Fast CDN)',
                'stream_type' => 'embed',
                'stream_url' => "https://player.autoembed.cc/embed/tv/{$tmdbId}/{$season}/{$episode}",
                'quality' => '1080p',
                'priority' => 25,
                'is_embed' => true,
            ],
            [
                'id' => 2004,
                'server_name' => '2Embed (HD Stream)',
                'stream_type' => 'embed',
                'stream_url' => "https://www.2embed.cc/embedtv/{$tmdbId}&s={$season}&e={$episode}",
                'quality' => '720p',
                'priority' => 30,
                'is_embed' => true,
            ],
            [
                'id' => 2005,
                'server_name' => 'SmashyStream (VIP)',
                'stream_type' => 'embed',
                'stream_url' => "https://embed.smashystream.com/playere.php?tmdb={$tmdbId}&season={$season}&episode={$episode}",
                'quality' => '1080p',
                'priority' => 35,
                'is_embed' => true,
            ],
            [
                'id' => 2006,
                'server_name' => 'VidSrc Pro (Backup)',
                'stream_type' => 'embed',
                'stream_url' => "https://vidsrc.me/embed/tv?tmdb={$tmdbId}&season={$season}&episode={$episode}",
                'quality' => '1080p',
                'priority' => 40,
                'is_embed' => true,
            ],
        ];
    }
}
