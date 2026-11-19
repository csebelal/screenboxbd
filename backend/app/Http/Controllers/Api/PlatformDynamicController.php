<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Faq;
use App\Models\Setting;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlatformDynamicController extends Controller
{
    /**
     * Get all public platform settings
     */
    public function settings(): JsonResponse
    {
        $settings = \Illuminate\Support\Facades\Cache::remember('platform_settings_public', 300, function () {
            return Setting::getAllPublic();
        });

        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ])->header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    }

    /**
     * Get active subscription plans
     */
    public function plans(): JsonResponse
    {
        $plans = \Illuminate\Support\Facades\Cache::remember('platform_subscription_plans', 300, function () {
            return SubscriptionPlan::where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get();
        });

        return response()->json([
            'status' => 'success',
            'data' => $plans,
        ])->header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    }

    /**
     * Get active FAQs
     */
    public function faqs(Request $request): JsonResponse
    {
        $category = $request->query('category', 'all');
        $cacheKey = "platform_faqs_{$category}";

        $faqs = \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Faq::where('is_active', true);

            if ($request->filled('category')) {
                $query->where('category', $request->query('category'));
            }

            return $query->orderBy('sort_order')->orderBy('id')->get();
        });

        return response()->json([
            'status' => 'success',
            'data' => $faqs,
        ])->header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    }

    /**
     * Get published blog posts
     */
    public function blogs(Request $request): JsonResponse
    {
        $query = BlogPost::where('is_published', true);

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('search')) {
            $search = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', $search)
                  ->orWhere('summary', 'ilike', $search);
            });
        }

        $perPage = min((int) $request->query('per_page', 12), 50);
        $posts = $query->orderByDesc('published_at')->orderByDesc('id')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Get single blog post by slug
     */
    public function blogDetail(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Increment views safely
        $post->increment('views');

        return response()->json([
            'status' => 'success',
            'data' => $post,
        ]);
    }
}
