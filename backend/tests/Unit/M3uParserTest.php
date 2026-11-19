<?php

namespace Tests\Unit;

use App\Services\M3uParserService;
use PHPUnit\Framework\TestCase;

class M3uParserTest extends TestCase
{
    public function test_it_parses_extinf_attributes_correctly(): void
    {
        $parser = new M3uParserService();

        $line = '#EXTINF:-1 tvg-id="BanglaVision.bd@SD" tvg-name="Bangla Vision" tvg-logo="https://i.imgur.com/nCWgp38.png" group-title="General",Bangla Vision (1080p)';
        $parsed = $parser->parseExtInf($line);

        $this->assertEquals('Bangla Vision (1080p)', $parsed['name']);
        $this->assertEquals('BanglaVision.bd@SD', $parsed['tvg_id']);
        $this->assertEquals('Bangla Vision', $parsed['tvg_name']);
        $this->assertEquals('https://i.imgur.com/nCWgp38.png', $parsed['logo_url']);
        $this->assertEquals('General', $parsed['group_title']);
    }

    public function test_it_yields_items_from_m3u_content(): void
    {
        $parser = new M3uParserService();

        $content = <<<M3U
#EXTM3U
#EXTINF:-1 tvg-logo="https://example.com/logo1.png" group-title="Sports",Channel 1
https://example.com/stream1.m3u8
#EXTINF:-1 tvg-logo="https://example.com/logo2.png" group-title="News",Channel 2
https://example.com/stream2.m3u8
M3U;

        $items = iterator_to_array($parser->parseItems($content));

        $this->assertCount(2, $items);
        $this->assertEquals('Channel 1', $items[0]['name']);
        $this->assertEquals('https://example.com/stream1.m3u8', $items[0]['stream_url']);
        $this->assertEquals('Sports', $items[0]['group_title']);

        $this->assertEquals('Channel 2', $items[1]['name']);
        $this->assertEquals('https://example.com/stream2.m3u8', $items[1]['stream_url']);
        $this->assertEquals('News', $items[1]['group_title']);
    }
}
