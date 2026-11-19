<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Channel;
use App\Models\ChannelStream;
use Generator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class M3uParserService
{
    /**
     * Parse and import channels from file path, URL, or raw string.
     *
     * @param string $source File path, URL, or raw M3U string
     * @param array $options [default_category, default_country, limit, dry_run]
     * @return array Summary of import results
     */
    public function import(string $source, array $options = []): array
    {
        $defaultCategory = $options['default_category'] ?? 'General';
        $defaultCountry = $options['default_country'] ?? 'BD';
        $limit = isset($options['limit']) ? (int) $options['limit'] : null;
        $dryRun = (bool) ($options['dry_run'] ?? false);

        $stats = [
            'total_parsed' => 0,
            'channels_created' => 0,
            'channels_updated' => 0,
            'streams_created' => 0,
            'categories_created' => 0,
            'skipped' => 0,
            'errors' => 0,
        ];

        // Cache category IDs to minimize database queries
        $categoryCache = [];

        foreach ($this->parseItems($source) as $item) {
            $stats['total_parsed']++;

            if ($limit && $stats['total_parsed'] > $limit) {
                break;
            }

            if ($dryRun) {
                continue;
            }

            try {
                // 1. Resolve Category
                $catName = !empty($item['group_title']) && strtolower($item['group_title']) !== 'undefined'
                    ? trim($item['group_title'])
                    : $defaultCategory;

                $catSlug = Str::slug($catName);
                if (empty($catSlug)) {
                    $catSlug = 'general';
                    $catName = 'General';
                }

                if (!isset($categoryCache[$catSlug])) {
                    $category = Category::firstOrCreate(
                        ['slug' => $catSlug],
                        ['name' => $catName, 'type' => 'tv', 'sort_order' => 0]
                    );

                    if ($category->wasRecentlyCreated) {
                        $stats['categories_created']++;
                    }

                    $categoryCache[$catSlug] = $category->id;
                }

                $categoryId = $categoryCache[$catSlug];

                // 2. Resolve Channel Name & Slug
                $rawName = trim($item['name']);
                if (empty($rawName)) {
                    $stats['skipped']++;
                    continue;
                }

                // Clean name: e.g. "Aamar Bangla (720p)" -> "Aamar Bangla"
                $cleanName = preg_replace('/\s*\((?:1080p|720p|480p|360p|240p|HD|SD|FHD)\)\s*/i', '', $rawName);
                $cleanName = trim($cleanName ?: $rawName);
                $channelSlug = Str::slug($cleanName);

                if (empty($channelSlug)) {
                    $channelSlug = 'channel-' . Str::random(6);
                }

                // Find or create Channel
                $channel = Channel::where('slug', $channelSlug)->first();

                // Calculate priority based on channel name and category
                $isTSports = (bool) preg_match('/t\s*sports/i', $cleanName);
                $isBd = $catSlug === 'bangladesh' || $defaultCountry === 'BD';
                $channelOrder = $isTSports ? 1 : ($isBd ? 10 : 100);

                if (!$channel) {
                    $channel = Channel::create([
                        'category_id' => $categoryId,
                        'name' => $cleanName,
                        'slug' => $channelSlug,
                        'logo_url' => $item['logo_url'],
                        'country' => $item['country'] ?: $defaultCountry,
                        'is_active' => true,
                        'is_featured' => $isTSports || $isBd,
                        'sort_order' => $channelOrder,
                    ]);
                    $stats['channels_created']++;
                } else {
                    // Update logo if existing was null
                    if (empty($channel->logo_url) && !empty($item['logo_url'])) {
                        $channel->update(['logo_url' => $item['logo_url']]);
                        $stats['channels_updated']++;
                    }
                }

                // 3. Resolve Channel Stream
                $streamUrl = trim($item['stream_url']);
                if (empty($streamUrl)) {
                    continue;
                }

                // Check if exact stream already exists for this channel
                $existingStream = ChannelStream::where('channel_id', $channel->id)
                    ->where('stream_url', $streamUrl)
                    ->exists();

                if (!$existingStream) {
                    $streamCount = ChannelStream::where('channel_id', $channel->id)->count();
                    $serverName = $streamCount === 0 ? 'Server 1 (Primary)' : 'Server ' . ($streamCount + 1) . ' (Backup)';

                    ChannelStream::create([
                        'channel_id' => $channel->id,
                        'server_name' => $serverName,
                        'stream_url' => $streamUrl,
                        'headers' => $item['headers'] ?? null,
                        'is_active' => true,
                        'priority' => $streamCount + 1,
                    ]);
                    $stats['streams_created']++;
                }
            } catch (\Throwable $e) {
                $stats['errors']++;
                Log::error("M3U Import Item Error: {$e->getMessage()}", ['item' => $item]);
            }
        }

        return $stats;
    }

    /**
     * Generator that yields individual channel items parsed from M3U source.
     */
    public function parseItems(string $source): Generator
    {
        $currentItem = null;
        $headers = [];

        foreach ($this->getLines($source) as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#EXTM3U') || str_starts_with($line, '#PLAYLIST')) {
                continue;
            }

            // Parse VLCOPT headers (e.g. user-agent, referer)
            if (str_starts_with($line, '#EXTVLCOPT:')) {
                $opt = substr($line, 11);
                if (str_contains($opt, '=')) {
                    [$key, $val] = explode('=', $opt, 2);
                    $headers[trim($key)] = trim($val);
                }
                continue;
            }

            // Parse EXTINF line
            if (str_starts_with($line, '#EXTINF:')) {
                $currentItem = $this->parseExtInf($line);
                if (!empty($headers)) {
                    $currentItem['headers'] = $headers;
                    $headers = [];
                }
                continue;
            }

            // Next non-comment line should be the Stream URL
            if ($currentItem !== null && !str_starts_with($line, '#')) {
                $currentItem['stream_url'] = $line;
                yield $currentItem;
                $currentItem = null;
                $headers = [];
            }
        }
    }

    /**
     * Parse attributes from an #EXTINF line.
     */
    public function parseExtInf(string $line): array
    {
        // Extract display name after comma
        $commaPos = strrpos($line, ',');
        $displayName = $commaPos !== false ? trim(substr($line, $commaPos + 1)) : '';
        $attributesString = $commaPos !== false ? substr($line, 0, $commaPos) : $line;

        // Parse key="value" or key='value' attributes
        $tvgId = $this->extractAttribute($attributesString, 'tvg-id');
        $tvgName = $this->extractAttribute($attributesString, 'tvg-name');
        $tvgLogo = $this->extractAttribute($attributesString, 'tvg-logo');
        $groupTitle = $this->extractAttribute($attributesString, 'group-title');
        $tvgCountry = $this->extractAttribute($attributesString, 'tvg-country');

        $channelName = $displayName ?: ($tvgName ?: $tvgId);

        return [
            'name' => $channelName,
            'tvg_id' => $tvgId,
            'tvg_name' => $tvgName,
            'logo_url' => $tvgLogo,
            'group_title' => $groupTitle,
            'country' => $tvgCountry,
            'stream_url' => null,
            'headers' => null,
        ];
    }

    /**
     * Extract attribute value from attribute string.
     */
    protected function extractAttribute(string $line, string $key): ?string
    {
        $pattern = '/' . preg_quote($key, '/') . '\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s,]+))/i';
        if (preg_match($pattern, $line, $matches)) {
            $val = !empty($matches[1]) ? $matches[1] : (!empty($matches[2]) ? $matches[2] : ($matches[3] ?? ''));
            return trim($val);
        }
        return null;
    }

    /**
     * Memory-efficient line reader generator.
     */
    protected function getLines(string $source): Generator
    {
        // If source is a remote URL
        if (str_starts_with($source, 'http://') || str_starts_with($source, 'https://')) {
            $response = Http::timeout(30)
                ->withoutVerifying()
                ->get($source);

            if ($response->successful()) {
                $lines = preg_split("/\r\n|\n|\r/", $response->body());
                foreach ($lines as $line) {
                    yield $line;
                }
            }
            return;
        }

        // If source is an existing local file
        if (file_exists($source) && is_file($source)) {
            $handle = fopen($source, 'r');
            if ($handle) {
                while (($line = fgets($handle)) !== false) {
                    yield $line;
                }
                fclose($handle);
            }
            return;
        }

        // Otherwise treat source as raw M3U string content
        $lines = preg_split("/\r\n|\n|\r/", $source);
        foreach ($lines as $line) {
            yield $line;
        }
    }
}
