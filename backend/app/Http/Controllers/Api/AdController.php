<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdPlacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdController extends Controller
{
    /**
     * Return active ad units and betting sponsorships grouped by placement slot.
     */
    public function getSlots(Request $request): JsonResponse
    {
        // All monetization ads and betting slots permanently disabled
        return response()->json([
            'is_bot' => false,
            'slots' => (object) [],
        ]);
    }

    /**
     * Lightweight bot detection for AdSense safe cloaking.
     */
    protected function detectCrawlerBot(string $userAgent): bool
    {
        if (empty($userAgent)) {
            return false;
        }

        $botPatterns = [
            'googlebot',
            'bingbot',
            'slurp',
            'duckduckbot',
            'baiduspider',
            'yandexbot',
            'sogou',
            'exabot',
            'facebot',
            'ia_archiver',
            'headlesschrome',
            'lighthouse',
            'mediapartners-google',
            'adsbot-google',
        ];

        foreach ($botPatterns as $pattern) {
            if (str_contains($userAgent, $pattern)) {
                return true;
            }
        }

        return false;
    }
}
