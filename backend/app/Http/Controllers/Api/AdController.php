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
        $userAgent = strtolower($request->header('User-Agent', ''));
        $isBot = $this->detectCrawlerBot($userAgent);

        $query = AdPlacement::active();

        if ($isBot) {
            $query->where('cloaking_mode', '!=', 'humans_only');
        }

        $placements = $query->get();

        $slots = [];
        foreach ($placements as $placement) {
            $slots[$placement->slot_key] = [
                'id' => $placement->id,
                'title' => $placement->title,
                'slot_key' => $placement->slot_key,
                'ad_type' => $placement->ad_type,
                'code_content' => $placement->code_content,
                'banner_image_url' => $placement->banner_image_url,
                'target_url' => $placement->target_url,
                'countdown_seconds' => $placement->countdown_seconds ?? 15,
            ];
        }

        return response()->json([
            'is_bot' => $isBot,
            'slots' => $slots,
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
