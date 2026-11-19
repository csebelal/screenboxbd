<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamProxyController extends Controller
{
    /**
     * Proxy HLS manifest (.m3u8) or stream segments (.ts) to bypass CORS.
     */
    public function proxy(Request $request)
    {
        // Handle CORS preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            return response('', 204)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
                ->header('Access-Control-Allow-Headers', '*');
        }

        $targetUrl = $request->query('url');
        if (!$targetUrl || !filter_var($targetUrl, FILTER_VALIDATE_URL) || !$this->isSafeTargetUrl($targetUrl)) {
            return response()->json(['error' => 'Invalid, missing, or blocked target URL.'], 403);
        }

        // Prepare request headers to pass along (spoof User-Agent / Referer if needed)
        $clientHeaders = [
            'User-Agent' => $request->header('User-Agent') ?: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept' => '*/*',
        ];

        if ($request->hasHeader('Range')) {
            $clientHeaders['Range'] = $request->header('Range');
        }

        try {
            // Determine if target URL is likely an M3U8 manifest or a binary video segment (.ts / .m4s / .mp4)
            $isM3u8 = str_contains(strtolower($targetUrl), '.m3u8') || str_contains(strtolower($targetUrl), 'manifest');

            if ($isM3u8) {
                return $this->proxyM3u8Manifest($targetUrl, $clientHeaders);
            }

            return $this->proxyBinarySegment($targetUrl, $clientHeaders);
        } catch (\Throwable $e) {
            Log::error("Stream Proxy Error: {$e->getMessage()}", ['url' => $targetUrl]);
            return response()->json(['error' => 'Unable to proxy requested stream.'], 502);
        }
    }

    /**
     * Prevent SSRF: block loopback, cloud metadata services, and invalid schemes.
     */
    protected function isSafeTargetUrl(string $url): bool
    {
        $parsed = parse_url($url);
        if (!$parsed || empty($parsed['scheme']) || empty($parsed['host'])) {
            return false;
        }

        // Enforce HTTP / HTTPS only
        $scheme = strtolower($parsed['scheme']);
        if (!in_array($scheme, ['http', 'https'], true)) {
            return false;
        }

        $host = strtolower($parsed['host']);

        // Block loopback, localhost, and metadata hosts
        $blockedHosts = [
            'localhost',
            '127.0.0.1',
            '::1',
            '0.0.0.0',
            '169.254.169.254',
            'metadata.google.internal',
            'instance-data',
        ];

        if (in_array($host, $blockedHosts, true)) {
            return false;
        }

        // Check if host is an IP in loopback (127.0.0.0/8) or link-local/cloud metadata (169.254.0.0/16)
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            if (str_starts_with($host, '127.') || str_starts_with($host, '169.254.') || $host === '0.0.0.0') {
                return false;
            }
        }

        return true;
    }

    /**
     * Rewrite M3U8 manifests so relative and absolute segment URLs route through proxy.
     */
    protected function proxyM3u8Manifest(string $targetUrl, array $headers)
    {
        $urlHash = md5($targetUrl);
        if (\Illuminate\Support\Facades\Cache::has("dead_stream_{$urlHash}")) {
            return response('Stream offline', 504)
                ->header('Access-Control-Allow-Origin', '*');
        }

        try {
            $response = Http::connectTimeout(2)
                ->timeout(4)
                ->withoutVerifying()
                ->withHeaders($headers)
                ->get($targetUrl);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Cache::put("dead_stream_{$urlHash}", true, 30);
            return response('Stream unreachable', 504)
                ->header('Access-Control-Allow-Origin', '*');
        }

        if (!$response->successful()) {
            return response($response->body(), $response->status())
                ->header('Access-Control-Allow-Origin', '*');
        }

        $content = $response->body();
        $lines = preg_split("/\r\n|\n|\r/", $content);
        $baseUrl = substr($targetUrl, 0, strrpos($targetUrl, '/') + 1);

        $rewrittenLines = [];
        $proxyBaseUrl = url('/api/v1/stream/proxy') . '?url=';

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if ($trimmed === '') {
                $rewrittenLines[] = $line;
                continue;
            }

            // Check for URI="..." inside tags (e.g. #EXT-X-KEY, #EXT-X-MAP, #EXT-X-MEDIA)
            if (str_starts_with($trimmed, '#')) {
                if (preg_match('/URI="([^"]+)"/', $trimmed, $matches)) {
                    $originalUri = $matches[1];
                    $resolved = $this->resolveRelativeUrl($baseUrl, $originalUri);
                    $proxiedUri = $proxyBaseUrl . urlencode($resolved);
                    $line = str_replace('URI="' . $originalUri . '"', 'URI="' . $proxiedUri . '"', $line);
                }
                $rewrittenLines[] = $line;
                continue;
            }

            // Line is a stream or segment URL
            $resolved = $this->resolveRelativeUrl($baseUrl, $trimmed);
            $rewrittenLines[] = $proxyBaseUrl . urlencode($resolved);
        }

        $rewrittenContent = implode("\n", $rewrittenLines);

        return response($rewrittenContent, 200)
            ->header('Content-Type', 'application/vnd.apple.mpegurl')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
            ->header('Access-Control-Allow-Headers', '*')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    /**
     * Stream binary video segments (.ts, .aac, .m4s) with chunked transfer.
     */
    protected function proxyBinarySegment(string $targetUrl, array $headers)
    {
        return new StreamedResponse(function () use ($targetUrl, $headers) {
            $ch = curl_init($targetUrl);
            curl_setopt_array($ch, [
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_CONNECTTIMEOUT => 2,
                CURLOPT_TIMEOUT => 5,
                CURLOPT_WRITEFUNCTION => function ($ch, $data) {
                    echo $data;
                    flush();
                    return strlen($data);
                },
                CURLOPT_HTTPHEADER => array_map(
                    fn ($k, $v) => "{$k}: {$v}",
                    array_keys($headers),
                    array_values($headers)
                ),
            ]);

            curl_exec($ch);
            curl_close($ch);
        }, 200, [
            'Content-Type' => 'video/MP2T',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers' => '*',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    /**
     * Helper to resolve relative URLs against base URL.
     */
    protected function resolveRelativeUrl(string $baseUrl, string $relative): string
    {
        if (str_starts_with($relative, 'http://') || str_starts_with($relative, 'https://')) {
            return $relative;
        }

        if (str_starts_with($relative, '//')) {
            return 'https:' . $relative;
        }

        if (str_starts_with($relative, '/')) {
            $parsed = parse_url($baseUrl);
            $scheme = $parsed['scheme'] ?? 'https';
            $host = $parsed['host'] ?? '';
            $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
            return "{$scheme}://{$host}{$port}{$relative}";
        }

        return $baseUrl . $relative;
    }
}
