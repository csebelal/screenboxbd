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
                'server_name' => 'VidLink VIP (Ad-Free Fast)',
                'stream_type' => 'embed',
                'stream_url' => "https://vidlink.pro/movie/{$tmdbId}",
                'quality' => '1080p',
                'priority' => 10,
                'is_embed' => true,
            ],
            [
                'id' => 1002,
                'server_name' => 'Embed.su (Multi-Source CDN)',
                'stream_type' => 'embed',
                'stream_url' => "https://embed.su/embed/movie/{$tmdbId}",
                'quality' => '1080p',
                'priority' => 20,
                'is_embed' => true,
            ],
            [
                'id' => 1003,
                'server_name' => 'VidSrc v2 Clean',
                'stream_type' => 'embed',
                'stream_url' => "https://vidsrc.cc/v2/embed/movie/{$tmdbId}",
                'quality' => '1080p',
                'priority' => 25,
                'is_embed' => true,
            ],
            [
                'id' => 1004,
                'server_name' => 'AutoEmbed (Fast CDN)',
                'stream_type' => 'embed',
                'stream_url' => "https://player.autoembed.cc/embed/movie/{$tmdbId}",
                'quality' => '1080p',
                'priority' => 30,
                'is_embed' => true,
            ],
        ];

        if ($imdbId) {
            $servers[] = [
                'id' => 1006,
                'server_name' => 'IMDb Alternate Stream',
                'stream_type' => 'embed',
                'stream_url' => "https://vidlink.pro/movie/{$imdbId}",
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
                'server_name' => 'VidLink VIP (Ad-Free Fast)',
                'stream_type' => 'embed',
                'stream_url' => "https://vidlink.pro/tv/{$tmdbId}/{$season}/{$episode}",
                'quality' => '1080p',
                'priority' => 10,
                'is_embed' => true,
            ],
            [
                'id' => 2002,
                'server_name' => 'Embed.su (Multi-Source CDN)',
                'stream_type' => 'embed',
                'stream_url' => "https://embed.su/embed/tv/{$tmdbId}/{$season}/{$episode}",
                'quality' => 'Auto',
                'priority' => 20,
                'is_embed' => true,
            ],
            [
                'id' => 2003,
                'server_name' => 'VidSrc v2 Clean',
                'stream_type' => 'embed',
                'stream_url' => "https://vidsrc.cc/v2/embed/tv/{$tmdbId}/{$season}/{$episode}",
                'quality' => '1080p',
                'priority' => 25,
                'is_embed' => true,
            ],
            [
                'id' => 2004,
                'server_name' => 'AutoEmbed (Fast CDN)',
                'stream_type' => 'embed',
                'stream_url' => "https://player.autoembed.cc/embed/tv/{$tmdbId}/{$season}/{$episode}",
                'quality' => '1080p',
                'priority' => 30,
                'is_embed' => true,
            ],
        ];
    }
}
